<p align="center"><img width=50% src="https://raw.githubusercontent.com/DataCloud-project/toolbox/master/docs/img/datacloud_logo.png"></p>&nbsp;

[![GitHub Issues](https://img.shields.io/github/issues/DataCloud-project/SIM-PIPE-backend.svg)](https://github.com/DataCloud-project/SIM-PIPE-backend/issues)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# SIM-PIPE-backend

The back end of the SIM-PIPE tool will perform simulations and analytics related to a specific simulation job or run and will expose REST APIs for the front end and other services. 
- The back-end will expose a dispatcher service that will dispatch requests and jobs to other sub-components of the back-end and will be implemented as a thin RESTful web service. The back-end includes a sandbox that implements the actual simulation. 
- The sandbox will provide metrics to a monitoring service. These metrics will be stored and associated with a simulation and particular run in a database. 
- Intermediate files that are produced by each step that takes part in the simulation will be stored on disk to feed further steps of the pipeline and can be provided to the user of the simulator to analyse the performance/function of the steps. 
- Simulation runs will be performed in an asynchronous manner. The simulation API will provide a controllable queue of pending simulations (allowing adding/removing items by the user as well as starting and ending a “run”).
- Finally, a simulation analytics service will be implemented that will use metrics data gathered for each run and perform statistical analysis. The results of these analyses will be provided through the REST API and can be displayed to the user during or after a simulation run.


# SIM-PIPE simulation controller setup

## Prerequisite

SIM-PIPE Backend Sandbox (https://github.com/DataCloud-project/SIM-PIPE-Sandbox) should be installed and setup before using the Simulation controller. This is an isolated environment where execution of the simulations takes place.

## Description

The SIM-PIPE tool works on two hosts. The SIM-PIPE simulation controller and SIM-PIPE Sandbox will run on these separate hosts. As the request with a pipeline description comes in from the UI, the controller will run each step in the sandbox. The controller uses dockerode remote docker library and serves the following purposes:
 - Transfer the input file from to host 2 using SFTP
 - Start a container on host 2 attaching volume on host 2's local storage with binds to 3 directories: in, out, and work
 - Resume/pause/stop a container if a request comes from UI
 - Get the output and work files from the local storage to the persistent database in host 1
 - For each container started, get the resource usage statistics (time series of CPU, memory and network usage) and logs of the run.
 - The execution input, output, logs and usage statistics will be stored in the following folder structure:


        ├── SimulationID                # The simulation ID of the current simulation
            ├── runID                # The run ID of the simulation corresponding to the current run    
                ├── stepID           # step number of the pipeline which is currently run
                    ├── input        # input file to the pipeline step
                    ├── output       # output file from the pipeline step
                    ├── logs         # logs generated from stdout and stderr
                    └── statistics   # CPU, memory, and network usage of the execution

## Install

The simulation controller can be set up in a windows machine by following the steps below.

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

After entering into the cloned folder, run the following commands to install Node.js, [Dockerode] (https://github.com/apocas/dockerode), and [ssh2-ftp-client] (https://github.com/theophilusx/ssh2-sftp-client). Also install winston logger for loggin.

    $ npm install # installs node_modules in the current folder
    $ npm install dockerode
    $ npm install ssh2-sftp-client
    $ npm install winston

## Usage 

### Starting a simulation

Set the following envrionment variables with details about the simulation. 

    $ SET SIM_ID=sim_id             # simulation ID of the simulation you wish to start
    $ SET RUN_ID=run_id             # run ID corresponding to the current execution of simulation
    $ SET STEP_NUMBER=step_number   # number of pipeline step you wish to run
    $ SET IMAGE=image               # container image of the pipeline step
    $ SET INPUT_PATH=path/to/input  # path to the input file of pipeline step

