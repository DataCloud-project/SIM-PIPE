#!/usr/bin/env python3

import argparse
import os
import platform
import subprocess
import sys
import time

from checklist import (check_ansible_installed, check_cluster_status,
                      check_debian_or_ubuntu, check_helm_diff_installed,
                      check_if_installed, check_simpipe_deployment_presence,
                      check_tools_installed)

DEFAULT_KUBECONFIG_PATH = "/etc/rancher/k3s/k3s.yaml"


def ensure_kubeconfig_env():
    """Return an env dict that includes KUBECONFIG, preferring user-provided values.

    Order of precedence:
    1) Respect an existing KUBECONFIG in the current environment.
    2) If unset, fall back to the k3s kubeconfig path when it exists.
    The function exits with a helpful message when no kubeconfig is available.
    """

    env = os.environ.copy()
    kubeconfig_value = env.get("KUBECONFIG")

    if not kubeconfig_value:
        # Prefer ~/.kube/config (user-readable) over the root-only k3s path.
        for candidate in (
            os.path.expanduser("~/.kube/config"),
            DEFAULT_KUBECONFIG_PATH,
        ):
            if candidate and os.path.exists(candidate) and os.access(candidate, os.R_OK):
                kubeconfig_value = candidate
                env["KUBECONFIG"] = kubeconfig_value
                break

    if not kubeconfig_value:
        print("❌ No kubeconfig detected. Set the KUBECONFIG environment variable to your cluster config and retry.")
        sys.exit(1)

    kubeconfig_paths = [p for p in kubeconfig_value.split(os.pathsep) if p]
    if kubeconfig_paths and not any(os.path.exists(p) for p in kubeconfig_paths):
        print(f"❌ KUBECONFIG points to '{kubeconfig_value}', but no listed file exists.")
        print("Set KUBECONFIG to a valid kubeconfig path and retry.")
        sys.exit(1)

    # Propagate to the current process so downstream calls that inherit the env see it.
    os.environ["KUBECONFIG"] = kubeconfig_value
    return env, kubeconfig_value


def install_tools_debian():
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

    # Install base infrastructure using Ansible (Docker, k3s, CLI tools, etc.)
    print("⏳ Installing base SIM-PIPE dependencies (Docker, k3s, tools)...")
    env_base = os.environ.copy()
    env_base["ANSIBLE_ALLOW_BROKEN_CONDITIONALS"] = "True"

    # First, install Docker, k3s and supporting tools (no SIM-PIPE yet)
    subprocess.run(
        [
            "ansible-playbook",
            "-i",
            "localhost,",
            "-c",
            "local",
            "-b",
            "-K",
            "./ansible/install-everything.yaml",
        ],
        check=True,
        env=env_base,
    )

    # Now ensure required Kubernetes secrets exist before installing SIM-PIPE
    from secrets_manager import ensure_secrets

    # Re-resolve kubeconfig here so we pick up ~/.kube/config written by the
    # ansible k3s post_tasks even if KUBECONFIG wasn't set before that step.
    env_kubeconfig, kubeconfig_path = ensure_kubeconfig_env()

    nb_tentatives = 0
    while not check_cluster_status(silent=True):
        print("😴 Waiting for Kubernetes cluster to be ready...")
        nb_tentatives += 1
        if nb_tentatives > 12:
            if not check_cluster_status(silent=False):
                sys.exit(1)
        time.sleep(5)

    print("⏳ Ensuring SIM-PIPE secrets are configured (you may be prompted)...")
    try:
        ensure_secrets(env=env_kubeconfig)
    except Exception as e:
        print(f"⚠️ Skipping secret setup for now: {e}")
        print("   You can set secrets later by running `python -c \"from secrets_manager import ensure_secrets; ensure_secrets()\"` once KUBECONFIG works.")

    # Finally, install SIM-PIPE via its dedicated playbook
    print("⏳ Installing SIM-PIPE Helm chart via Ansible...")
    env_with_kubeconfig = env_base.copy()
    env_with_kubeconfig["KUBECONFIG"] = kubeconfig_path
    subprocess.run(
        [
            "ansible-playbook",
            "-i",
            "localhost,",
            "-c",
            "local",
            "-b",
            "-K",
            "./ansible/install-simpipe.yaml",
        ],
        check=True,
        env=env_with_kubeconfig,
    )

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
        env, _ = ensure_kubeconfig_env()
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
            env, _ = ensure_kubeconfig_env()
            env.setdefault("HELM_NO_PLUGINS", "1")
            subprocess.check_call(
                ["helm", "install", "simpipe", "--wait", chart, "-f", values],
                env=env,
            )
        except subprocess.CalledProcessError as e:
            print(f"❌ Error while installing simpipe: {e}")


def install_helm_diff_plugin():
    print("ℹ️ Skipping helm-diff plugin (not required for SIM-PIPE).")


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
            install_tools_debian()
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
