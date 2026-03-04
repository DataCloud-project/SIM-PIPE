#!/usr/bin/env python3

import argparse
import platform
import subprocess
import sys
import time

from checklist import check_cluster_status, check_simpipe_pods_health
from install import ensure_kubeconfig_env, install_or_upgrade_simpipe
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

    env, _ = ensure_kubeconfig_env()

    # Check if we can read the Kubernetes config file via kubectl
    try:
        subprocess.run(
            ["kubectl", "config", "view"], check=True, capture_output=True, env=env
        )
    except subprocess.CalledProcessError:
        print("❌ Unable to read Kubernetes config file using kubectl.")
        print("This may be due to permissions or a missing/invalid KUBECONFIG.")
        print("Set KUBECONFIG to a valid kubeconfig and re-run.")
        sys.exit(1)

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
