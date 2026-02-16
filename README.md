<p align="center"><img width=50% src="./docs/logo/sim-pipe_logo.png"></p>

[![GitHub Issues](https://img.shields.io/github/issues/DataCloud-project/SIM-PIPE.svg)](https://github.com/DataCloud-project/SIM-PIPE/issues)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# SIM-PIPE

SIM-PIPE generates and simulates a deployment configuration for the final deployment that conforms to the hardware requirements and includes any additional necessary middleware inter-step communication code. Finally, the tool provides a pipeline testing functionality, including a sandbox for evaluating individual pipeline step performance, and a simulator to determine the performance of the overall Big Data pipeline. Specifically, SIM-PIPE provides the following high-level features:

-	Deploying each step of a pipeline and running it in a sandbox by providing sample input
-	Evaluating pipeline step performance by recording and analysing metrics about its execution in order to identify bottlenecks and steps to be optimized
-	Identification of resource requirements for pipeline by calculating step performance per resource used


## Quick installation

Supported by the scripts: Debian/Ubuntu (k3s) and macOS (Colima). For other distros, use the manual Helm flow in the Kubernetes section.

```bash
python3 install.py
python3 start.py
```

What these do:
- `install.py`: installs prerequisites (Ansible, Docker, k3s on Linux; brew tools on macOS), adds you to the `docker` group, installs/updates the Helm chart with [charts/simpipe/values.yaml](charts/simpipe/values.yaml), and ensures required secrets.
- `start.py`: re-runs installer checks, ensures secrets, and waits for the cluster. On macOS it also starts Colima+Kubernetes; on Linux it expects your k3s cluster already running and readable.

Important:
- If you were added to the `docker` group, log out/in (or restart your shell/WSL) before re-running `start.py`, otherwise kubeconfig access will fail.
- The scripts expect kubeconfig at `/etc/rancher/k3s/k3s.yaml` and try to fix ownership (600). Override via `KUBECONFIG` if needed.

Port-forward helper (optional, local dev):
```bash
python3 forwarding.py
```

## Quick Start using the GUI

After starting SIM-PIPE and while running the `python forwarding.py` script, browse to http://localhost:8088/ to access the SIM-PIPE GUI.

## Quick Start in command line

Build the hello-world software container image locally:

```bash
# Example using Docker
docker buildx build -t hello-world examples/hello-world
# or (if the previous command fails)
docker-buildx build -t hello-world examples/hello-world
```

Run the hello-world pipeline:

```bash
argo submit --watch examples/hello-world.yaml
```

Check the logs of the hello-world pipeline:

```bash
argo logs @latest
```

## Advanced installation

### macOS Installation

Requires [brew](https://brew.sh/) first. `python3 start.py` will install tools via brew, start Colima with Kubernetes (`simpipe` profile), and then install/upgrade the chart using the bundled values and secrets helper.

### Linux (Debian/Ubuntu)

`python3 install.py` installs prerequisites (Ansible, Docker, k3s, helm, argo CLI), creates/uses `/etc/rancher/k3s/k3s.yaml`, ensures SIM-PIPE secrets, and installs/updates the Helm chart. `python3 start.py` re-runs checks and waits for pods but does **not** start k3s for you—start it manually if it is down.

If you prefer manual Ansible steps:
```bash
sudo ansible-galaxy install -r ./ansible/requirements.yaml --roles-path ./ansible/roles
sudo ansible-playbook -i localhost, -c local -b -K -e docker_users=["$(whoami)"] ./ansible/install-everything.yaml
sudo ansible-playbook -i localhost, -c local -b -K ./ansible/install-simpipe.yaml
```

After being added to the `docker` group, log out/in before retrying so kubectl can read kubeconfig.

### Kubernetes Installation

You can install SIM-PIPE on any [Kubernetes](https://kubernetes.io) cluster using the [Helm](https://helm.sh) chart in the `charts/simpipe` folder or a released helm chart using the [oci registry](https://helm.sh/docs/topics/registries/) at `oci://ghcr.io/datacloud-project/sim-pipe`.

Please note that it is recommended to use a clean Kubernetes cluster for the installation.

SIM-PIPE is been developed and tested on kubernetes `1.27` with the [K3S distribution](http://k3s.io). The default configuration
uses the `default` namespace and has opiniated settings for [Argo Workflow](https://argoproj.github.io/workflows/) and the various secrets and role bindings.

You may want to change the configuration of the Helm chart to match your needs. If installing manually, create the required secrets first (see `secrets_manager.py`), then apply the chart with the bundled values file:

```bash
# Using the latest release
helm install simpipe oci://ghcr.io/datacloud-project/sim-pipe -f charts/simpipe/values.yaml
# or using the local folder
helm install simpipe ./charts/simpipe -f charts/simpipe/values.yaml
```

Chart defaults to note (edit in [charts/simpipe/values.yaml](charts/simpipe/values.yaml)):
- Controller runs on hostNetwork, privileged, port 9000; Argo endpoint `http://simpipe-argo-workflows-server:2746/`.
- MinIO enabled with default creds `simpipe/simpipe1234`, buckets `artifacts`, `logs`, `registry`.
- Carbontracker, cadvisor bridge, and Argo Workflows enabled by default. Change or secure before exposing externally.

### Windows Installation

SIM-PIPE runs everywhere as long as it runs [Linux](https://kernel.org). If you are using Windows, you can install SIM-PIPE using the [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-gb/windows/wsl/) in its second version ([WSL2](https://learn.microsoft.com/en-gb/windows/wsl/compare-versions)). Then you can select a [Debian](https://www.debian.org) based Linux distribution and proceed as normal.

You may have to run the following instructions to make Docker work: https://github.com/microsoft/WSL/issues/6655#issuecomment-1142933322 The installation script attempts to fix it for you.

## Architecture

Please consult the [`ARCHITECTURE.md`](ARCHITECTURE.md) document for more details on the SIM-PIPE architecture.

## Security

SIM-PIPE is designed to only allow trusted users to deploy pipelines.

**DO NOT** expose the SIM-PIPE API to the public Internet without authorising and authentifying your users.

The default installation of SIM-PIPE **IS NOT** secure.
You need to configure the authentication and authorisation mechanisms yourself.

In practice, SIM-PIPE is better to run on your local machine. When port forwarding,
make sure you do not expose the SIM-PIPE API to an untrusted network.
The defaults are set to localhost only.

## Contributing

Before raising a pull request, please read our [contributing guide](CONTRIBUTING.md).

## Core development team

* [Nikolay Nikolov](https://github.com/nvnikolov)
* [Antoine Pultier](https://github.com/fungiboletus)
* [Aleena Thomas](https://github.com/AleenaThomas-gh)
* [Brian Elvesæter](https://github.com/elvesater)
* [Gøran Brekke Svaland](https://github.com/goranbs)

## License

SIM-PIPE is released as open source software under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
