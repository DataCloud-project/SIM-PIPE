import { NotFoundError } from '../server/apollo-errors.js';
import type K8sClient from './k8s-client.js';

/// <reference path="../argo/argo-schema.d.ts" />

type ArgoWorkflow = WorkflowsArgoprojIo.WorkflowsJson.Definitions
  .IoArgoprojWorkflowV1alpha1Workflow;

export default async function assignArgoWorkflowToProject(
  dryRunId: string,
  projectId: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<ArgoWorkflow> {
  let body: ArgoWorkflow;
  try {
    const response = await k8sClient.customObjects.patchNamespacedCustomObject(
      'argoproj.io',
      'v1alpha1',
      k8sNamespace,
      'workflows',
      dryRunId,
      [{
        op: 'replace',
        path: '/metadata/labels/simpipe.sct.sintef.no~1project',
        value: projectId,
      }],
      undefined,
      undefined,
      undefined,
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      },
    );
    body = response.body as ArgoWorkflow;
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 404) {
      throw new NotFoundError('Workflow not found');
    }
    throw error;
  }
  return body;
}
