import sys
import argparse
import subprocess
from pathlib import Path
from kwoksim import Kwok

DEPENDENCIES = ["docker", "kind", "kubectl", "kwok", "kwokctl"]

###################################################################################################


def install_dependencies(tools: list = DEPENDENCIES, verbose: bool = False):
    """Install dependencies for running kwok simulation"""
    # kwok, kwokctl, docker, kind
    if sys.platform == "darwin":
        install_darwin()
    else:
        raise Exception(
            f"Unsupported platform: {sys.platform}. Install dependencies manually: {DEPENDENCIES}"
        )


def check_dependencies(verbose: bool = False) -> bool:
    """Check if dependencies are installed"""
    tools_not_installed = []
    for tool in DEPENDENCIES:
        if tool == "kubectl":
            cmd = f"{tool} version --client"
        else:
            cmd = f"{tool} --version"
        p = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            check=False,
        )
        if verbose and p.returncode == 0:
            print(p.stdout.decode("utf-8"), end="")
        if p.returncode != 0:
            print(f"{tool} not installed")
            tools_not_installed.append(tool)
    if len(tools_not_installed) > 0:
        print(tools_not_installed)
        install_dependencies(tools=tools_not_installed, verbose=verbose)
    return True


def install_darwin(tools: list = DEPENDENCIES, verbose: bool = False):
    for tool in tools:
        try:
            subprocess.run(["brew", "install", tool], capture_output=True, check=True)
        except Exception as e:
            print(f"Could not install {tool}")
            if verbose:
                print(e)
            pass


def main(args: argparse.Namespace):
    if not args.workflow:
        args.workflow = Path("config/hello-world.yaml").resolve()
        if args.workflow.exists() is False:
            raise Exception(
                "No workflow file provided. Use --workflow <path-to-workflow>"
            )
    if not check_dependencies(args.verbose):
        install_dependencies()

    kwok = Kwok(argo_workflow_file=args.workflow)

    kwok.run_simulation()

    while kwok.is_simulation_complete() is False:
        if args.verbose:
            j = kwok.get_simulation_progress()
            try:
                print(j["progress"], end=" ", flush=True)
            except KeyError:
                print(".", end=" ", flush=True)

    result = kwok.get_results()

    kwok.cleanup()

    print(result)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run kwok simulation")
    parser.add_argument("--workflow", type=str, help="path to argo workflow file")
    parser.add_argument("-v", "--verbose", action="store_true", help="verbose output")
    args = parser.parse_args()
    main(args)
