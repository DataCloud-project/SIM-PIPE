<p align="center"><img width=50% src="https://raw.githubusercontent.com/DataCloud-project/toolbox/master/docs/img/datacloud_logo.png"></p>&nbsp;

[![GitHub Issues](https://img.shields.io/github/issues/DataCloud-project/SIM-PIPE.svg)](https://github.com/DataCloud-project/SIM-PIPE/issues)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# SIM-PIPE Simulation Controller

The Simulation Controller component of SIM-PIPE provides control of simulations and analytics related to a specific simulation job. The root folder of this repository contains the the necessary setup and configuration files for deploying the SIM-PIPE tool.

* [docker-compose.yaml](https://github.com/DataCloud-project/SIM-PIPE/blob/main/docker-compose.yaml): A [Docker Compose file](https://docs.docker.com/compose/) that starts the SIM-PIPE tool.

## Prerequisites

### Sandbox VM

The SIM-PIPE Sandbox must be set up first. Follow the installation instructions in the [sandbox](https://github.com/DataCloud-project/SIM-PIPE/tree/main/sandbox) folder.

### Docker and Docker Compose

#### Ubuntu installation

See https://docs.docker.com/engine/install/ubuntu/ for instructions on how to install Docker. For your convenience the list of commands to be run are copied below:

```
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

See https://docs.docker.com/compose/install/ for instructions on how to install Docker Compose. For your convenience the list of commands to be run are copied below:

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Test the installations:
```
docker --version
docker-compose --version
```

#### Windows installation

See https://docs.docker.com/desktop/windows/install/ for instructions on how to install Docker Desktop, which includes both Docker and Docker Compose, on Windows. Docker Desktop requires Windows Subsystem for Linux (WSL) 2. After installing Docker Desktop, follow the instructions on https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package to install the kernel update.

Finally, make sure that the setting "Expose daemon on tcp://localhost:2375 without TLS" option is unchecked as shown in the figure below.

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/docker_desktop_settings.png)

## SIM-PIPE tool installation

The SIM-PIPE tool (i.e., the SIM-PIPE User Interface and SIM-PIPE Simulation Controller) can be run on both Windows and Ubuntu, while the SIM-PIPE Sandbox component must be run on its own separate Ubuntu VM. Below we provide the installation instructions for running the SIM-PIPE tool on both Ubuntu and Windows. 

### Running the SIM-PIPE tool on Ubuntu

#### Step 1. Clone the SIM-PIPE repository

Command line:

```
git clone https://github.com/DataCloud-project/SIM-PIPE.git
cd SIM-PIPE
```

#### Step 2. Build the simpipe-backend Docker image

Command line:

```
sudo docker build -t simpipe-backend -f Dockerfile .
```

<!--#### Step 3. Configure the environment settings in the .env file

The [.env](https://github.com/DataCloud-project/SIM-PIPE/blob/main/.env) file contains environment settings for the Hasura service that must be updated.

* `HASURA='http://127.0.0.1:8080/v1/graphql'`

Use your favorite eidtor and change the IP address in the URL accordingly, e.g.:

```
pico .env
```-->

#### Step 3. Configure the environment settings

The [docker-compose.yaml](https://github.com/DataCloud-project/SIM-PIPE/blob/main/docker-compose.yaml) refers to environment settings that must be updated, such as the IP address of the host running the SIM-PIPE tool and the IP address of the host running the SIM-PIPE Sandbox. These settings are set in the [.env](https://github.com/DataCloud-project/SIM-PIPE/blob/main/.env) file.

* `REMOTE_SCHEMA_URL`: URL to the host running the SIM-PIPE tool. Default value is `http://192.168.1.6:9000`.
* `SANDBOX_IP`: IP address of the sandbox VM. Default value is `'192.168.56.1'`.
* `CONTAINER_TIME_LIMIT`: Number of seconds to wait before sending STOP signal to running container. Default value is `20` seconds.
* `CONTAINER_STOP_TIMEOUT`: Number of seconds to wait after sending STOP signal to running container. Default value is `5` seconds.
* `POLLING_INTERVAL`: Polling interval (in seconds) for collecting resource usage statistics. Default value is `1` second.

Use your favorite editor and change the IP address in the `REMOTE_SCHEMA_URL` and the `SANDBOX_IP` settings accordingly, e.g.:

```
pico .env
```

#### Step 4. Run the SIM-PIPE tool using Docker Compose

Command line:
```
sudo docker-compose -f docker-compose.yaml --env-file .env up
```

### Running the SIM-PIPE tool on Windows

#### Step 1. Install Node.js

Install Node.js on windows machine by following the installation instructions from [Node.js official site](https://nodejs.org/en/download/).

#### Step 2. Set up the SIM-PIPE tool

Clone SIM-PIPE repository into a folder using the command:

```
git clone https://github.com/DataCloud-project/SIM-PIPE.git
```

After entering into the cloned folder, run the following commands to install Node.js, [Dockerode](https://github.com/apocas/dockerode), and [ssh2-ftp-client](https://github.com/theophilusx/ssh2-sftp-client). Also install [winston logger](https://github.com/winstonjs/winston) for logging.

```
npm install
```

#### Step 3. Configure the environment settings in the Docker Compose file

The same as step 3. above when running on Ubuntu.

#### Step 4. Run the SIM-PIPE tool using Docker Compose

The same as step 4. above when running on Ubuntu.

### Configuring the AppSmith user interface

After running Docker Compose, the SIM-PIPE tool can be accessed in a Web browser on port 8085, e.g., http://localhost:8085, if it was deployed on the localhost.

The first time you run the SIM-PIPE tool you will need to configure the AppSmith-defined user interface. Click the "Get started" button.

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/appsmith_get_started.png)

Fill out the form.

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/appsmith_welcome.png)

 Click the "Make your first app" button.

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/appsmith_first_app.png)

Click the "Build on my own" button. 

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/appsmith_build_own.png)

Click the "a_" icon marked in red in the figure below. This is the "Back to homepage" button.

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/appsmith_back_homepage.png)

In the AppSmith homepage click the "..." button and select "Import application"

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/appsmith_import_application.png)

Import the [appsmith-frontend.json](https://github.com/DataCloud-project/SIM-PIPE/blob/main/frontend/appsmith-frontend.json) file found in the [frontend](https://github.com/DataCloud-project/SIM-PIPE/tree/main/frontend) folder.

Finally, launch the SIM-PIPE Frontend app.

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/sim-pipe_frontend_simulations.png)
