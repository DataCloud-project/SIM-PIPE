# Simpipe-cAdvisor-Bridge

Simpipe-cAdvisor-Bridge is a lightweight utility that serves as an intermediary between cAdvisor and Prometheus. Its purpose is to harvest metrics from cAdvisor, process them by applying filtering and grouping actions, and then make the refined data available for collection by Prometheus.

## How to Use

The utility can be deployed in the following manner, although for optimal results, it is recommended to deploy it within the same pod as cAdvisor in a Kubernetes environment:

```bash
$ simpipe-cadvisor-bridge http://cadvisor_endpoint:8080/metrics
```

## Metric Filtering

Simpipe-cAdvisor-Bridge focuses solely on container metrics, which can be easily identified by their `container_` prefix in cAdvisor. However, the utility will disregard any containers that are not situated within a pod with the `simpipe=true` label.

## Metric Grouping

Unfortunately, when using Kubernetes with Docker, the labels are not automatically associated with subcontainers within a pod. To address this, Simpipe-cAdvisor-Bridge checks the labels of the primary pod container and assigns these labels to the subcontainers too.

## Metric Mapping

All processed metrics are rebranded with a `simpipe_` prefix in place of the original `container_` prefix. Moreover, the labels are renamed to ensure compatibility with Simpipe:

- "node_id": Originally `container_label_annotation_workflows_argoproj_io_node_id` from Argo
- "node_name": Originally `container_label_annotation_workflows_argoproj_io_node_name` from Argo
- "pod_uid": Originally `container_label_io_kubernetes_pod_uid` from Kubernetes
- "pod_name": Originally `container_label_io_kubernetes_pod_name` from Kubernetes
- "pod_namespace": Originally `container_label_io_kubernetes_pod_namespace` from Kubernetes
- "container_name": Originally `container_label_io_kubernetes_container_name` from Kubernetes
- "full_id": Corresponds to the `id`
- "full_name": Corresponds to the `name`

## Code Quality and Choices

This utility is written in Golang, aligning with Prometheus, to facilitate the reuse of Prometheus utilities as much as possible.

While the code may not be the most sophisticated you've ever seen, its aim is to be functional.

### Performance Note :zap:

cAdvisor generates a large volume of metrics - approximately 5MB of text in a fairly clean environment. Interestingly, the Prometheus parser takes around a second to process this quantity of text. To circumvent this issue, Simpipe-cAdvisor-Bridge incorporates a more efficient parser from VictoriaMetrics, which is also developed in Golang. This enhanced parser can process data about **200 times faster**. However, the Prometheus parser is still employed once to extract the help text and metric types, which are not processed by VictoriaMetrics.
