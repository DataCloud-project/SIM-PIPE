#!/usr/bin/env python3

import json
import re
import shutil
import subprocess
import sys


def check_if_installed(command):
    return shutil.which(command) is not None


def check_debian_or_ubuntu():
    """
    Check if the operating system is Debian or Ubuntu.
    """
    try:
        with open("/etc/os-release", "r") as file:
            content = file.read()
            if "ID=debian" in content or "ID=ubuntu" in content:
                return True
    except FileNotFoundError:
        pass
    except Exception:
        print(e)

    return False


def check_kubectl_installed(silent=False):
    if not check_if_installed("kubectl"):
        if not silent:
            print("❌ kubectl is not installed.")
            print("Check https://kubernetes.io/docs/tasks/tools/")
            if sys.platform == "darwin":
                print("\nYou can also install kubectl using brew:")
                print("brew install kubernetes-cli")
        return False
    return True


def check_cluster_status(silent=False):

    should_use_sudo = check_debian_or_ubuntu()
    command_prefix = ["sudo"] if should_use_sudo else []

    result = subprocess.run(
        command_prefix + ["kubectl", "cluster-info"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if result.returncode != 0:
        if not silent:
            print("❌ kubectl cannot contact the Kubernetes cluster.")
            print("Please start a kubernetes cluster or check its status.")
            if sys.platform == "darwin":
                print("colima is a good option for Mac users:")
                print("brew install colima")
                print("colima start --kubernetes")
            elif sys.platform.startswith("linux"):
                print("k3s is a good option for Linux users")
                print("Check https://k3s.io for installation instructions")
                print("If you want to use K3S on top of Docker, check K3D:")
                print("https://k3d.io")
                print("")
            elif sys.platform.startswith("win"):
                print("Rancher Desktop is a good option for Windows users")
                print("Check https://rancherdesktop.io for installation instructions")
            else:
                print(
                    "Check https://kubernetes.io/docs/tasks/tools/ for installation instructions"
                )
        return False

    result = subprocess.run(
        command_prefix + ["kubectl", "get", "nodes", "--no-headers", "-o", "json"],
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
    )
    if result.returncode != 0:
        if not silent:
            print("❌ kubectl cannot get nodes from the Kubernetes cluster.")
            print("Please check your cluster status.")
        return False
    nodes = json.loads(result.stdout)["items"]
    has_unready_node = False
    for node in nodes:
        name = node["metadata"]["name"]
        status = node["status"]["conditions"][-1]["status"]
        if status != "True":
            if not silent:
                print(f"❌ Node {name} is not ready. Status: {status}")
            has_unready_node = True

    if has_unready_node:
        if not silent:
            print("Please check your cluster status.")
        return False

    return True


def check_helm_installed(silent=False):
    if not check_if_installed("helm"):
        if not silent:
            print("❌ helm is not installed")
            print("Check https://helm.sh/docs/intro/install/")
            if sys.platform == "darwin":
                print("\nYou can also install helm using brew:")
                print("brew install helm")
        return False
    # Check helm version > 3
    result = subprocess.run(
        ["helm", "version", "--short", "--client"],
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
    )
    version = result.stdout.decode("utf-8").strip()
    version_re = re.compile(r"^v(?P<major>\d+)\.(?P<minor>\d+)\.(?P<patch>\d+)")
    match = version_re.match(version)

    if not match or int(match.group("major")) < 3 or int(match.group("minor")) < 7:
        if not silent:
            print("❌ helm version is not 3.7 or higher")
            print("Check https://helm.sh/docs/intro/install/ to upgrade helm")
        return False
    return True


def check_helm_diff_installed(silent=False):
    if not check_if_installed("helm"):
        return False

    try:
        command = ["helm", "plugin", "list"]
        if check_debian_or_ubuntu():
            command = ["sudo"] + command

        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            check=True,
        )
    except subprocess.CalledProcessError as e:
        if not silent:
            print(f"❌ Error while checking helm-diff plugin: {e}")
        return False

    output = result.stdout.decode("utf-8")

    helm_diff_pattern = re.compile(
        r"^diff\s+(?P<major>\d+)\.(?P<minor>\d+)\.(?P<patch>\d+)", re.MULTILINE
    )
    match = helm_diff_pattern.search(output)

    if match:
        if int(match.group("major")) < 3:
            if not silent:
                print("❌ helm-diff plugin version is not 3.1 or higher")
                print("Please upgrade it.")
                print("https://github.com/databus23/helm-diff")
            return False
    else:
        if not silent:
            print("❌ helm-diff plugin is not installed")
            print("Follow the helm plugin manager installation instructions:")
            print("https://github.com/databus23/helm-diff")
        return False

    return True


def check_argo_installed(silent=False):
    if not check_if_installed("argo"):
        if not silent:
            print("❌ argo is not installed")
            print(
                "Download the argo CLI from https://github.com/argoproj/argo-workflows/releases"
            )
            print("and add it to your PATH.")
            if sys.platform == "darwin":
                print("\nYou can also install argo using brew:")
                print("brew install argo")
        return False
    return True


def check_docker_installed(silent=False):
    if not check_if_installed("docker"):
        if not silent:
            print("❌ docker is not installed")
            print(
                "Check https://docs.docker.com/get-docker/ for installation instructions"
            )
            if sys.platform == "darwin":
                print("\nYou can also install docker using brew:")
                print("brew install docker")
        return False
    if not check_if_installed("docker-buildx"):
        # Check if the command "docker buildx version" returns a non-zero exit code
        result = subprocess.run(
            ["docker", "buildx", "version"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        if result.returncode != 0:
            if not silent:
                print("❌ docker-buildx is not installed")
                print(
                    "Check https://docs.docker.com/buildx/working-with-buildx/ for installation instructions"
                )
                if sys.platform == "darwin":
                    print("\nYou can also install docker-buildx using brew:")
                    print("brew install docker-buildx")
            return False
    return True


def check_ansible_installed():
    return all(
        [
            check_if_installed("ansible"),
            check_if_installed("ansible-playbook"),
            check_if_installed("ansible-galaxy"),
        ]
    )


def check_tools_installed(silent=False):
    return all(
        [
            check_kubectl_installed(silent),
            check_docker_installed(silent),
            check_helm_installed(silent),
            check_helm_diff_installed(silent),
            check_argo_installed(silent),
        ]
    )


def check_simpipe_deployment_presence():
    try:
        should_use_sudo = check_debian_or_ubuntu()
        command_prefix = ["sudo"] if should_use_sudo else []
        output = subprocess.check_output(
            command_prefix + ["helm", "list", "--deployed", "--output", "json"]
        )
        deployments = json.loads(output)
        for deployment in deployments:
            if deployment["name"] == "simpipe":
                return True
        return False
    except subprocess.CalledProcessError as e:
        print(f"❌ Error while checking simpipe's deployment: {e}")
        return False


def check_simpipe_pods_health(silent=False):
    should_use_sudo = check_debian_or_ubuntu()
    command_prefix = ["sudo"] if should_use_sudo else []

    result = subprocess.run(
        command_prefix
        + [
            "kubectl",
            "get",
            "pods",
            "-l",
            "app.kubernetes.io/instance=simpipe",
            "--no-headers",
            "-o",
            "json",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    if result.returncode != 0:
        if not silent:
            print("Error while fetching simpipe pods:", result.stderr.decode("utf-8"))
        return False

    pods = json.loads(result.stdout)["items"]
    unhealthy_pods = []

    for pod in pods:
        name = pod["metadata"]["name"]
        status = pod["status"]["phase"]

        if status != "Running":
            containers = pod["status"].get("containerStatuses", [])
            for container in containers:
                if "waiting" in container["state"]:
                    reason = container["state"]["waiting"]["reason"]
                    if reason not in ["ContainerCreating", "PodInitializing"]:
                        unhealthy_pods.append((name, reason))
                elif "terminated" in container["state"]:
                    reason = container["state"]["terminated"]["reason"]
                    unhealthy_pods.append((name, reason))

    if unhealthy_pods:
        if not silent:
            print("❌ Some simpipe pods are not healthy:")
            for name, reason in unhealthy_pods:
                print(f"  - Pod {name} is not healthy. Reason: {reason}")
            print("Please check your deployment.")
        return False

    return True


def main():
    if not check_tools_installed():
        sys.exit(1)
    check_cluster_status()


if __name__ == "__main__":
    main()
