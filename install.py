#!/usr/bin/env python3

import argparse
import getpass
import json
import os
import platform
import pwd
import re
import subprocess
import sys
import tempfile

from checklist import (check_ansible_installed, check_debian_or_ubuntu,
                      check_helm_diff_installed, check_if_installed,
                      check_simpipe_deployment_presence,
                      check_tools_installed)


def get_current_username():
    """Return the current username in a way that works in WSL2 and non-login shells.

    os.getlogin() relies on a controlling terminal and can fail in WSL2 or when
    there is no utmp entry (for example when started from some IDEs). This
    helper falls back to environment-based and uid-based lookups.
    """
    try:
        return os.getlogin()
    except OSError:
        # Fallback to getpass (LOGNAME/USER/...) and then to pwd lookup
        try:
            return getpass.getuser()
        except Exception:
            return pwd.getpwuid(os.getuid()).pw_name


def get_current_groups():
    """Retrieve the group names a user is a member of by parsing /etc/group."""
    groups = set()
    username = get_current_username()
    
    # First, get the primary group from /etc/passwd
    try:
        user_info = pwd.getpwnam(username)
        primary_gid = user_info.pw_gid
        # Get primary group name from /etc/group
        with open('/etc/group', 'r') as f:
            for line in f:
                parts = line.strip().split(':')
                if len(parts) >= 3 and int(parts[2]) == primary_gid:
                    groups.add(parts[0])
                    break
    except Exception as e:
        print(f"⚠️ Warning: Could not get primary group: {e}")
    
    # Then get supplementary groups from /etc/group
    with open('/etc/group', 'r') as f:
        for line in f:
            parts = line.strip().split(':')
            if len(parts) < 4:
                continue
            group_name = parts[0]
            members = parts[3]
            if members:  # Check if the members field is not empty
                # Split by comma and strip any whitespace or quotes
                member_list = [m.strip().strip("'\"[]") for m in members.split(',')]
                if username in member_list:
                    groups.add(group_name)
    
    return groups


