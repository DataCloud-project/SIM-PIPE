<p align="center"><img width=50% src="https://raw.githubusercontent.com/DataCloud-project/toolbox/master/docs/img/datacloud_logo.png"></p>&nbsp;

[![GitHub Issues](https://img.shields.io/github/issues/DataCloud-project/SIM-PIPE-backend.svg)](https://github.com/DataCloud-project/SIM-PIPE-backend/issues)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# CONTENTS

 * SIM-PIPE Backend Introduction
 * SIM-PIPE Simulation Controller
    * Prerequisite
    * Description
    * Installation
    * Usage


# SIM-PIPE Backend Introduction

The backend of the SIM-PIPE tool will perform simulations and analytics related to a specific simulation job or run and will expose REST APIs for the front end and other services. 
- The back-end will expose a dispatcher service that will dispatch requests and jobs to other sub-components of the back-end and will be implemented as a thin RESTful web service. The back-end includes a sandbox that implements the actual simulation. 
- The sandbox will provide metrics to a monitoring service. These metrics will be stored and associated with a simulation and particular run in a database. 
- Intermediate files that are produced by each step that takes part in the simulation will be stored on disk to feed further steps of the pipeline and can be provided to the user of the simulator to analyse the performance/function of the steps. 
- Simulation runs will be performed in an asynchronous manner. The simulation API will provide a controllable queue of pending simulations (allowing adding/removing items by the user as well as starting and ending a “run”).
- Finally, a simulation analytics service will be implemented that will use metrics data gathered for each run and perform statistical analysis. The results of these analyses will be provided through the REST API and can be displayed to the user during or after a simulation run.  
  



# SIM-PIPE Simulation Controller

## Prerequisite

SIM-PIPE Backend Sandbox (https://github.com/DataCloud-project/SIM-PIPE-Sandbox) should be installed and setup before using the Simulation controller. This is an isolated environment where execution of the simulations takes place.

## Description

The SIM-PIPE tool works on two hosts. The SIM-PIPE simulation controller and SIM-PIPE Sandbox will run on these separate hosts. As the request comes in from the UI with a pipeline description, the controller will run each step of teh pipeline in the Sandbox. The controller uses Dockerode remote docker library and serves the following purposes:
 - Transfer the input file from to Sandbox using SFTP
 - Start a container on Sandbox attaching volume on its's local storage with binds to 3 directories: in, out, and work. The containers follow the template to take input from /in, put intermedaiate files to /work and store output in /output.
 - Resume/pause/stop a container if a request comes from UI
 - Get the output and work files from the local storage of the Sandbox and store it in persistent database.
 - For each container started, controller will retrieve the resource usage statistics (time series of CPU, memory and network usage) and logs of the execution.
 - The execution input, output, logs and usage statistics will be stored in the following folder structure:


        ├── SimulationID                # The simulation ID of the current simulation
            ├── runID                # The run ID of the simulation corresponding to the current run    
                ├── stepID           # step number of the pipeline which is currently run
                    ├── input        # input file to the pipeline step
                    ├── output       # output file from the pipeline step
                    ├── logs         # logs generated from stdout and stderr
                    └── statistics   # CPU, memory, and network usage of the execution

 - Once the simulation is completed and all relevant files have been retreived, the simulation controller then cleans out the /in, /work and /out folders in Sandbox local storage to prepare for the next run. 
## Installation

The simulation controller can be set up in a windows machine by following the steps below. The Simulation Controller has been assumed to be running in a Windows machine, and the Sandbox is set up in an Ubuntu 20.04 machine running in VirtualBox on the same Windows machine. This ensures that the sandbox runs in an isolated environment.

### Install VirtualBox

Install Oracle >VM VirtualBox on windows machine by following the installation instructions from [VirtualBox official site] (https://www.virtualbox.org/). The SIM-PIPE Sandbox component will be deployed in it. Please check the [SIM-PIPE Backend Sandbox repository] (https://github.com/DataCloud-project/SIM-PIPE-Sandbox) to install the sandbox. Port forwarding should be set up for port 2375.

### Install Docker in Windows

You can find more information about the installation of Docker Desktop for Windows on the [official Docker website](https://docs.docker.com/get-docker/). Make sure that in settings docker daemon is not exposed in port 2375.

    
    > Expose daemon on tcp://localhost:2375 without TLS option should be unchecked.

### Install Node.js on Windows

Install Node.js on windows machine by following the installation instructions from [Node.js official site] (https://nodejs.org/en/download/).

### Install Simulation Controller

Clone the SIM-PIPE Simulation Controller into a folder using the command

    $ git clone https://github.com/DataCloud-project/SIM-PIPE-Simulation-Controller.git

After entering into the cloned folder, run the following commands to install Node.js, [Dockerode] (https://github.com/apocas/dockerode), and [ssh2-ftp-client] (https://github.com/theophilusx/ssh2-sftp-client). Also install winston logger for logging.

    $ npm install

## Usage 

### Configuration of SIM-PIPE

#### Environment variables in docker compose file

    REMOTE_SCHEMA_URL - IP address of host 1 machine
    SANDBOX_IP - IP address of *VirtualBox Host-Only Network*
    CONTAINER_TIME_LIMIT- number of seconds to wait before sending STOP signal to running container; default 20 seconds
    CONTAINER_STOP_TIMEOUT - number of seconds to wait after sending STOP signal to running container; default 5 seconds
    POLLING_INTERVAL - polling interval (in seconds) for collecting resource usage statistics; default 1 second
### Starting a simulation

[SIM-PIPE Backend Sandbox] (https://github.com/DataCloud-project/SIM-PIPE-Sandbox) should be set up before starting the simulation. Ensure that the docker daemon in Sandbox is listening to port 2375.

After configuring environment variables in the docker compose file, deploy SIM-PIPE tool by starting docker compose file in the parent folder of the repository. 

    $ docker-compose up

This starts four docker containers with the services for SIM-PIPE including SIM-PIPE backend and frontend. 

After the docker compose file is started, open the frontend url (http://localhost:8085) in a browser to access the graphical user interface of SIM-PIPE. 
