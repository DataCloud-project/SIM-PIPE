/* eslint-disable unicorn/consistent-destructuring */
import type { DryRunNode, PrometheusSample } from 'server/schema.js';

import { convertArgoWorkflowNode, getDryRun } from '../argo/dry-runs.js';
import { getObjectSize } from '../minio/minio.js';
import queryPrometheusResolver from '../prometheus/query-prometheus-resolver.js';
import curveFitting from './curve-fitting.js';
import type { ArgoWorkflow } from '../argo/argo-client.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
// import type { DryRunNodeMetrics, DryRunNodePod } from '../server/schema.js';

/* interface DryRunNodeMetrics {
  // other properties...
  metrics: MetricsType; // replace MetricsType with the actual type
} */

interface NodeData {
  nodeName: string;
  data: {
    cpu: [number];
    mem: [number];
    fileSize: [number];
    duration: [number];
    nodeId: [string];
  }
}

type NodesDataMap = Map<string, NodeData>;

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

function computeMedian(values: PrometheusSample[]): number {
  if (!values || values.length === 0) {
    return 0;
  }
  const numericalValues = values.map((data) => Number.parseFloat(data.value));
  numericalValues.sort((a, b) => a - b);
  const half = Math.floor(numericalValues.length / 2);
  if (numericalValues.length % 2) {
    return numericalValues[half];
  }
  return (numericalValues[half - 1] + numericalValues[half]) / 2;
}

function computeMax(values: PrometheusSample[]): number {
  if (!values || values.length === 0) {
    return 0;
  }
  const numericalValues = values.map((data) => Number.parseFloat(data.value));
  return Math.max(...numericalValues);
}

function cumulativeToCurrent(
  inputData: PrometheusSample[]): PrometheusSample[] {
  let previousValue = 0;
  const current: { timestamp: number; value: string }[] = [];
  for (const entry of inputData) {
    const entryValue = Number.parseFloat(entry.value);
    const updatedValue = entryValue - previousValue;
    if (updatedValue) {
      previousValue = entryValue;
      current.push({ timestamp: entry.timestamp, value: updatedValue.toString() });
    }
  }
  return current;
}

export default async function consolidateData(
  dryRunIds: string[],
  containerName: string,
  argoClient: ArgoWorkflowClient,
  aggregateFunctionType: string): Promise<NodesDataMap> {
  // dictionary of NodeInfo
  const nodesData: NodesDataMap = new Map<string, NodeData>();
  let aggregateFunction;
  switch (aggregateFunctionType) {
    case 'average': {
      aggregateFunction = computeAverage;
      break;
    }
    case 'median': {
      aggregateFunction = computeMedian;
      break;
    }
    case 'max': {
      aggregateFunction = computeMax;
      break;
    }
    default: {
      throw new Error(`Invalid aggregate function type: ${aggregateFunctionType}. Must be one of 'average', 'median', 'max'`);
    }
  }
  for (const dryRunId of dryRunIds) {
    // eslint-disable-next-line no-await-in-loop
    const dryRun = await getDryRun(dryRunId, argoClient);
    const { argoWorkflow } = dryRun as { argoWorkflow?: ArgoWorkflow };
    if (!argoWorkflow?.status?.nodes) {
      throw new Error(`Argo workflow ${dryRunId} has no nodes`);
    }
    const nodes = Object.values(argoWorkflow.status.nodes)
      .map((node) => convertArgoWorkflowNode(node, argoWorkflow))
      .filter((node) => node.type === 'Pod');
    for (const dryRunNode of nodes) {
      let cpu = 0;
      let mem = 0;
      let fileSize = 0;
      let { duration } = dryRunNode;
      const { inputArtifacts } = dryRunNode;
      // eslint-disable-next-line no-await-in-loop
      const cpuSystemSecondsTotal = await queryPrometheusResolver('simpipe_cpu_system_seconds_total', containerName, { dryRunNode }, {});
      // eslint-disable-next-line no-await-in-loop
      const memoryUsageBytes = await queryPrometheusResolver('simpipe_memory_usage_bytes', containerName, { dryRunNode }, {});
      if (cpuSystemSecondsTotal && cpuSystemSecondsTotal.length > 0) {
        cpu = aggregateFunction(cumulativeToCurrent(cpuSystemSecondsTotal));
      }
      if (memoryUsageBytes && memoryUsageBytes.length > 0) {
        mem = aggregateFunction(memoryUsageBytes);
      }
      duration = duration || 0;

      if (inputArtifacts) {
        for (const artifact of inputArtifacts) {
          if (artifact.key === undefined) {
            throw new Error('artifact.key is undefined');
          }
          // eslint-disable-next-line no-await-in-loop
          const objectSize = await getObjectSize(
            artifact.key as string, artifact.bucketName as string);
          if (objectSize) {
            fileSize += objectSize;
          }
        }
      } else {
        fileSize = 0;
      }
      if (dryRunNode.displayName === undefined) {
        throw new Error('displayName is undefined');
      }
      if (nodesData.has(dryRunNode.displayName as string)) {
        const nodeData = nodesData.get(dryRunNode.displayName as string);
        if (nodeData) {
          nodeData.data.cpu.push(cpu);
          nodeData.data.mem.push(mem);
          nodeData.data.fileSize.push(fileSize);
          nodeData.data.duration.push(duration);
          nodeData.data.nodeId.push(dryRunNode.id);
        }
      } else {
        nodesData.set(dryRunNode.displayName as string, {
          nodeName: dryRunNode.displayName as string,
          data: {
            cpu: [cpu],
            mem: [mem],
            fileSize: [fileSize],
            duration: [duration],
            nodeId: [dryRunNode.id],
          },
        });
      }
    }
  }
  return nodesData;
}

interface scalingLaws {
  cpu: {
    coeffs: number[],
    type: string,
    r2: number
  },
  mem: {
    coeffs: number[],
    type: string,
    r2: number
  },
  duration: {
    coeffs: number[],
    type: string,
    r2: number
  }
}

interface nodesScalingLaws {
  nodeName: string,
  scalingLaws: scalingLaws
}

export async function computeScalingLaw(nodesData: NodesDataMap, data_y: number[]) {
  // compute scaling laws for each node.
  let nodesScalingLaws: nodesScalingLaws[] = [];
  console.log('computeScalingLaw');
  for (const [nodeName, nodeData] of Object.entries(nodesData)) {
    console.log(nodeName, nodeData)
    if (nodeData.data.nodeId.length === 0) {
      throw new Error('No data points for node' + node.nodeName);
    }
    if (node.data.cpu.length === data_y.length) {
      throw new Error('data_y and node data need to be same lengths. data_y = ' + data_y.length + ' node data = ' + node.data.cpu.length);
    }
    const cpuScalingLaw = curveFitting(node.data.cpu, data_y);
  }
}