def install_tools_debian():
    # Ensure /etc/rancher/k3s/ and config.yaml.d are accessible
    k3s_dir = "/etc/rancher/k3s"
    config_dir = os.path.join(k3s_dir, "config.yaml.d")
    for d in [k3s_dir, config_dir]:
        if os.path.exists(d) and not os.access(d, os.R_OK | os.X_OK):
            print(f"ℹ️ Fixing permissions for {d} (requires sudo)...")
            subprocess.run(["sudo", "chmod", "a+rx", d], check=True)
            print(f"✅ Permissions for {d} set to a+rx.")
    # Ensure k3s kubeconfig is readable by the current user
    kubeconfig_path = "/etc/rancher/k3s/k3s.yaml"
    if os.path.exists(kubeconfig_path):
        try:
            with open(kubeconfig_path, "r") as f:
                pass
        except PermissionError:
            print(f"ℹ️ Fixing permissions for {kubeconfig_path} (requires sudo)...")
            subprocess.run(["sudo", "chmod", "644", kubeconfig_path], check=True)
            print(f"✅ Permissions for {kubeconfig_path} set to 644.")
    if not check_ansible_installed():
        install_ansible_via_pip()

    # install galaxy requirements for ansible
    print("⏳ Installing Ansible galaxy requirements...")
    os.makedirs("./ansible/roles", exist_ok=True)
    subprocess.run(
        [
            "ansible-galaxy", "install",
            "-r", "./ansible/requirements.yaml",
            "--roles-path", "./ansible/roles"
        ],
        check=True,
    )

    # Get current username (robust in WSL2 / non-login shells)
    username = get_current_username()
    if re.match(r"^[a-zA-Z0-9_-]+$", username) is None:
        print(
            "❌ Your username contains invalid characters. Please use only alphanumeric characters and underscores."
        )
        sys.exit(1)

    # Check if user is already in docker group
    current_groups = get_current_groups()
    if "docker" not in current_groups:
        print(f"ℹ️ Adding user '{username}' to docker group...")
        
        # First, check if docker group exists, create it if not
        try:
            subprocess.run(["sudo", "getent", "group", "docker"], 
                         check=True, capture_output=True)
        except subprocess.CalledProcessError:
            print("ℹ️ Docker group doesn't exist, creating it...")
            subprocess.run(["sudo", "groupadd", "docker"], check=True)
        
        # Add user to docker group
        subprocess.run(["sudo", "usermod", "-aG", "docker", username], check=True)
        
        # Verify the group membership was updated
        try:
            # Use getent to verify the user is in the docker group
            result = subprocess.run(
                ["sudo", "getent", "group", "docker"],
                capture_output=True,
                text=True,
                check=True
            )
            if username in result.stdout:
                print(f"✅ User '{username}' successfully added to docker group.")
            else:
                print(f"⚠️ Warning: User '{username}' may not have been added to docker group.")
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Warning: Could not verify docker group: {e}")
        
        print("ℹ️ You must log out and log back in (or restart your WSL/terminal session) for group changes to take effect.")
    else:
        print(f"✅ User '{username}' is already in docker group.")

    # install simpipe using ansible
    print("⏳ Installing simpipe...")
    extra_vars = {"docker_users": [username]}
    vars_file = None
    try:
        with tempfile.NamedTemporaryFile("w", delete=False) as tf:
            json.dump(extra_vars, tf)
            tf.flush()
            vars_file = tf.name

        kgp
        env = os.environ.copy()
        env["ANSIBLE_ALLOW_BROKEN_CONDITIONALS"] = "True"
        subprocess.run(
            [
                "ansible-playbook",
                "-i",
                "localhost,",
                "-c",
                "local",
                "-b",
                "-K",
                "-e",
                f"@{vars_file}",
                "./ansible/install-everything.yaml",
            ],
            check=True,
            env=env,
        )
    finally:
        if vars_file:
            try:
                os.unlink(vars_file)
            except Exception:
                pass

    # Install helm diff for the current user
    # (ansible will install it as well, but for root)
    if not check_helm_diff_installed(silent=True):
        install_helm_diff_plugin()


def install_tools_mac():
    if not check_if_installed("brew"):
        print("❌ brew is not installed.")
        print("Check https://brew.sh for installation instructions.")
        print(
            "You can also install the tools manually using other methods if you prefer."
        )
        print("You can use the checklist.py script to check your environment.")
        sys.exit(1)

    tools = ["kubernetes-cli", "colima", "helm", "argo", "docker", "docker-buildx"]
    print("⏳ Installing tools: " + ", ".join(tools) + "...")

    subprocess.run(["brew", "install", *tools], check=True)

    if not check_helm_diff_installed(silent=True):
        install_helm_diff_plugin()

    if check_tools_installed():
        print("🎉 Tools installed successfully.")
    else:
        print("❌ Tools installation failed.")
        sys.exit(1)


