# Remote patient monitoring example

Example of a remote patient monitoring pipeline:

![alt text](rpm_scenario.PNG)

The example does not require that you install any additional software and is provided for testing purposes only. The pipeline is based on a use case from the [DataCloud project](https://datacloudproject.eu/).

The example consists of three steps:
 
 1. **Retrieve** - Emulates the retrieval of monitoring data from a patient and its pre-processing into a format that can be used to store in a FHIR database. Then data are emulated to be pushed into an MQTT message queueing service.
 2. **Process** - Emulates the processing of data retrieved from an MQTT message queueing service. It emulates a check against a patient plan and building of a database record that is then stored in an emulated database that supports the [FHIR standard](https://www.hl7.org/fhir/overview.html). 
 3. **Notify** - Emulates a notification service for healthcare personnel or patient device, which periodically accesses patient data in a FHIR-compliant database. If there are deviations, the service emulates the sending of a message to a healthcare professional.

# Running the example
Create a new SIM-PIPE project by clicking "Create" in the main Projects menu in SIM-PIPE. Enter a name and select the project template [remote-patient-monitoring.yaml](remote-patient-monitoring.yaml). 

To create a dry run of the example, go to the project page by clicking on the project name in the list of your projects. Enter a name and press the "Submit" button.

_Note: This example folder also contains a second project template called [remote-patient-monitoring-error.yaml](remote-patient-monitoring-error.yaml). This version uses a container image, which includes a deliberate error in the _Process_ step in order to demonstrate capabilities related to errors in the SIM-PIPE Dry Runner._

# Configuration
The example provides many parameters and below is information about inputs and environmental variables that are taken into account in the emulation (the rest are ignored).

## Inputs
It is possible to select a file using the **Input** parameter. Only the _file size_ is taken into account in the emulation and is taken into account to slightly increase the RAM usage of the _"Retrieve"_ step during the dry run. The files named [sample1.txt](sample1.txt) and [sample2.txt](sample2.txt) can be used as input (although any file can be inputted).

## Parameters/environmental variables
The following input parameters that correspond to environmental variables are taken into account for the emulation:
 - **input-frequency** - sets the value of the environmental variable _INPUT_FREQUENCY_ in the created container. The environmental variable value is then used to increase the CPU usage of the _"Retrieve"_ step during the dry run.

# Building the pipeline images
This repository contains the source code used to build the steps of the pipeline. Each of the folders contains the Dockerfile used to build the images referred in [remote-patient-monitoring.yaml](remote-patient-monitoring.yaml)