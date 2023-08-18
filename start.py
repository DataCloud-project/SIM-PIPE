#!/usr/bin/env python3

import argparse
import platform
import subprocess
import sys
import time

from checklist import check_cluster_status, check_simpipe_pods_health
from install import install_or_upgrade_simpipe
from install import main as install_main


def start_colima(cpu, memory):
    print("⏳ Starting colima...")
    subprocess.run(
        [
            "colima",
            "start",
            "--kubernetes",
            # Uncomment the following line if you want to use the MacOS VM framework
            # instead of qemu.
            # "--vm-type=vz",
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
    else:

        # Check if we can read the Kubernetes config file
        try:
            subprocess.run(
                ["kubectl", "config", "view"], check=True, capture_output=True
            )
        except subprocess.CalledProcessError:
            print("❌ Unable to read Kubernetes config file.")
            print("Consider logging out, logging in, and run this script again.")
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
