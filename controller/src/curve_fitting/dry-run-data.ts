import { convertArgoWorkflowNode, getDryRun } from '../argo/dry-runs.js';
import queryPrometheusResolver from '../prometheus/query-prometheus-resolver.js';
import type { ArgoWorkflow } from '../argo/argo-client.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import { PrometheusSample } from 'server/schema.js';
import { getObjectSize } from '../minio/minio.js';

interface NodeData {
  dryRunId: string[];
  inputFileSize: number[];
  cpuSystemSecondsTotal: number[];
  memoryUsageBytes: number[];
}

interface NodeInfo {
  nodeDisplayName: string;
  data: NodeData
}

function computeDuration(values: PrometheusSample[]): number {
  if (!values || values.length === 0) {
    return 0;
  }
  const numericalValues = values.map((data) => Number.parseFloat(data.value));
  const duration = (numericalValues.at(-1) ?? 0) - numericalValues[0];
  return duration;
}

function computeAverage(values: PrometheusSample[]): number {
  if (!values || values.length === 0) {
    return 0;
  }
  const numericalValues = values.map((data) => Number.parseFloat(data.value));
  let sum = 0;
  let count = 0;
  for (const value of numericalValues) {
    sum += value;
    count += 1;
  }
  return sum / count;
}

function computeMax(values: PrometheusSample[]): number {
  if (!values || values.length === 0) {
    return 0;
  }
  const numericalValues = values.map((data) => Number.parseFloat(data.value));
  return Math.max(...numericalValues);
}

export default async function myFunction(
  dryRunIds: string[],
  containerName: string,
  argoClient: ArgoWorkflowClient): Promise<string | undefined> {
  // dictionary of NodeInfo
  const nodeData: Record<string, NodeInfo> = {};
  for (const dryRunId of dryRunIds) {
    // eslint-disable-next-line no-await-in-loop
    const dryRun = await getDryRun(dryRunId, argoClient);
    const { argoWorkflow } = dryRun as { argoWorkflow?: ArgoWorkflow };
    if (!argoWorkflow?.status?.nodes) {
      return undefined;
    }
    const nodes = Object.values(argoWorkflow.status.nodes)
      .map((node) => convertArgoWorkflowNode(node, argoWorkflow))
      .filter((node) => node.type === 'Pod');
    for (const dryRunNode of nodes) {
      let cpu = 0;
      let mem = 0;
      let fileSize = 0;
      let {duration, inputArtifacts} = dryRunNode;
      // eslint-disable-next-line no-await-in-loop
      const cpuSystemSecondsTotal = await queryPrometheusResolver('simpipe_cpu_system_seconds_total', containerName, { dryRunNode }, {});
      // eslint-disable-next-line no-await-in-loop
      const memoryUsageBytes = await queryPrometheusResolver('simpipe_memory_usage_bytes', containerName, { dryRunNode }, {});
      if (cpuSystemSecondsTotal && cpuSystemSecondsTotal.length > 0) {
        cpu = computeMax(cpuSystemSecondsTotal);
        if (duration === undefined) {
          duration = computeDuration(cpuSystemSecondsTotal);
        }
      }
      if (memoryUsageBytes && memoryUsageBytes.length > 0) {
        mem = computeAverage(memoryUsageBytes);
      }
      if (inputArtifacts) {
        for (const artifact of inputArtifacts) {
          // eslint-disable-next-line no-await-in-loop
          const objectSize = await getObjectSize(artifact.key, artifact.bucketName);
          if (objectSize) {
            fileSize += objectSize;
          }
        }
      } else {
        fileSize = 0;
      }
      console.log(dryRunId, dryRunNode.id, dryRunNode.displayName, cpu, mem, fileSize);
    }
  }
  return JSON.stringify(nodeData);
}

