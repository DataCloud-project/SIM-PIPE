import type { NodesAggregatedNodeMetrics, NodesScalingLaws, PrometheusSample } from 'server/schema.js';

import { convertArgoWorkflowNode, getDryRun } from '../argo/dry-runs.js';
import { getObjectSize } from '../minio/minio.js';
import queryPrometheusResolver from '../prometheus/query-prometheus-resolver.js';
import { curveFitting, extrapolate } from './curve-fitting.js';
import type { ArgoWorkflow } from '../argo/argo-client.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';

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

// eslint-disable-next-line import/prefer-default-export
export async function aggregatedNodesMetrics(
  dryRunIds: string[],
  containerName: string,
  argoClient: ArgoWorkflowClient,
  aggregateFunctionType: string): Promise<NodesAggregatedNodeMetrics[]> {
  const nodesData: NodesAggregatedNodeMetrics[] = [];
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
      const { displayName } = dryRunNode;
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
      /* eslint-disable unicorn/consistent-destructuring */
      if (displayName === undefined) {
        throw new Error('displayName is undefined');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (nodesData.some((node) => node.nodeName === displayName)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const nodeData = nodesData.find(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (node: NodesAggregatedNodeMetrics) => node.nodeName === displayName);
        if (nodeData) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          nodeData.data.cpu.push(cpu);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          nodeData.data.mem.push(mem);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          nodeData.data.fileSize.push(fileSize);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          nodeData.data.duration.push(duration);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          nodeData.data.nodeId.push(dryRunNode.id);
        }
      } else {
        const data: NodesAggregatedNodeMetrics = {
          nodeName: dryRunNode.displayName as string,
          data: {
            cpu: [cpu],
            mem: [mem],
            fileSize: [fileSize],
            duration: [duration],
            nodeId: [dryRunNode.id],
          },
        };
        nodesData.push(data);
      }
      /* eslint-enable unicorn/consistent-destructuring */
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return nodesData;
}

export async function computeScalingLaws(
  nodesData: NodesAggregatedNodeMetrics[], data_x: number[], regression_method = 'linear'): Promise<NodesScalingLaws[]> {
  // compute scaling laws for each node.
  const nodesScalingLaws: NodesScalingLaws[] = [];

  if (regression_method !== 'linear' && regression_method !== 'power') {
    throw new Error(`Invalid regression method: ${regression_method}. Must be one of 'linear', 'power'`);
  }
  for (const node of nodesData) {
    nodesScalingLaws.push({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      nodeName: node.nodeName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      cpu: curveFitting(data_x, node.data.cpu, regression_method),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      mem: curveFitting(data_x, node.data.mem, regression_method),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      duration: curveFitting(data_x, node.data.duration, regression_method),
      data: {
        cpu: node.data.cpu,
        mem: node.data.mem,
        fileSize: node.data.fileSize,
        duration: node.data.duration,
        nodeId: node.data.nodeId,
      },
    });
  }
  // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
  return nodesScalingLaws;
}

export async function extrapolateFromScalingLaws(
  nodesScalingLaws: NodesScalingLaws[],
  data_x: number): Promise<{ cpu: number, mem: number, duration: number }> {
  const predictedValues = { cpu: 0, mem: 0, duration: 0 };
  for (const node of nodesScalingLaws) {
    predictedValues.cpu += extrapolate(node.cpu.type, node.cpu.coeffs, data_x);
    predictedValues.mem += extrapolate(node.mem.type, node.mem.coeffs, data_x);
    predictedValues.duration += extrapolate(node.duration.type, node.duration.coeffs, data_x);
  }
  // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
  return predictedValues;
}
