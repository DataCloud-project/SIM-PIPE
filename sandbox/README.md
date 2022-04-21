<p align="center"><img width=50% src="https://raw.githubusercontent.com/DataCloud-project/toolbox/master/docs/img/datacloud_logo.png"></p>&nbsp;

[![GitHub Issues](https://img.shields.io/github/issues/DataCloud-project/SIM-PIPE-Sandbox.svg)](https://github.com/DataCloud-project/SIM-PIPE-Sandbox/issues)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# SIM-PIPE Sandbox

The `Sandbox` component of SIM-PIPE is an isolated testbed for running the simulations. This folder contains the the necessary setup and configuration files for setting up the sandbox environment on a Ubuntu Server 20.03 LTS virtual machine (VM). The sandbox VM runs a Docker daemon for dispatching Docker containers (each running a step of a data pipeline) and an SFTP server for file transfers.

* [setup-sandbox-vm.yaml](https://github.com/DataCloud-project/SIM-PIPE/blob/main/sandbox/setup-sandbox-vm.yaml): An [Ansible playbook](https://docs.ansible.com/ansible/latest/user_guide/playbooks_intro.html) file that provides automated setup of the sandbox VM.
* [inventory-datacloud.yaml](https://github.com/DataCloud-project/SIM-PIPE/blob/main/sandbox/inventory-datacloud.yaml): An [Ansible inventory](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html) file where you configure the SSH settings of the sandbox VM.
* [docker-compose.yaml](https://github.com/DataCloud-project/SIM-PIPE/blob/main/sandbox/docker-compose.yaml): A [Docker Compose](https://docs.docker.com/compose/) file that starts the SFTP server on the sandbox VM.
* [users.conf](https://github.com/DataCloud-project/SIM-PIPE/blob/main/sandbox/users.conf): A user configuration file for the SFTP server that is run on the sandbox VM.

## Prerequisites

### Ubuntu Server 20.04 LTS

The sandbox is required to be installed on a separate Ubuntu Server 20.04 LTS host. 

#### Setting up a Ubuntu Server in the cloud

See https://ubuntu.com/server/docs/cloud-images/introduction for information about available cloud offerings and how to set up a barebone Ubuntu Server 20.04 LTS virtual machine (VM) in the cloud.

### Ansible

[Ansible](https://www.ansible.com/) is an agentless automation tool that you install on a control node. In order to set up the sandbox VM using Ansible, you will need to install Ansible. Below we provide instructions for setting up Ansible on Ubuntu and Windows machine. Note that Ansible is meant to be run on a control node, i.e., a separate computer controlling the sandbox VM.

#### Installing Ansible on Ubuntu

To [install Ansible on Ubuntu](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-ubuntu) run the following commands:

```
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install ansible
```

Run the following command to check that Ansible has been correctly installed:
```
ansible --version
```

#### Installing Ansible on Windows

Note that Ansible is not natively supported on Windows, but it can run under the Windows Subsystem for Linux (WSL). 

* See https://docs.microsoft.com/en-us/windows/wsl/install for instructions on how to install WSL.
* See https://docs.ansible.com/ansible/latest/user_guide/windows_faq.html#windows-faq-ansible for instructions on how to install Ansible under WSL.

## Setting up the sandbox VM using Ansible

#### Step 1. Clone the SIM-PIPE repository

Command line:

```
git clone -b monorepo https://github.com/DataCloud-project/SIM-PIPE.git
cd SIM-PIPE/sandbox
```

#### Step 2. Configure the Ansible inventory file

The Ansible inventory file [inventory-datacloud.yaml](https://github.com/DataCloud-project/SIM-PIPE-Sandbox/blob/main/inventory-datacloud.yaml) contains configuration settings for the sandbox VM host, such as the IP address and the SSH port and username.

* `ansible_host`: The IP address of the host. Default value is `localhost`.
* `ansible_port`: The SSH port of the host. Default value is `22`.
* `ansible_user`: The SSH username to use. Default value is `azureuser`.
* `ansible_become`: Enables to run tasks as sudo. Default value is `true`.

Use your favorite editor and change the inventory file settings accordingly, e.g.:

```
sudo pico inventory-datacloud.yaml
```

#### Step 3. Run the Ansible Playbook to setup the sandbox

Run the Ansible Playbook file [setup-sandbox-vm.yaml](https://github.com/DataCloud-project/SIM-PIPE-Sandbox/blob/main/setup-sandbox-vm.yaml) to setup the sandbox. For more information about Ansible Playbooks see https://docs.ansible.com/ansible/latest/user_guide/playbooks_intro.html

Command line when using private key to authenticate: (Update the command line to point to the location of your keyfile.)

```
ansible-playbook -i inventory-datacloud.yaml setup-sandbox-vm.yaml --key-file ~/.ssh/mykey.pem
```

Command line when using password to authenticate:

```
ansible-playbook -i inventory-datacloud.yaml setup-sandbox-vm.yaml --ask-pass --ask-become-pass
```

The sandbox VM should now have the following services running:

* SFTP service listening on port 22
* Docker daemon listening on port 2375

## Setting up the sandbox VM manually

#### Step 1. Configure the Docker daemon

By default docker daemon on Ubuntu listens to /var/run/docker.sock. Update the settings for the Docker daemon to listen to requests on port 2375. This requires the following changes:

Stop docker service if running:
```
sudo systemctl stop docker.service; sudo systemctl stop docker.socket
```
  
Edit /etc/docker/daemon.json file to include this line:
```
"hosts": ["tcp://0.0.0.0:2375", "unix:///var/run/docker.sock"]
```
  
Edit /lib/systemd/system/docker.service file to include this line:
```
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375 –containerd=/run/containerd/containerd.sock
```
  
Restart Docker:
```
sudo systemctl daemon-reload; sudo systemctl restart docker.service
```

Check if daemon is listening on port 2375:
```
sudo netstat -lntp
```

#### Step 2. Start SFTP server

Edit users.conf file to add the SFTP user you wish to have. Then run from SIM-PIPE/sandbox folder. This will start a Docker container with SFTP server (https://github.com/atmoz/sftp) in your system:
```
docker-compose up
```

You can check if the SFTP server is running by using the following command:
```
docker ps
```
