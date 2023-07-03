{{/*
Expand the name of the chart.
*/}}
{{- define "simpipeController.name" -}}
{{- default (printf "%s-controller" .Chart.Name) .Values.controller.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "simpipeController.fullname" -}}
{{- if .Values.controller.fullnameOverride }}
{{- .Values.controller.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default (printf "%s-controller" .Chart.Name) .Values.controller.nameOverride }}
{{- if contains $name (printf "%s-controller" .Release.Name) }}
{{- printf "%s-controller" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s-controller" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "simpipeController.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "simpipeController.labels" -}}
helm.sh/chart: {{ include "simpipeController.chart" . }}
{{ include "simpipeController.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "simpipeController.selectorLabels" -}}
app.kubernetes.io/name: {{ include "simpipeController.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "simpipeController.serviceAccountName" -}}
{{- default (include "simpipeController.fullname" .) .Values.controller.serviceAccount.name }}
{{- end }}
