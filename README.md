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

There are two hosts: host 1 and host 2. The SIM-PIPE simulation controller will run in host 1. Host 2 acts as a sandbox. As the request with a pipeline description comes in from the UI, the controller will run each step in host 2. The controller uses dockerode remote docker library and serves the following purposes:
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

## Environment settings

The setup for the implementation is given below. 

Host 1 settings: 

 - System Windows 10 with docker desktop installed.
 - Dockerode library (link - https://github.com/apocas/dockerode) is used in the repository
 - After cloning the repository in host 1, run 'npm install' to install node_modules, run 'npm install dockerode' to install dockerode. 
 - Port forwarding setup between ports 2375 on the host 1 and host 2.
 - Setup ssh with nodejs - node-sftp-client (https://openbase.com/js/node-sftp-client/documentation#list)
	- npm install ssh2-sftp-client
