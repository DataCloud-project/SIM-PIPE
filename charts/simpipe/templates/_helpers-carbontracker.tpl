{{/*
Expand the name of the chart.
*/}}
{{- define "simpipeCarbontracker.name" -}}
{{- default (printf "%s-carbontracker" .Chart.Name) .Values.carbontracker.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "simpipeCarbontracker.fullname" -}}
{{- if .Values.carbontracker.fullnameOverride }}
{{- .Values.carbontracker.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default (printf "%s-carbontracker" .Chart.Name) .Values.carbontracker.nameOverride }}
{{- if contains $name (printf "%s-carbontracker" .Release.Name) }}
{{- printf "%s-carbontracker" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s-carbontracker" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "simpipeCarbontracker.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "simpipeCarbontracker.labels" -}}
helm.sh/chart: {{ include "simpipeCarbontracker.chart" . }}
{{ include "simpipeCarbontracker.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "simpipeCarbontracker.selectorLabels" -}}
app.kubernetes.io/name: {{ include "simpipeCarbontracker.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "simpipeCarbontracker.serviceAccountName" -}}
{{- default (include "simpipeCarbontracker.fullname" .) .Values.carbontracker.serviceAccount.name }}
{{- end }}
