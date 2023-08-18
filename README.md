<p align="center"><img width=50% src="./docs/logo/sim-pipe_logo.png"></p>

[![GitHub Issues](https://img.shields.io/github/issues/DataCloud-project/SIM-PIPE.svg)](https://github.com/DataCloud-project/SIM-PIPE/issues)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# SIM-PIPE

SIM-PIPE generates and simulates a deployment configuration for the final deployment that conforms to the hardware requirements and includes any additional necessary middleware inter-step communication code. Finally, the tool provides a pipeline testing functionality, including a sandbox for evaluating individual pipeline step performance, and a simulator to determine the performance of the overall Big Data pipeline. Specifically, SIM-PIPE provides the following high-level features:

-	Deploying each step of a pipeline and running it in a sandbox by providing sample input
-	Evaluating pipeline step performance by recording and analysing metrics about its execution in order to identify bottlenecks and steps to be optimized
-	Identification of resource requirements for pipeline by calculating step performance per resource used


## Quick installation

If you use MacOS or Debian based Linux, run the following command to install and start SIM-PIPE:

```bash
python install.py
python start.py
# or
python3 install.py
python3 start.py
```

*Please note that this is an opiniated installation script. You may want to install it manually instead.*

Use the following command to easily expose the various services of SIM-PIPE:
```bash
python forwarding.py
```

*You can check the advanced installation section for more details on the installation process.*

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

### MacOS Installation

The MacOS installation is automated using `brew` and the `python install.py` script. You need to install [brew](https://brew.sh/) first.
Note that the `python start.py` script will automatically install the dependencies first.

The MacOS installation uses a Linux virtual machine using `colima` named `simpipe`. When starting simpipe, the default Kubernetes context will be set to the `simpipe` kubernetes cluster.

### Linux Debian(like) Installation

The Linux installation is also automated using the `python install.py` script. We only focus on Debian based Linux distributions for now. We tested on Debian and Ubuntu, but it may work with little efforts on other distributions with little modifications.

The installation will first install Ansible and then Ansible to install everything.

If you don't with to use the Python installation script, you can also use the Ansible playbooks directly.
```bash
sudo ansible-galaxy install -r ./ansible/requirements.yaml
echo sudo ansible-playbook -i localhost, -c local -e docker_users=[\'$(whoami)\']./ansible/install-everything.yaml
```

*If you are already running a Kubernetes cluster on your machine, it may be easier to install SIM-PIPE on it directly using Helm as explained in the following section.*

### Kubernetes Installation

You can install SIM-PIPE on any [Kubernetes](https://kubernetes.io) cluster using the [Helm](https://helm.sh) chart in the `charts/simpipe` folder or a released helm chart using the [oci registry](https://helm.sh/docs/topics/registries/) at `oci://ghcr.io/datacloud-project/sim-pipe`.

Please note that it is recommended to use a clean Kubernetes cluster for the installation.

SIM-PIPE is been developed and tested on kubernetes `1.27` with the [K3S distribution](http://k3s.io). The default configuration
uses the `default` namespace and has opiniated settings for [Argo Workflow](https://argoproj.github.io/workflows/) and the various secrets and role bindings.

You may want to change the configuration of the Helm chart to match your needs.

```bash
# Using the latest release
helm install simpipe oci://ghcr.io/datacloud-project/sim-pipe
# or using the local folder
helm install simpipe ./charts/simpipe
```

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
