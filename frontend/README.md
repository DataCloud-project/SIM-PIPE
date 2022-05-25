# SIM-PIPE User Interface

The `User Interface` component of SIM-PIPE uses [AppSmith](http://appsmith.com). This folder contains the following files:

* [appsmith-frontend.json]((https://github.com/DataCloud-project/SIM-PIPE/blob/main/frontend/appsmith-frontend.json): The AppSmith definition file for the user interface.

The user interface allows for the following interactions:

* Simulation APIs – CRUD operations for a new simulation for a specific pipeline; each simulation consists of a set of "runs" that represent a single execution of the simulation.
*	Simulation "run" APIs – Start/stop/retrieve information related to a simulation run (current or historical).
*	Simulation "run" information – retrieve files and metrics related to a specific run.
