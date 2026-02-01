#!/usr/bin/env python3

import argparse
import os
import platform
import subprocess
import sys
import time

from checklist import check_cluster_status, check_simpipe_pods_health
from install import install_or_upgrade_simpipe
from install import main as install_main


def start_colima(cpu, memory):
    print("⏳ Starting colima...")
    arch = platform.machine()

    if arch == "arm64":
        arch = "aarch64"
    elif arch != "x86_64":
        print("❌ Unsupported architecture: " + arch)
        sys.exit(1)

    subprocess.run(
        [
            "colima",
            "start",
            "--kubernetes",
            # Uncomment the following line if you want to use the MacOS VM framework
            # instead of qemu.
            # "--vm-type=vz",
            # "--vz-rosetta",
            # If using the MacOS VM framework, the following line will ignore IPv6
            # as IPv6 is problematic on some networks.
            # See https://github.com/abiosoft/colima/issues/648
            # "--dns=192.168.5.3",
            "--cpu",
            str(cpu),
            "--memory",
            str(memory),
            # set the current docker/kubernetes context
            "--activate",
            "--arch",
            arch,
            "simpipe",
        ],
        check=True,
    )


def main():
    # --- Set KUBECONFIG for all subprocesses if not already set ---
    env = os.environ.copy()
    kubeconfig_path = "/etc/rancher/k3s/k3s.yaml"
    if "KUBECONFIG" not in env and os.path.exists(kubeconfig_path):
        env["KUBECONFIG"] = kubeconfig_path
        # Fix ownership and permissions so the current user can read the kubeconfig
        import getpass
        username = getpass.getuser()
        try:
            # Change owner to current user if not already
            subprocess.run(["sudo", "chown", f"{username}:{username}", kubeconfig_path], check=False)
            # Set permissions to 600 (user read/write only)
            subprocess.run(["sudo", "chmod", "600", kubeconfig_path], check=False)
        except Exception as e:
            print(f"Warning: Could not fix kubeconfig permissions: {e}")

    # --- Ensure secrets exist (idempotent) ---
    from secrets_manager import ensure_secrets
    ensure_secrets(env=env)
    parser = argparse.ArgumentParser(
        description="Start SIM-PIPE on your local machine."
    )

    parser.add_argument(
        "--cpu", type=int, help="Number of CPU cores (mac only).", default=4
    )
    parser.add_argument(
        "--memory", type=int, help="Amount of memory in GB (mac only).", default=6
    )

    args = parser.parse_args()

    install_main()

    if platform.system() == "Darwin":
        start_colima(cpu=args.cpu, memory=args.memory)
    else:
        # Ensure KUBECONFIG points to the k3s kubeconfig if available
        env = os.environ.copy()
        kubeconfig_path = "/etc/rancher/k3s/k3s.yaml"
        if "KUBECONFIG" not in env and os.path.exists(kubeconfig_path):
            env["KUBECONFIG"] = kubeconfig_path

        # Extra check: is kubeconfig file readable?
        if os.path.exists(kubeconfig_path):
            try:
                with open(kubeconfig_path, "r") as f:
                    pass
            except PermissionError:
                print(f"❌ {kubeconfig_path} exists but is not readable by your user.")
                print("This is usually because your user is not in the 'docker' group, or you have not logged out and back in after being added.")
                print("To fix:")
                print("  1. Ensure your user is in the 'docker' group (the install script does this automatically).")
                print("  2. Log out of your WSL/terminal session and log back in, or reboot WSL.")
                print("  3. Then re-run this script.")
                print("You can check your groups with: groups")
                sys.exit(1)

        # Check if we can read the Kubernetes config file via kubectl
        try:
            subprocess.run(
                ["kubectl", "config", "view"], check=True, capture_output=True, env=env
            )
        except subprocess.CalledProcessError:
            print("❌ Unable to read Kubernetes config file using kubectl.")
            print("This may be due to permissions or a missing/invalid KUBECONFIG.")
            print("See the documentation above for troubleshooting steps.")
            sys.exit(1)

        kubernetes_has_started = check_cluster_status(silent=True)
        if not kubernetes_has_started:
            print(
                "😫 This script only starts Kubernetes automatically on macOS for now."
            )
            print("Please start your Kubernetes cluster manually.")

            nb_tentatives = 0
            while not check_cluster_status(silent=True):
                print("😴 Waiting for Kubernetes cluster to be ready...")
                nb_tentatives += 1
                if nb_tentatives > 8:
                    if not check_cluster_status(silent=False):
                        sys.exit(1)
                time.sleep(5)
    print("🎉 the kubernetes cluster is ready.")

    install_or_upgrade_simpipe()

    nb_tentatives = 0
    while not check_simpipe_pods_health(silent=True):
        print("😴 Waiting for simpipe pods to be ready...")
        nb_tentatives += 1
        if nb_tentatives > 8:
            if not check_simpipe_pods_health(silent=False):
                sys.exit(1)
        time.sleep(5)

    print("🚀 simpipe is ready.")


if __name__ == "__main__":
    main()
