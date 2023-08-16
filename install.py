#!/usr/bin/env python3

import platform
import subprocess
import sys

from checklist import (
    check_ansible_installed,
    check_debian_or_ubuntu,
    check_helm_diff_installed,
    check_if_installed,
    check_simpipe_deployment_presence,
    check_tools_installed,
)


def install_tools_debian():

    if not check_ansible_installed():
        install_ansible_via_pip()

    # install galaxy requirements for ansible
    print("⏳ Installing Ansible galaxy requirements...")
    subprocess.run(
        ["sudo", "ansible-galaxy", "install", "-r", "./ansible/requirements.yaml"],
        check=True,
    )

    # install simpipe using ansible
    print("⏳ Installing simpipe...")
    subprocess.run(
        [
            "sudo",
            "ansible-playbook",
            "-i",
            "localhost,",
            "-c",
            "local",
            "./ansible/install-everything.yaml",
        ],
        check=True,
    )


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

    # chart = os.path.join(os.path.dirname(__file__), "charts", "simpipe")
    chart = "oci://ghcr.io/datacloud-project/simpipe"

    if is_deployed:

        # check whether the chart needs to be updated using helm diff
        try:
            result = subprocess.run(
                [
                    "helm",
                    "diff",
                    "upgrade",
                    "simpipe",
                    chart,
                    "--suppress-secrets",
                    "--detailed-exitcode",
                    "--no-hooks",
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
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
                    ["helm", "upgrade", "simpipe", "--wait", chart, "--no-hooks"]
                )
            except subprocess.CalledProcessError as e:
                print(f"❌ Error while upgrading simpipe: {e}")

    else:
        try:
            print("🌈 installing simpipe")
            subprocess.check_call(["helm", "install", "simpipe", "--wait", chart])
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
        print(f"❌ Error while installing helm-diff plugin: {e}")
        sys.exit(1)


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
        subprocess.run(
            ["sudo", "pip3", "install", "ansible"],
            check=True,
        )

        print("✅ Ansible installed successfully.")
    except subprocess.CalledProcessError:
        print("❌ Error occurred while installing Ansible.")
        sys.exit(1)


def main():
    if check_tools_installed(silent=True):
        print("✅ All tools are already installed.")
        return

    os = platform.system()
    if os == "Linux":
        if check_debian_or_ubuntu():
            install_tools_debian()

        else:
            print("🫤 Sorry, only Debian or Ubuntu are supported for now.")
            print("You can use the checklist.py script to check your environment,")
            print("and also adapt the Ansible playbooks.")
    elif os == "Darwin":
        install_tools_mac()
    elif os == "Windows":
        print("🫤 Sorry, Windows is not supported. Consider using WSL2.")
    else:
        print(
            f"🫤 Sorry, this installation script doesn't support your operating system: {os}"
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
    main()
