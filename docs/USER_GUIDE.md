# SIM-PIPE User Guide

## Purpose of the tool

SIM-PIPE is a testing and profiling platform designed for Big Data pipelines.

It allows users to run individual pipeline steps in a sandbox with sample input data, collect detailed hardware and performance metrics, and performs dry runs of the full pipeline execution to identify bottlenecks and resource requirements — all before committing to a production deployment.

## Integration of the tool for the purposes of DataPact

SIM-PIPE supports argo workflows in DataPact by acting as a pre-deployment testing and profiling layer.

Pipeline steps authored and configured by other DataPact tools can be submitted to SIM-PIPE as dry runs, where their execution is sandboxed, monitored, and benchmarked. The resulting metrics — CPU, memory, network, and carbon footprint — inform decisions about resource allocation and pipeline optimisation before final deployment to a target infrastructure.

## Structure and components of the tool

SIM-PIPE is composed of the following orchestration, monitoring, storage, and interface components:

- **Controller (GraphQL API)**: A Node.js/Express service exposing a GraphQL API that coordinates all platform operations. It manages pipeline dry runs, project lifecycle, VM node emulation, and metric retrieval. All mutations and most queries are protected by the `@auth` directive and enforced per-user via Kubernetes labels.

- **Frontend (SvelteKit GUI)**: A browser-based graphical user interface accessible at `http://localhost:8088` after installation. It enables users to create projects, submit and monitor dry runs, browse pipeline artifacts, and inspect hardware metrics through an interactive dashboard.

- **Argo Workflows**: The workflow engine responsible for scheduling and executing containerised pipeline steps on Kubernetes. Pipelines are submitted as Argo `Workflow` resources using a declarative YAML format, with support for DAG-based task orchestration, parameterisation, and artifact passing between steps.

- **Kubernetes (K3S)**: The container orchestration platform underpinning SIM-PIPE. All pipeline steps run as Kubernetes pods. K3S is the recommended lightweight distribution for local and single-node deployments. SIM-PIPE is compatible with any standard Kubernetes distribution.

- **MinIO (Object Storage)**: An S3-compatible object store used to persist pipeline inputs, outputs, intermediate data, and execution artifacts. Accessible also via SFTPGo for users who prefer SFTP, FTP, or WebDAV interfaces.

- **Prometheus and cAdvisor**: Prometheus collects and stores time-series metrics scraped from cAdvisor, which monitors running container CPU, memory, network, and filesystem usage at high frequency. These metrics are surfaced through the controller and visualised in the frontend.

- **Carbontracker**: A FastAPI service that tracks and reports the carbon footprint of pipeline executions, supporting sustainability-aware pipeline evaluation.

- **KWOK (Node Simulator)**: A Kubernetes simulation toolkit used to create virtual clusters of emulated nodes. SIM-PIPE uses KWOK to test pipeline scheduling behaviour and resource orchestration at scale without requiring real hardware.

- **Keycloak (Authentication)**: OIDC-based authentication provider. When configured, users authenticate via Keycloak and all data is isolated per user using the Keycloak `sub` claim as a Kubernetes label. Authentication can be disabled in development mode.
