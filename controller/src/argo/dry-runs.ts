import {
  ConflictError, InvalidArgoWorkflowError, NotFoundError, WrongRequestError,
} from '../server/apollo-errors.js';
import { DryRunNodeType, DryRunPhase } from '../server/schema.js';
import getPodName from './get-pod-name.js';
import { SIMPIPE_PROJECT_LABEL } from './project-label.js';
import type {
  DryRun, DryRunNode, DryRunNodeArtifact, DryRunNodePod,
} from '../server/schema.js';
import type { ArgoClientActionNames, ArgoNode, ArgoWorkflow } from './argo-client.js';
import type ArgoWorkflowClient from './argo-client.js';

function convertArgoStatusPhaseToDryRunStatusPhase(
  argoStatusPhase: string | undefined,
): DryRunPhase {
  switch (argoStatusPhase) {
    case 'Pending':
    case 'Running':
    case 'Succeeded':
    case 'Skipped':
    case 'Failed':
    case 'Error':
    case 'Omitted':
    case 'Unknown': {
      return argoStatusPhase as DryRunPhase;
    }
    case undefined: {
      return DryRunPhase.Unknown;
    }

    default: {
      throw new Error(`Unknown Argo status phase: ${argoStatusPhase}`);
    }
  }
}

function convertArgoNodeType(
  argoNodeType: string,
): DryRunNodeType {
  switch (argoNodeType) {
    case 'Pod':
    case 'Container':
    case 'Steps':
    case 'StepGroup':
    case 'DAG':
    case 'TaskGroup':
    case 'Retry':
    case 'Skipped':
    case 'Suspend':
    case 'HTTP':
    case 'Plugin': {
      return argoNodeType as DryRunNodeType;
    }
    default: {
      throw new Error(`Unknown Argo node type: ${argoNodeType}`);
    }
  }
}

export function convertArgoWorkflowToDryRun(argoWorkflow: ArgoWorkflow): DryRun {
  const { metadata, status } = argoWorkflow;
  return {
    id: metadata.name ?? '',
    createdAt: (new Date(metadata.creationTimestamp ?? '') ?? new Date()).toISOString(),
    argoWorkflow,
    status: {
      phase: convertArgoStatusPhaseToDryRunStatusPhase(status?.phase),
      message: status?.message,
    },
  };
}

function convertNodeDuration(node: ArgoNode): number | undefined {
  if (!node.finishedAt) {
    return node.estimatedDuration;
  }
  if (!node.startedAt) {
    return undefined;
  }
  // return the duration in seconds between startedAt and finishedAt
  return Math.floor((new Date(node.finishedAt).getTime()
    - new Date(node.startedAt).getTime()) / 1000);
}

type InternalExtendedDryRunNode = DryRunNode & Omit<DryRunNodePod, 'podName' | 'metrics' | 'resourcesDuration'> & {
  workflow: ArgoWorkflow;
  podName: string | undefined;
};

export function assertDryRunNodeHasWorkflow(
  node: DryRunNode,
): asserts node is InternalExtendedDryRunNode {
  if (!('workflow' in node)) {
    throw new Error('Node does not have a workflow');
  }
}

export function convertArgoWorkflowNode(node: ArgoNode, argoWorkflow: ArgoWorkflow)
  : InternalExtendedDryRunNode {
  const type = convertArgoNodeType(node.type);

  let podName: string | undefined;
  let inputArtifacts: DryRunNodeArtifact[] | undefined;
  let outputArtifacts: DryRunNodeArtifact[] | undefined;

  if (type === DryRunNodeType.Pod) {
    podName = getPodName(node, argoWorkflow);
    inputArtifacts = node.inputs?.artifacts?.map(({ name, s3 }) => ({
      name,
      key: s3?.key,
    }));
    outputArtifacts = node.outputs?.artifacts?.map(({ name, s3 }) => ({
      name,
      key: s3?.key,
    }));
  }

  return {
    ...node,
    type,
    // Will be handled in the resolvers
    children: node.children?.map((id) => {
      const childNode = argoWorkflow.status?.nodes?.[id];
      if (!childNode) {
        throw new Error(`Child node ${id} not found`);
      }
      return convertArgoWorkflowNode(childNode, argoWorkflow);
    }),
    phase: convertArgoStatusPhaseToDryRunStatusPhase(node.phase),
    exitCode: node.outputs?.exitCode,
    duration: convertNodeDuration(node),
    workflow: argoWorkflow,
    podName,
    inputArtifacts,
    outputArtifacts,
  };
}

export async function dryRunsForProject(
  projectId: string,
  argoClient: ArgoWorkflowClient,
): Promise<DryRun[]> {
  const dryRuns = await argoClient.listWorkflows({
    [SIMPIPE_PROJECT_LABEL]: projectId,
  });
  // return dryRuns.filter((dryRun) => dryRun.metadata.labels?.project === project.id);
  return dryRuns.map((dryRun) => convertArgoWorkflowToDryRun(dryRun));
}

export async function getDryRun(
  dryRunId: string,
  argoClient: ArgoWorkflowClient,
): Promise<DryRun> {
  let argoWorkflow: ArgoWorkflow;
  try {
    argoWorkflow = await argoClient.getWorkflow(dryRunId);
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 404) {
      throw new NotFoundError(`Dry run ${dryRunId} not found`);
    }
    throw error;
  }
  return convertArgoWorkflowToDryRun(argoWorkflow);
}

