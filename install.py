#!/usr/bin/env python3

import os
import platform
import subprocess
import sys

from checklist import (
    check_helm_diff_installed,
    check_if_installed,
    check_simpipe_deployment_presence,
    check_tools_installed,
)


def install_tools():
    if not check_if_installed("brew"):
        print("❌ brew is not installed.")
        print("Check https://brew.sh for installation instructions.")
        print(
            "You can also install the tools manually using other methods if you prefer."
        )
        print("You can use the checklist.py script to check your environment.")
        sys.exit(1)

    tools = ["kubernetes-cli", "colima", "helm", "argo"]
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

    chart_folder = os.path.join(os.path.dirname(__file__), "charts", "simpipe")

    if is_deployed:

        # check whether the chart needs to be updated using helm diff
        try:
            result = subprocess.run(
                [
                    "helm",
                    "diff",
                    "upgrade",
                    "simpipe",
                    chart_folder,
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
                    ["helm", "upgrade", "simpipe", "--wait", chart_folder]
                )
            except subprocess.CalledProcessError as e:
                print(f"❌ Error while upgrading simpipe: {e}")

    else:
        try:
            print("🌈 installing simpipe")
            subprocess.check_call(
                ["helm", "install", "simpipe", "--wait", chart_folder]
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
        print(f"❌ Error while installing helm-diff plugin: {e}")
        sys.exit(1)


def main():
    if check_tools_installed():
        print("✅ All tools are already installed.")
        return

    if platform.system() == "Darwin":
        install_tools()
    else:
        print("🫤 Sorry, this script only install automatically on macOS for now.")
        print(
            "You can then run this script again to check whether the tools are installed correctly."
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
