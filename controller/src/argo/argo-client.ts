import got from 'got';
import type { Got } from 'got';
/// <reference path="./argo-schema.d.ts" />

export type ArgoTemplate = WorkflowsArgoprojIo.WorkflowsJson.Definitions
  .IoArgoprojWorkflowV1alpha1Template;

export type ArgoWorkflow = WorkflowsArgoprojIo.WorkflowsJson.Definitions
  .IoArgoprojWorkflowV1alpha1Workflow;

interface ArgoApiListAnswer<T> {
  items: T[] | null;
  metadata: {
    resourceVersion: string;
  };
}

interface ArgoWorkflowCreateRequest {
  serverDryRun?: boolean;
  workflow: ArgoWorkflow;
}

export default class ArgoWorkflowClient {
  private client: Got;

  constructor(apiUrl: string, private namespace: string = 'default') {
    this.client = got.extend({
      prefixUrl: apiUrl,
      responseType: 'json',
    });
  }

  async ping(): Promise<void> {
    await this.client.get('api/v1/version');
  }

  async listTemplates(): Promise<ArgoTemplate[]> {
    const response = await this.client.get<ArgoApiListAnswer<ArgoTemplate>>(
      `api/v1/workflow-templates/${encodeURIComponent(this.namespace)}`,
    );
    return response.body.items ?? [];
  }

  async listWorkflows(): Promise<ArgoWorkflow[]> {
    const response = await this.client.get<ArgoApiListAnswer<ArgoWorkflow>>(
      `api/v1/workflows/${encodeURIComponent(this.namespace)}`,
    );
    return response.body.items ?? [];
  }

  async getWorkflow(name: string): Promise<ArgoWorkflow> {
    const response = await this.client.get<ArgoWorkflow>(
      `api/v1/workflows/${encodeURIComponent(this.namespace)}/${encodeURIComponent(name)}`,
    );
    return response.body;
  }

  async createWorkflow(workflowDefinition: ArgoWorkflowCreateRequest): Promise<ArgoWorkflow> {
    const response = await this.client.post<ArgoWorkflow>(
      `api/v1/workflows/${encodeURIComponent(this.namespace)}`,
      {
        json: workflowDefinition,
      });
    return response.body;
  }

  async deleteWorkflow(name: string): Promise<void> {
    await this.client.delete(
      `api/v1/workflows/${encodeURIComponent(this.namespace)}/${encodeURIComponent(name)}`,
    );
  }

  // This is not working because it returns an event stream only.
  // Also it needs the pod to not be deleted.
  // It may be better to get the logs from the artifact.
  async getWorkflowLogs(name: string, podName?: string): Promise<string> {
    interface ArgoLogEntry {
      content: string;
      podName: string;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stream = await this.client.get<ArgoLogEntry>(
      `api/v1/workflows/${encodeURIComponent(this.namespace)}/${encodeURIComponent(name)}/log`,
      {
        searchParams: {
          podName,
          'logOptions.previous': 'true',
        },
      },
    );

    throw new Error('Not implemented');
  }
}
