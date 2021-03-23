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
