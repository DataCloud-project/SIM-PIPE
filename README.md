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
python start.py
```

Use the following command to easily expose the various services of SIM-PIPE:
```bash
python forwarding.py
```

*You can check the advanced installation section for more details on the installation process.*

## Quick Start

Build the hello-world software container image locally:

```bash
# Example using Docker
docker buildx build -t hello-world images/hello-world
# or
docker-buildx build -t hello-world images/hello-world
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

The Linux installation is also automated using the `python install.py` script. We only focus on Debian based Linux distributions for now. We tested on Debian and Ubuntu, but it may work with little efforts on other distributions.

If you don't with to use the Python installation script, you can use the Ansible playbooks directly.
```bash
ansible-playbook -i playbooks/install-simpipe.yaml
```

If you are already running a Kubernetes cluster on your machine, it may be easier to install SIM-PIPE on it directly or to install SIM-PIPE inside a virtual machine.

### Kubernetes Installation

You can install SIM-PIPE on any Kubernetes cluster using the Helm chart in the `charts/simpipe` folder.

Please note that it is recommended to use a clean Kubernetes cluster for the installation.

SIM-PIPE is been developed and tested on kubernetes `1.27` with the K3S distribution. The default configuration
uses the `default` namespace and has opiniated settings for Argo Workflow and the various secrets and role bindings.

You may want to change the configuration of the Helm chart to match your needs.

### Windows Installation

SIM-PIPE runs everywhere as long as it runs Linux. If you are using Windows, you can install SIM-PIPE using the Windows Subsystem for Linux (WSL) in its second version (WSL2). Then you can select a Debian based Linux distribution and proceed as normal.

You may have to run the following instructions to make Docker work: https://github.com/microsoft/WSL/issues/6655#issuecomment-1142933322


## How to start the frontend

SIM-PIPE frontend needs to be started separately. To run the frontend of this project locally, you'll need Node.js and npm (Node Package Manager) installed on your machine. If you haven't installed them yet, you can download the latest LTS version of Node.js from the official website: https://nodejs.org/en/download/.

### Install Dependencies and Start Frontend
Navigate to the project's root directory in your terminal or command prompt and run the following sequence of commands to install and start the frontend:

```bash
cd frontend/
npm install
npm run build
# This command will generate the production-ready assets in the .svelte-kit/output directory.

npm run preview
```

The server will be available at http://localhost:4173. You can access the app in your browser.

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
