import got from 'got';
import type { Got } from 'got';
/// <reference path="./argo-schema.d.ts" />

export type ArgoTemplate = WorkflowsArgoprojIo.WorkflowsJson.Definitions
  .IoArgoprojWorkflowV1alpha1Template;

export type ArgoWorkflow = WorkflowsArgoprojIo.WorkflowsJson.Definitions
  .IoArgoprojWorkflowV1alpha1Workflow;

interface ArgoApiAnswer<T> {
  items: T[] | null;
  metadata: {
    resourceVersion: string;
  };
}

export default class ArgoWorkflowClient {
  private client: Got;

  constructor(apiUrl: string, private namespace: string = 'default') {
    this.client = got.extend({
      prefixUrl: apiUrl,
      responseType: 'json',
    });
  }

  async listTemplates(): Promise<ArgoTemplate[]> {
    const response = await this.client.get<ArgoApiAnswer<ArgoTemplate>>(
      `api/v1/workflow-templates/${encodeURIComponent(this.namespace)}`,
    );
    return response.body.items ?? [];
  }

  async listWorkflows(): Promise<ArgoWorkflow[]> {
    const response = await this.client.get<ArgoApiAnswer<ArgoWorkflow>>(
      `api/v1/workflows/${encodeURIComponent(this.namespace)}`,
    );
    return response.body.items ?? [];
  }

  async getWorkflow(name: string): Promise<any> {
    const response = await this.client.get(`api/v1/workflows/${encodeURIComponent(this.namespace)}/${encodeURIComponent(name)}`);
    return response.body;
  }

  async createWorkflow(workflowDefinition: object): Promise<any> {
    const response = await this.client.post(`api/v1/workflows/${encodeURIComponent(this.namespace)}`, {
      json: workflowDefinition,
    });
    return response.body;
  }

  async deleteWorkflow(name: string): Promise<any> {
    const response = await this.client.delete(`api/v1/workflows/${encodeURIComponent(this.namespace)}/${encodeURIComponent(name)}`);
    return response.body;
  }

  async getWorkflowLogs(name: string): Promise<any> {
    const response = await this.client.get(`api/v1/workflows/${encodeURIComponent(this.namespace)}/${encodeURIComponent(name)}/log`);
    return response.body;
  }
}
