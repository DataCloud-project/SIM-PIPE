import queryPrometheus from './prometheus.js';
import type { DryRunNodeMetrics } from '../server/schema.js';

type QueryPrometheusArguments = {
  end?: number | null;
  start?: number | null;
  step?: number | null;
};

type DryRunNodeMetricsWithoutTypeName = Omit<DryRunNodeMetrics, '__typename'>;
export default async function queryPrometheusResolver<
  M extends keyof DryRunNodeMetricsWithoutTypeName,
>(
  metric: string,
  containerName: string,
  { dryRunNode: { startedAt, finishedAt, podName } }:
  { dryRunNode: {
    startedAt?: string | null,
    finishedAt?: string | null,
    podName: string | undefined
  } },
  _arguments: QueryPrometheusArguments,
): Promise<DryRunNodeMetrics[M]> {
  let { step } = _arguments;
  if (!startedAt || !podName) {
    return undefined;
  }

  // We have a 10s offset to avoid most clock drifts.
  const startTimestamp = new Date(startedAt).getTime() / 1000 - 10;

  const endTimestamp = finishedAt
    ? new Date(finishedAt).getTime() / 1000 + 10
    : Date.now() / 1000 + 10;

  if (!step) {
    step = Math.ceil((endTimestamp - startTimestamp) / 1000);
  }

  const data = await queryPrometheus(metric, {
    container_name: containerName,
    pod_name: podName,
  }, startTimestamp, endTimestamp, step);

  return data.flatMap(({ values }) => values)
    .map(([timestamp, value]) => ({
      timestamp,
      value,
    }));
}
