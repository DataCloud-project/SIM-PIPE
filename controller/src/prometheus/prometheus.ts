import got from 'got';

import { prometheusServerUrl } from '../config.js';

// Kubernetes label validation regex, to prevent prometheus query string injection
const validIdentifierRegex = /^[\dA-Za-z]([\w.-]*[\dA-Za-z])?$/;

// Prometheus response data structure
interface PrometheusResult {
  metric: Record<string, string>,
  values: [[number, string]],
}

// Full response from Prometheus API
interface PrometheusResponse {
  status: string,
  data: {
    resultType: string,
    result: PrometheusResult[]
  },
  errorType?: string,
  error?: string,
}

/**
 * This function queries a Prometheus server with a given metric name and set of labels.
 *
 * @param {string} metricName - The name of the metric to query.
 * @param {Record<string, string>} labels - An object where keys are label names
 * and values are label values.
 * @param {number} start - The start time unix timestamp for the query.
 * @param {number} end - The end time unix timestamp for the query.
 * @param {number} step - The step size in seconds for the query.
 *
 * @returns {Promise<PrometheusResult[]>} - A promise that resolves with the query result,
 * or rejects with an error message.
 */
export default async function queryPrometheus(
  metricName: string,
  labels: Record<string, string>,
  start: number,
  end: number,
  step?: number,
): Promise<PrometheusResult[]> {
  // Validate inputs
  if (!prometheusServerUrl) {
    throw new Error('Prometheus server URL is not set');
  }

  if (!metricName || typeof labels !== 'object' || Object.keys(labels).length === 0) {
    throw new Error('Metric name or labels are not correctly set');
  }

  // Validate metricName and labels against a regular expression to prevent query string injection
  if (!validIdentifierRegex.test(metricName)) {
    throw new Error('Metric name contains invalid characters');
  }

  if (start > end) {
    throw new Error('Start time is after end time');
  }

  if (step !== undefined && step <= 0) {
    throw new Error('Step size is not above 0');
  }

  // Build label selectors for the query
  const labelSelectors = Object.entries(labels)
    .map(([key, value]) => {
      if (!validIdentifierRegex.test(key)) {
        throw new Error(`Label name ${key} contains invalid characters`);
      }
      if (!validIdentifierRegex.test(value)) {
        throw new Error(`Label value ${value} contains invalid characters`);
      }
      return `${key}="${value}"`;
    })
    .join(',');

  const query = `${metricName}{${labelSelectors}}`;

  const url = new URL('/api/v1/query_range', prometheusServerUrl);
  url.searchParams.set('query', query);
  url.searchParams.set('start', start.toString());
  url.searchParams.set('end', end.toString());
  if (step !== undefined) {
    url.searchParams.set('step', step.toString());
  }
  const urlString = url.toString();

  try {
    const response = await got(urlString).json<PrometheusResponse>();
    if (response.status === 'success') {
      return response.data.result;
    }
    throw new Error(`Error querying Prometheus: ${response.error ?? 'unknown error'}`);
  } catch (error) {
    throw new Error(`Failed to query Prometheus: ${(error as Error).message}`);
  }
}
