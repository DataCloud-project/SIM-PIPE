<p align="center"><img width=50% src="https://raw.githubusercontent.com/DataCloud-project/toolbox/master/docs/img/datacloud_logo.png"></p>&nbsp;

[![GitHub Issues](https://img.shields.io/github/issues/TBFY/knowledge-graph.svg)](https://github.com/TBFY/knowledge-graph/issues)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# SIM-PIPE

SIM-PIPE generates and simulates a deployment configuration for the final deployment that conforms to the hardware requirements and includes any additional necessary middleware inter-step communication code. Finally, the tool provides a pipeline testing functionality, including a sandbox for evaluating individual pipeline step performance, and a simulator to determine the performance of the overall Big Data pipeline. Specifically, SIM-PIPE provides the following high-level features:

-	Deploying each step of a pipeline and running it in a sandbox by providing sample input
-	Evaluating pipeline step performance by recording and analysing metrics about its execution in order to identify bottlenecks and steps to be optimized
-	Identification of resource requirements for pipeline by calculating step performance per resource used

The architecture of the SIM-PIPE consists of two main components referred to as [front-end](https://github.com/DataCloud-project/SIM-PIPE-frontend) and [back-end](https://github.com/DataCloud-project/SIM-PIPE-backend) as shown in the figure below. 

![alt text](https://raw.githubusercontent.com/DataCloud-project/SIM-PIPE/main/docs/sim-pipe_architecture.png)
