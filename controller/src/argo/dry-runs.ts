import { NotFoundError } from '../server/apollo-errors.js';
import type K8sClient from '../k8s/k8s-client.js';
import type { DryRun, DryRunPhase } from '../server/schema.js';
import type { ArgoWorkflow } from './argo-client.js';
import type ArgoWorkflowClient from './argo-client.js';

function convertArgoStatusPhaseToDryRunStatusPhase(
  argoStatusPhase: string | undefined,
): DryRunPhase {
  switch (argoStatusPhase) {
    case 'Pending':
    case 'Running':
    case 'Succeeded':
    case 'Failed':
    case 'Error':
    case 'Unknown': {
      return argoStatusPhase as DryRunPhase;
    }
    default: {
      throw new Error(`Unknown Argo status phase: ${argoStatusPhase ?? 'undefined'}`);
    }
  }
}

function convertArgoWorkflowToDryRun(argoWorkflow: ArgoWorkflow): DryRun {
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

export async function dryRunsForProject(
  projectId: string,
  k8sClient: K8sClient,
  k8sNamespace: string,
): Promise<DryRun[]> {
  const dryRuns = await getDryRuns(k8sClient, k8sNamespace);
  return dryRuns.filter((dryRun) => dryRun.metadata.labels?.project === project.id);
}

export async function getDryRun(
  runId: string,
  argoClient: ArgoWorkflowClient,
): Promise<DryRun> {
  let argoWorkflow: ArgoWorkflow;
  try {
    argoWorkflow = await argoClient.getWorkflow(runId);
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 404) {
      throw new NotFoundError(`Dry run ${runId} not found`);
    }
    throw error;
  }
  return convertArgoWorkflowToDryRun(argoWorkflow);
}
