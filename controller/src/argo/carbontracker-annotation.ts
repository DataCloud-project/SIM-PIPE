import type K8sClient from '../k8s/k8s-client.js';
import type { ArgoWorkflow } from './argo-client.js';

export const CARBONTRACKER_ANNOTATION = 'simpipe.sct.sintef.no/carbontracker';

export interface NodeCarbontrackerEntry {
  co2eq: number;
  energy: number;
}

export type CarbontrackerAnnotationData = Record<string, NodeCarbontrackerEntry>;

/**
 * Parses the carbontracker annotation from an Argo Workflow's metadata.
 * Returns an empty object if the annotation is absent or malformed.
 */
export function parseCarbontrackerAnnotation(
  argoWorkflow: ArgoWorkflow,
): CarbontrackerAnnotationData {
  const metadata = argoWorkflow.metadata as Record<string, unknown> | undefined;
  const annotations = metadata?.annotations as Record<string, string> | undefined;
  const raw = annotations?.[CARBONTRACKER_ANNOTATION];
  if (!raw) return {};
  try {
    return JSON.parse(raw) as CarbontrackerAnnotationData;
  } catch {
    return {};
  }
}

/**
 * Merges the given node entries into the existing carbontracker annotation
 * and patches the Argo Workflow resource via the Kubernetes API.
 */
export async function storeCarbontrackerAnnotation(
  dryRunId: string,
  entries: { nodeId: string; co2eq: number; energy: number }[],
  argoWorkflow: ArgoWorkflow,
  k8sClient: K8sClient,
  k8sNamespace: string,
): Promise<void> {
  const existing = parseCarbontrackerAnnotation(argoWorkflow);
  for (const { nodeId, co2eq, energy } of entries) {
    existing[nodeId] = { co2eq, energy };
  }
  const annotationValue = JSON.stringify(existing);

  await k8sClient.customObjects.patchNamespacedCustomObject(
    'argoproj.io',
    'v1alpha1',
    k8sNamespace,
    'workflows',
    dryRunId,
    { metadata: { annotations: { [CARBONTRACKER_ANNOTATION]: annotationValue } } },
    undefined,
    undefined,
    undefined,
    {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    },
  );
}
