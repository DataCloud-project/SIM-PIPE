
import os
import subprocess
import getpass

def ensure_secrets(env=None):
    if env is None:
        env = os.environ.copy()

    # --- Ensure required secrets exist ---
    required_secrets = [
        {
            "name": "simpipe-moose-api",
            "key": "MOOSE_API_KEY",
            "prompt": "Enter MOOSE_API_KEY (leave blank to skip): "
        },
        {
            "name": "simpipe-openrouter-api",
            "key": "OPENROUTER_API_KEY",
            "prompt": "Enter OPENROUTER_API_KEY (leave blank to skip): "
        },
        {
            "name": "simpipe-openrouter-api-paid",
            "key": "OPENROUTER_API_KEY_PAID",
            "prompt": "Enter OPENROUTER_API_KEY_PAID (leave blank to skip): "
        },
    ]
    for secret in required_secrets:
        # Check if secret exists
        result = subprocess.run([
            "kubectl", "get", "secret", secret["name"], "--namespace", "default"
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=env)
        if result.returncode != 0:
            value = getpass.getpass(secret["prompt"])
            # Always create the secret so the controller pods don't crash;
            # if the user skips input, store an empty string as the value.
            if not value:
                value = ""
                print(f"Creating secret {secret['name']} with empty value (user skipped input)...")
            else:
                print(f"Creating secret {secret['name']}...")

            subprocess.run([
                "kubectl", "create", "secret", "generic", secret["name"],
                f"--from-literal={secret['key']}={value}",
                "--namespace", "default"
            ], check=True, env=env)

    # --- Ensure k3s-cluster-secret exists ---
    k3s_secret_name = "k3s-cluster-secret"
    k3s_token_path = "/var/lib/rancher/k3s/server/node-token"
    # Check if secret exists
    result = subprocess.run([
        "kubectl", "get", "secret", k3s_secret_name, "--namespace", "default"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=env)
    
    if result.returncode != 0:
        # Read token from file, try sudo if permission denied
        k3s_token = None
        try:
            with open(k3s_token_path, "r") as f:
                k3s_token = f.read().strip()
        except PermissionError:
            print(f"Permission denied reading {k3s_token_path}. Trying with sudo...")
            try:
                result = subprocess.run(["sudo", "cat", k3s_token_path], capture_output=True, text=True, env=env)
                if result.returncode == 0:
                    k3s_token = result.stdout.strip()
                else:
                    print(f"sudo failed: {result.stderr.strip()}")
            except Exception as e:
                print(f"sudo failed: {e}")
        except FileNotFoundError:
             # If k3s is not installed yet or file is missing, we can't create the secret.
             # This might happen if 'ensure_secrets' is called before k3s install in some flows,
             # but here we call it after k3s install.
             print(f"Warning: {k3s_token_path} not found. Skipping {k3s_secret_name} creation.")
             return

        except Exception as e:
            print(f"Could not read k3s node token from {k3s_token_path}: {e}")
            
        # Get server IP from kubectl get nodes (prefer control-plane, fallback to first node)
        k3s_server_ip = None
        try:
            # Try to get control-plane node IP
            get_cp = subprocess.run([
                "kubectl", "get", "nodes", "-o",
                "jsonpath={.items[?(@.metadata.labels['node-role.kubernetes.io/control-plane'])].status.addresses[?(@.type=='InternalIP')].address}"
            ], capture_output=True, text=True, env=env)
            ip = get_cp.stdout.strip()
            if not ip:
                # Fallback: get first node's InternalIP
                get_any = subprocess.run([
                    "kubectl", "get", "nodes", "-o",
                    "jsonpath={.items[0].status.addresses[?(@.type=='InternalIP')].address}"
                ], capture_output=True, text=True, env=env)
                ip = get_any.stdout.strip()
            
            if ip:
                # In dual-stack environments, kubectl might return multiple space-separated IPs.
                # We only want the first one (usually IPv4).
                k3s_server_ip = ip.split()[0]
        except Exception as e:
            print(f"Could not get k3s server IP: {e}")

        # Truncate token part after :: if present
        if k3s_token and "::" in k3s_token:
            k3s_token = k3s_token.split(":")[0]
            
        if k3s_token and k3s_server_ip:
            print(f"Creating secret {k3s_secret_name}...")
            subprocess.run([
                "kubectl", "create", "secret", "generic", k3s_secret_name,
                f"--from-literal=token={k3s_token}",
                f"--from-literal=K3S_SERVER_IP={k3s_server_ip}",
                "--namespace", "default"
            ], check=True, env=env)
        else:
            print(f"Skipping creation of {k3s_secret_name} (token or server IP not found)")
