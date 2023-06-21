package main

import (
	"fmt"
	"net/http"
	_ "net/http/pprof"
	"os"
	"strings"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	dto "github.com/prometheus/client_model/go"
	"github.com/prometheus/common/expfmt"
)

// constants
const (
	SIMPIPE_LABEL = "container_label_simpipe"
)

var SIMPIPE_LABELS = []string{
	"node_id",   // container_label_annotation_workflows_argoproj_io_node_id from Argo
	"node_name", // container_label_annotation_workflows_argoproj_io_node_name from Argo

	"pod_uid",       // container_label_io_kubernetes_pod_uid from Kubernetes
	"pod_name",      // container_label_io_kubernetes_pod_name from Kubernetes
	"pod_namespace", // container_label_io_kubernetes_pod_namespace from Kubernetes

	"container_name", // container_label_io_kubernetes_container_name from Kubernetes
	"full_id",        // id
	"full_name",      // name
}

func fetchMetrics(endpoint string) (map[string]*dto.MetricFamily, error) {
	resp, err := http.Get(endpoint)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var parser expfmt.TextParser
	parsed, err := parser.TextToMetricFamilies(resp.Body)
	if err != nil {
		return nil, err
	}

	return parsed, nil
}

func main() {

	// Getting the endpoint from command-line arguments
	if len(os.Args) < 2 {
		fmt.Println("Please provide an endpoint")
		os.Exit(1)
	}
	endpoint := os.Args[1]

	// TODO: apply your filters here

	// Expose the metrics
	http.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		// prometheus.DefaultRegisterer.UnregisterAll() // Clear all the old metrics

		metrics, err := fetchMetrics(endpoint)
		if err != nil {
			http.Error(w, "Error fetching metrics", http.StatusInternalServerError)
			return
		}

		collectors := make([]prometheus.Collector, 0)

		for _, metric := range metrics {

			metricName := metric.GetName()

			// starts with container_
			if strings.HasPrefix(metricName, "container_") {

				// Look around all the metrics and build a map of the ones for simpipe
				var simpipeMetrics map[string]*prometheus.Labels = make(map[string]*prometheus.Labels)

				hasAtLeastOneSimpipe := false
				for _, serie := range metric.Metric {
					// check if it's a simpipe followed metric by checking the label container_label_simpipe
					isSimpipe := false
					for _, label := range serie.Label {
						if label.GetName() == SIMPIPE_LABEL && label.GetValue() == "true" {
							isSimpipe = true
							hasAtLeastOneSimpipe = true
							break
						}
					}

					// Build nice labels if it's a simpipe
					if isSimpipe {
						key := ""
						labels := make(prometheus.Labels, 5)
						for _, label := range serie.Label {
							labelName := label.GetName()
							labelValue := label.GetValue()
							switch labelName {
							case "container_label_annotation_workflows_argoproj_io_node_id":
								labels["node_id"] = labelValue
							case "container_label_annotation_workflows_argoproj_io_node_name":
								labels["node_name"] = labelValue
							case "container_label_io_kubernetes_pod_uid":
								labels["pod_uid"] = labelValue
								key = labelValue
							case "container_label_io_kubernetes_pod_name":
								labels["pod_name"] = labelValue
							case "container_label_io_kubernetes_pod_namespace":
								labels["pod_namespace"] = labelValue
							}
						}

						if key != "" {
							simpipeMetrics[key] = &labels
						}
					}
				}

				if !hasAtLeastOneSimpipe {
					continue
				}

				help := metric.GetHelp()

				// Create a gauge for the metric
				simpipeName := "simpipe_" + strings.TrimPrefix(metricName, "container_")

				// create the right collector

				metricType := *metric.Type
				var gauge *prometheus.GaugeVec
				var counter *prometheus.CounterVec
				switch metricType {
				case dto.MetricType_GAUGE:
					gauge = promauto.NewGaugeVec(prometheus.GaugeOpts{
						Name: simpipeName,
						Help: help,
					}, SIMPIPE_LABELS)
					collectors = append(collectors, gauge)
				case dto.MetricType_COUNTER:
					counter = promauto.NewCounterVec(prometheus.CounterOpts{
						Name: simpipeName,
						Help: help,
					}, SIMPIPE_LABELS)
					collectors = append(collectors, counter)
				default:
					fmt.Println("Unknown metric type: ", metric.Type)
					continue
				}

				// Yes this is a label
			metric_loop:
				for _, serie := range metric.Metric {
					labels := prometheus.Labels{}

					for _, label := range serie.Label {
						labelName := label.GetName()
						labelValue := label.GetValue()
						switch labelName {
						case "container_label_io_kubernetes_pod_uid":
							// fill the labels with the ones from the simpipeMetrics
							parentContainerLabels, found := simpipeMetrics[labelValue]
							if found {
								for k, v := range *parentContainerLabels {
									labels[k] = v
								}
							} else {
								// we skip this
								continue metric_loop
							}
						case "container_label_io_kubernetes_container_name":
							labels["container_name"] = labelValue
						case "name":
							labels["full_name"] = labelValue
						case "id":
							labels["full_id"] = labelValue
						}
					}

					switch metricType {
					case dto.MetricType_GAUGE:
						gauge.With(labels).Set(serie.GetGauge().GetValue())
					case dto.MetricType_COUNTER:
						counter.With(labels).Add(serie.GetCounter().GetValue())
					default:
						// crash as we should not be here
						panic("Unknown metric type: " + metric.Type.String())
					}
				}
			}
		}

		promhttp.Handler().ServeHTTP(w, r)

		// deregister all the collectors
		for _, collector := range collectors {
			prometheus.Unregister(collector)
		}
	})
	http.ListenAndServe(":2112", nil)
}
