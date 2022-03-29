<p align="center"><img width=50% src="https://raw.githubusercontent.com/DataCloud-project/toolbox/master/docs/img/datacloud_logo.png"></p>&nbsp;

[![GitHub Issues](https://img.shields.io/github/issues/DataCloud-project/SIM-PIPE.svg)](https://github.com/DataCloud-project/SIM-PIPE/issues)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# SIM-PIPE

SIM-PIPE generates and simulates a deployment configuration for the final deployment that conforms to the hardware requirements and includes any additional necessary middleware inter-step communication code. Finally, the tool provides a pipeline testing functionality, including a sandbox for evaluating individual pipeline step performance, and a simulator to determine the performance of the overall Big Data pipeline. Specifically, SIM-PIPE provides the following high-level features:

-	Deploying each step of a pipeline and running it in a sandbox by providing sample input
-	Evaluating pipeline step performance by recording and analysing metrics about its execution in order to identify bottlenecks and steps to be optimized
-	Identification of resource requirements for pipeline by calculating step performance per resource used

## Architecture

The architecture of the SIM-PIPE consists of three main components:

1. [SIM-PIPE User Interface](https://github.com/DataCloud-project/SIM-PIPE/tree/main/frontend) that provides a user interface for starting, stopping and retrieiving information to a simulation run. SIM-PIPE tool performs simulations and analytics related to a specific simulation job or run and exposes REST APIs for the front-end and other services:

2. [SIM-PIPE Simulation Controller](https://github.com/DataCloud-project/SIM-PIPE/controller) that performs simulations and analytics related to a specific simulation job or run and exposes REST APIs for the front-end and other services. It provides the following functionality:

    - It provides dispatcher service that dispatches requests and jobs to other sub-components of the back-end, including the sandbox.
    - It stores intermediate files that are produced by each step that takes part in the simulation on disk to feed further steps of the pipeline. The files can be provided to the user of the simulator to analyse the performance/function of the steps. 
    - It executes simulation runs in an asynchronous manner. The simulation API will provide a controllable queue of pending simulations (allowing adding/removing items by the user as well as starting and ending a "run").
    - It provides a simulation analytics service that gathers metrics for each run and performs statistical analysis. The results of these analyses will be provided through the REST API and can be displayed to the user during or after a simulation run.

3. [SIM-PIPE Sandbox](https://github.com/DataCloud-project/SIM-PIPE/tree/main/sandbox) that implements the actual simulation runs. The sandbox provides metrics to a monitoring service. These metrics will be stored and associated with a simulation and particular run in a database.

The figure below shows a logical architecture of SIM-PIPE where the components are grouped together as a front-end and a back-end (consisting of the simulation controller and the sandbox).

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/sim-pipe_architecture.png)

## Deployment

The SIM-PIPE tool is deployed on two hosts as shown in the figure below. The SIM-PIPE Simulation Controller and SIM-PIPE Sandbox runs on two separate hosts. The sandbox is an isolated environment where execution of the simulations takes place.

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/sim-pipe_deployment.png)

As the request comes in from the UI with a pipeline description, the controller will run each step of the pipeline in the sandbox. The controller uses Dockerode remote docker library and serves the following purposes:

* Transfer the input file from to Sandbox using SFTP
* Start a container on Sandbox attaching volume on its's local storage with binds to 3 directories: in, out, and work. The containers follow the template to take input from /in, put intermedaiate files to /work and store output in /output.
* Resume/pause/stop a container if a request comes from UI
* Get the output and work files from the local storage of the Sandbox and store it in persistent database.
* For each container started, controller will retrieve the resource usage statistics (time series of CPU, memory and network usage) and logs of the execution.
* The execution input, output, logs and usage statistics will be stored in the following folder structure:

        ├── SimulationID                # The simulation ID of the current simulation
            ├── runID                # The run ID of the simulation corresponding to the current run    
                ├── stepID           # step number of the pipeline which is currently run
                    ├── input        # input file to the pipeline step
                    ├── output       # output file from the pipeline step
                    ├── logs         # logs generated from stdout and stderr
                    └── statistics   # CPU, memory, and network usage of the execution

* Once the simulation is completed and all relevant files have been retreived, the simulation controller then cleans out the /in, /work and /out folders in Sandbox local storage to prepare for the next run. 

## Installation

To install SIM-PIPE follow these steps:

1. The SIM-PIPE Sandbox environment must be set up first. Follow the installation instructions in the [sandbox](https://github.com/DataCloud-project/SIM-PIPE-Simulation-Controller/tree/main/sandbox) folder.
2. After the sandbox is set up, proceed to install the other components of the SIM-PIPE tool (i.e., User Interface and Simulation Controller) by following the installations instructions in the [controller](https://github.com/DataCloud-project/SIM-PIPE-Simulation-Controller/tree/main/sandbox) folder.

## Running your first data pipeline simulation

After the SIM-PIPE tool has been installed, you are ready to run your first data pipeline simulation. Ensure that the sandbox VM is running and that the Docker daemon in the Sandbox is listending on port 2375.