def install_or_upgrade_simpipe():
    is_deployed = check_simpipe_deployment_presence()

    chart = os.path.join(os.path.dirname(__file__), "charts", "simpipe")
    values = os.path.join(os.path.dirname(__file__), "charts", "simpipe", "values.yaml")

    if is_deployed:
        env = os.environ.copy()
        env.setdefault("HELM_NO_PLUGINS", "1")

        # check whether the chart needs to be updated using helm diff
        try:
            result = subprocess.run(
                [
                    "helm",
                    "diff",
                    "upgrade",
                    "simpipe",
                    chart,
                    "-f",
                    values,
                    "--suppress-secrets",
                    "--detailed-exitcode",
                    "--no-hooks",
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=env,
            )
        except subprocess.CalledProcessError as e:
            print(f"❌ Error while checking simpipe deployment: {e}")

        needs_update = (
            result.returncode != 0 or len(result.stdout.decode("utf-8").strip()) > 0
        )

        if needs_update:
            try:
                print("⬆️ upgrading simpipe")
                subprocess.check_call(
                    [
                        "helm",
                        "upgrade",
                        "simpipe",
                        "--wait",
                        chart,
                        "-f",
                        values,
                        "--no-hooks",
                    ],
                    env=env,
                )
            except subprocess.CalledProcessError as e:
                print(f"❌ Error while upgrading simpipe: {e}")

    else:
        try:
            print("🌈 installing simpipe")
            env = os.environ.copy()
            env.setdefault("HELM_NO_PLUGINS", "1")
            subprocess.check_call(
                ["helm", "install", "simpipe", "--wait", chart, "-f", values],
                env=env,
            )
        except subprocess.CalledProcessError as e:
            print(f"❌ Error while installing simpipe: {e}")


def install_helm_diff_plugin():
    try:
        print("⏳ Installing helm-diff plugin...")
        subprocess.run(
            ["helm", "plugin", "install", "https://github.com/databus23/helm-diff"],
            check=True,
        )
        print("🎉 helm-diff plugin installed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ helm-diff plugin could not be installed (optional): {e}")
        print("   SIM-PIPE can still be installed and used; the plugin is only")
        print("   needed for optional 'helm diff' upgrade previews.")


def install_ansible_via_pip():
    """
    Install Ansible on a Debian or Ubuntu system using pip.

    The apt version is not up-to-date enough for kubernetes.core (Aug2023).
    """
    try:
        # Update the package index
        subprocess.run(
            ["sudo", "apt-get", "update"],
            check=True,
        )

        # Install pip3
        subprocess.run(
            ["sudo", "apt-get", "install", "-y", "python3-pip"],
            check=True,
        )

        # Install Ansible
        result = subprocess.run(
            ["sudo", "pip3", "install", "ansible"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        if result.returncode != 0:
            stderr = result.stderr or ""
            if "externally-managed-environment" in stderr or "PEP 668" in stderr:
                print("ℹ️ Python environment is externally managed; retrying Ansible install with --break-system-packages.")
                subprocess.run(
                    ["sudo", "pip3", "install", "--break-system-packages", "ansible"],
                    check=True,
                )
            else:
                raise subprocess.CalledProcessError(result.returncode, result.args, output=result.stdout, stderr=result.stderr)

        print("✅ Ansible installed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error occurred while installing Ansible: {e}")
        sys.exit(1)


def main(force=False):
    if not force and check_tools_installed(silent=True):
        print("✅ All tools are installed.")
        return

    system = platform.system()
    if system == "Linux":
        if check_debian_or_ubuntu():
            currentuser_groups_before_install = get_current_groups()
            install_tools_debian()
            currentuser_groups_after_install = get_current_groups()
            
            # Check if docker group was added
            if "docker" not in currentuser_groups_before_install and "docker" in currentuser_groups_after_install:
                print("\n⚠️ IMPORTANT: You have been added to the docker group.")
                print("   You must log out and log back in (or restart your WSL/terminal session)")
                print("   for the group changes to take effect.")
                print("\n   After logging back in, you can verify with:")
                print("   $ groups | grep docker")
                print("   or")
                print("   $ grep docker /etc/group")
        else:
            print("🫤 Sorry, only Debian or Ubuntu are supported for now.")
            print("You can use the checklist.py script to check your environment,")
            print("and also adapt the Ansible playbooks.")
    elif system == "Darwin":
        install_tools_mac()
    elif system == "Windows":
        print("🫤 Sorry, Windows is not supported. Consider using WSL2.")
    else:
        print(
            f"🫤 Sorry, this installation script doesn't support your operating system: {system}"
        )
        print(
            "You can then run this script again to check whether the tools are installed correctly."
        )
        sys.exit(1)

    if check_tools_installed(silent=False):
        print("✅ All tools are installed.")
        return
    else:
        print("❌ Some tools are still missing.")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Install SIM-PIPE on your local machine."
    )

    parser.add_argument(
        "--force", action="store_true", help="Force installation of tools."
    )

    args = parser.parse_args()
    main(args.force)