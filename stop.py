import argparse
import platform
import subprocess

from checklist import check_if_installed


def main():
    parser = argparse.ArgumentParser(description=".")
    parser.add_argument(
        "--delete",
        action="store_true",
        help="Delete the simpipe profile instead of stopping it",
    )
    args = parser.parse_args()

    # Check if the system is a Mac
    if platform.system() == "Darwin":
        # Check if Colima is installed
        if check_if_installed("colima"):
            # Execute the command line
            command = "delete" if args.delete else "stop"
            subprocess.run(["colima", command, "--profile", "simpipe"])
        else:
            print_instructions()
    else:
        print_instructions()


def print_instructions():
    print("To turn off the Kubernetes cluster manually, follow these steps:")
    print(
        "1. If you have the simpipe Helm chart installed, run 'helm uninstall simpipe'"
    )
    print("2. Turn off your cluster using your cluster management tools")


if __name__ == "__main__":
    main()