export async function createDryRun({
  argoWorkflow: inputArgoWorkflow,
  projectId,
  dryRunId,
  argoClient,
}: {
  argoWorkflow: ArgoWorkflow,
  projectId?: string,
  dryRunId?: string,
  argoClient: ArgoWorkflowClient,
}): Promise<DryRun> {
  const argoWorkflow: ArgoWorkflow = {
    ...inputArgoWorkflow,
    metadata: {
      ...inputArgoWorkflow.metadata,
    },
    apiVersion: 'argoproj.io/v1alpha1',
    kind: 'Workflow',
    spec: {
      ...inputArgoWorkflow.spec,
    },
  };

  if (!argoWorkflow.metadata.labels) {
    argoWorkflow.metadata.labels = {};
  }

  if (projectId) {
    argoWorkflow.metadata.labels[SIMPIPE_PROJECT_LABEL] = projectId;
  }
  if (dryRunId) {
    argoWorkflow.metadata.name = dryRunId;
  } else if (!argoWorkflow.metadata.name && !argoWorkflow.metadata.generateName) {
    const projectLabelName = argoWorkflow.metadata.labels[SIMPIPE_PROJECT_LABEL];
    argoWorkflow.metadata.generateName = projectLabelName
      ? `${projectLabelName}-` : 'simpipe-unknown-project-';
  }

  let createdWorkflow: ArgoWorkflow;
  try {
    createdWorkflow = await argoClient.createWorkflow({ workflow: argoWorkflow });
  } catch (error) {
    const httpStatusCode = (error as Error & { response?: { statusCode: number } })
      .response?.statusCode;
    if (httpStatusCode === 400) {
      const body = (error as Error & { response?: { body: unknown } })
        .response?.body as { message?: string };

      const message = body.message ?? 'Unknown ArgoWorkflow validation error';

      throw new InvalidArgoWorkflowError(message);
    }
    if (httpStatusCode === 409) {
      throw new ConflictError('Dry run already exists with same name');
    }
    throw error;
  }

  return convertArgoWorkflowToDryRun(createdWorkflow);
}

function handleArgoException(error: unknown): never {
  const httpCode = (error as Error & { response?: { statusCode: number } })
    .response?.statusCode;
  const message = (error as Error & { response?: { body?: { message?: string } } })
    .response?.body?.message;

  if (httpCode === 404) {
    throw new NotFoundError(message ?? 'Workflow not found');
  }
  if (httpCode === 400) {
    throw new WrongRequestError(message ?? 'Action cannot be performed on workflow');
  }

  throw error;
}

async function executeArgoAction(
  argoClient: ArgoWorkflowClient,
  dryRunId: string,
  action: ArgoClientActionNames,
): Promise<DryRun> {
  // This is magic typescript btw
  const method = argoClient[`${action}Workflow`];
  let argoWorkflow: ArgoWorkflow;
  try {
    argoWorkflow = await method.call(argoClient, dryRunId);
  } catch (error) {
    handleArgoException(error);
  }
  return convertArgoWorkflowToDryRun(argoWorkflow);
}

export async function suspendDryRun(
  dryRunId: string,
  argoClient: ArgoWorkflowClient,
): Promise<DryRun> {
  return await executeArgoAction(argoClient, dryRunId, 'suspend');
}

export async function resumeDryRun(
  dryRunId: string,
  argoClient: ArgoWorkflowClient,
): Promise<DryRun> {
  return await executeArgoAction(argoClient, dryRunId, 'resume');
}

export async function retryDryRun(
  dryRunId: string,
  argoClient: ArgoWorkflowClient,
): Promise<DryRun> {
  return await executeArgoAction(argoClient, dryRunId, 'retry');
}

export async function resubmitDryRun(
  dryRunId: string,
  argoClient: ArgoWorkflowClient,
): Promise<DryRun> {
  return await executeArgoAction(argoClient, dryRunId, 'resubmit');
}

export async function stopDryRun(
  dryRunId: string,
  terminate: boolean,
  argoClient: ArgoWorkflowClient,
): Promise<DryRun> {
  if (terminate) {
    return await executeArgoAction(argoClient, dryRunId, 'terminate');
  }
  return await executeArgoAction(argoClient, dryRunId, 'stop');
}

export async function deleteDryRun(
  dryRunId: string,
  argoClient: ArgoWorkflowClient,
): Promise<void> {
  try {
    await argoClient.deleteWorkflow(dryRunId);
  } catch (error) {
    handleArgoException(error);
  }
}

export async function getDryRunNodeLog({
  dryRunNode,
  workflow,
  maxLines,
  grep,
  sinceSeconds,
  sinceTime,
  argoClient,
}: {
  dryRunNode: DryRunNodePod,
  workflow: ArgoWorkflow,
  maxLines?: number,
  grep?: string,
  sinceSeconds?: number,
  sinceTime?: number,
  argoClient: ArgoWorkflowClient,
}): Promise<string[]> {
  const { podName, id: nodeId } = dryRunNode;
  if (!podName) {
    throw new Error('Pod name is missing');
  }

  const workflowName = workflow.metadata.name;
  if (!workflowName) {
    throw new Error('Workflow name is missing');
  }

  try {
    const entries = await argoClient.getWorkflowLog({
      workflow,
      nodeId,
      podName,
      tailLines: maxLines,
      grep,
      sinceSeconds,
      sinceTime,
    });
    return entries;
  } catch (error) {
    handleArgoException(error);
  }
  throw new Error('Unreachable');
}
