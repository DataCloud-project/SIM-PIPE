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

  static buildK8sSelector(
    selector: { [key: string]: string } | undefined,
  ): string | undefined {
    if (selector === undefined) {
      return undefined;
    }
    // Format is key=value,key=value…
    // key and value cannot contain '=' or ','
    return Object.entries(selector)
      .map(([key, value]) => {
        if (key.includes(',') || key.includes('=')) {
          throw new Error(`Invalid key: ${key}`);
        }
        if (value.includes(',') || value.includes('=')) {
          throw new Error(`Invalid value: ${value}`);
        }
        return `${key}=${value}`;
      })
      .join(',');
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

  async listWorkflows(
    labelSelector?: { [key: string]: string },
  ): Promise<ArgoWorkflow[]> {
    const response = await this.client.get<ArgoApiListAnswer<ArgoWorkflow>>(
      `api/v1/workflows/${encodeURIComponent(this.namespace)}`,
      {
        searchParams: {
          'listOptions.labelSelector':
            ArgoWorkflowClient.buildK8sSelector(labelSelector),
        },
      },
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

  workflowUrl(name: string, prepend?: string): string {
    return `api/v1/workflows/${encodeURIComponent(this.namespace)}/${encodeURIComponent(name)}${prepend ? `/${prepend}` : ''}`;
  }

  async deleteWorkflow(name: string): Promise<void> {
    await this.client.delete(this.workflowUrl(name));
  }

  protected async putWorkflow(name: string, action: string, body?: unknown): Promise<ArgoWorkflow> {
    const response = await this.client.put<ArgoWorkflow>(
      this.workflowUrl(name, action),
      {
        json: body,
      });
    return response.body;
  }

  async suspendWorkflow(name: string): Promise<ArgoWorkflow> {
    return await this.putWorkflow(name, 'suspend');
  }

  async resumeWorkflow(name: string): Promise<ArgoWorkflow> {
    return await this.putWorkflow(name, 'resume');
  }

  async retryWorkflow(name: string): Promise<ArgoWorkflow> {
    return await this.putWorkflow(name, 'retry');
  }

  async resubmitWorkflow(name: string): Promise<ArgoWorkflow> {
    return await this.putWorkflow(name, 'resubmit');
  }

  async terminateWorkflow(name: string): Promise<ArgoWorkflow> {
    // terminate doesn't execute the exit handlers
    return await this.putWorkflow(name, 'terminate');
  }

  async stopWorkflow(name: string): Promise<ArgoWorkflow> {
    // stop will execute the exit handlers
    return await this.putWorkflow(name, 'stop');
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

export type ArgoClientActionNames = 'suspend' | 'resume' | 'retry' | 'resubmit' | 'terminate' | 'stop';
