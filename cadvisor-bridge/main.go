package main

import (
	"fmt"
	"io"
	"net/http"
	_ "net/http/pprof"
	"os"
	"strings"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	dto "github.com/prometheus/client_model/go"
	"github.com/prometheus/common/expfmt"

	vmp "github.com/VictoriaMetrics/VictoriaMetrics/lib/protoparser/prometheus"
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

func fetchMetrics(endpoint string) (string, error) {
	resp, err := http.Get(endpoint)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	stringMetrics := string(body)
	return stringMetrics, nil
}

func parseMetricsSlowly(data string) (map[string]*dto.MetricFamily, error) {
	var parser expfmt.TextParser
	return parser.TextToMetricFamilies(strings.NewReader(data))
}

func parseMetricsQuickly(data string) *vmp.Rows {
	var rows vmp.Rows
	rows.Unmarshal(data)
	return &rows
}

func main() {

	// Getting the endpoint from command-line arguments
	if len(os.Args) < 2 {
		fmt.Println("Please provide an endpoint")
		os.Exit(1)
	}
	endpoint := os.Args[1]

	// create a struct that holds the help and the metric type (dto.MetricType)
	type metricMetadata struct {
		help string
		typ  dto.MetricType
	}

	// Create a map of metric names to their metadata
	metricMetadataMap := make(map[string]metricMetadata)
	mapIsInitialized := false

	// General information
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)

		// Sends a HTPT 200 OK
		fmt.Fprintf(w, "simpipe-cadvisor-bridge\n")
	})

	// Expose the metrics
	http.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		// prometheus.DefaultRegisterer.UnregisterAll() // Clear all the old metrics

		metricsString, err := fetchMetrics(endpoint)
		if err != nil {
			http.Error(w, "Error fetching metrics", http.StatusInternalServerError)
			return
		}

		if !mapIsInitialized {
			// parse the metrics using the slow prometheus parser, that parses more metadata information
			// we do it only once because it is slow
			metricsWithMetadata, err := parseMetricsSlowly(metricsString)
			if err != nil {
				http.Error(w, "Error parsing metrics", http.StatusInternalServerError)
				return
			}
			for _, metric := range metricsWithMetadata {
				metricName := metric.GetName()
				if strings.HasPrefix(metricName, "container_") {
					// get the help and the type of the metric
					help := metric.GetHelp()
					metricType := metric.GetType()

					// store the metadata in the map
					metricMetadataMap[metricName] = metricMetadata{help, metricType}
				}
			}
			mapIsInitialized = true
		}

		metrics := parseMetricsQuickly(metricsString)

		collectors := make([]prometheus.Collector, 0)

		metricsMap := make(map[string]([]vmp.Row))

		for _, row := range metrics.Rows {
			metricName := row.Metric
			metric, found := metricsMap[metricName]
			if !found {
				metric = make([]vmp.Row, 0)
			}
			metricsMap[metricName] = append(metric, row)
		}

		for metricName, rows := range metricsMap {

			// starts with container_
			if strings.HasPrefix(metricName, "container_") {

				// Look around all the metrics and build a map of the ones for simpipe
				var simpipeMetrics map[string]*prometheus.Labels = make(map[string]*prometheus.Labels)

				hasAtLeastOneSimpipe := false
				for _, serie := range rows {
					// check if it's a simpipe followed metric by checking the label container_label_simpipe
					isSimpipe := false
					for _, label := range serie.Tags {
						if label.Key == SIMPIPE_LABEL && (label.Value == "true" || label.Value == "1" || label.Value == "yes") {
							isSimpipe = true
							hasAtLeastOneSimpipe = true
							break
						}
					}

					// Build nice labels if it's a simpipe
					if isSimpipe {
						key := ""
						labels := make(prometheus.Labels, 5)
						for _, label := range serie.Tags {
							labelName := label.Key
							labelValue := label.Value
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

				// fetch the metadata from this metric
				metadata, found := metricMetadataMap[metricName]
				var help string
				var metricType dto.MetricType
				if found {
					help = metadata.help
					metricType = metadata.typ
				} else {
					help = "Undocumented metric, consider restarting the cadvisor-bridge"
					metricType = dto.MetricType_GAUGE // Most likely a gauge
				}

				// Create a gauge for the metric
				simpipeName := "simpipe_" + strings.TrimPrefix(metricName, "container_")

				// create the right collector
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
					fmt.Println("Unknown metric type: ", metricType.String())
					continue
				}

				// Yes this is a label
			metric_loop:
				for _, serie := range rows {
					labels := prometheus.Labels{}

					for _, label := range serie.Tags {
						labelName := label.Key
						labelValue := label.Value
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
						gauge.With(labels).Set(serie.Value)
					case dto.MetricType_COUNTER:
						counter.With(labels).Add(serie.Value)
					default:
						// crash as we should not be here
						panic("Unknown metric type: " + metricType.String())
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
