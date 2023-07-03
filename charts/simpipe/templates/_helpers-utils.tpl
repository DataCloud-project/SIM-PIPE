{{/*
Expand the name of the chart.
*/}}
{{- define "simpipeUtils.name" -}}
{{- default (printf "%s-utils" .Chart.Name) .Values.utils.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "simpipeUtils.fullname" -}}
{{- if .Values.utils.fullnameOverride }}
{{- .Values.utils.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default (printf "%s-utils" .Chart.Name) .Values.utils.nameOverride }}
{{- if contains $name (printf "%s-utils" .Release.Name) }}
{{- printf "%s-utils" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s-utils" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "simpipeUtils.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "simpipeUtils.labels" -}}
helm.sh/chart: {{ include "simpipeUtils.chart" . }}
{{ include "simpipeUtils.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "simpipeUtils.selectorLabels" -}}
app.kubernetes.io/name: {{ include "simpipeUtils.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
