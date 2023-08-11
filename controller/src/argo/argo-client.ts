import got from 'got';
import { createInterface } from 'node:readline';
import type { Got } from 'got';
/// <reference path="./argo-schema.d.ts" />

export type ArgoWorkflowTemplate = WorkflowsArgoprojIo.WorkflowsJson.Definitions
  .IoArgoprojWorkflowV1alpha1WorkflowTemplate;

export type ArgoWorkflow = WorkflowsArgoprojIo.WorkflowsJson.Definitions
  .IoArgoprojWorkflowV1alpha1Workflow;

export type ArgoNode = WorkflowsArgoprojIo.WorkflowsJson.Definitions
  .IoArgoprojWorkflowV1alpha1NodeStatus;

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

  async listWorkflowTemplates(
    labelSelector?: { [key: string]: string },
  ): Promise<ArgoWorkflowTemplate[]> {
    const response = await this.client.get<ArgoApiListAnswer<ArgoWorkflowTemplate>>(
      `api/v1/workflow-templates/${encodeURIComponent(this.namespace)}`,
      {
        searchParams: {
          'listOptions.labelSelector':
            ArgoWorkflowClient.buildK8sSelector(labelSelector),
        },
      },
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

  workflowUrl(name: string, prepend?: string): string {
    return `api/v1/workflows/${encodeURIComponent(this.namespace)}/${encodeURIComponent(name)}${prepend ? `/${prepend}` : ''}`;
  }

  async getWorkflow(name: string): Promise<ArgoWorkflow> {
    const response = await this.client.get<ArgoWorkflow>(
      this.workflowUrl(name),
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

  static isWorkflowNodePendingOrRunning(workflow: ArgoWorkflow, nodeId: string): boolean {
    const node = workflow.status?.nodes?.[nodeId];
    if (!node) {
      return !workflow.status || workflow.status.phase === 'Pending' || workflow.status.phase === 'Running';
    }
    return node.phase === 'Pending' || node.phase === 'Running';
  }

  static nodeHasArtifactsLogs(workflow: ArgoWorkflow, nodeId: string, container = 'main'): boolean {
    const logName = `${container}-logs`;
    return workflow.status?.nodes?.[nodeId]?.outputs?.artifacts?.some(
      ({ name }) => name === logName,
    ) ?? false;
  }

  async getWorkflowLogFromArtifact({
    workflow,
    nodeId,
    container = 'main',
    grep,
    tailLines = 1000,
  }: {
    workflow: ArgoWorkflow;
    nodeId: string;
    container: string;
    grep?: string;
    tailLines?: number;
  }): Promise<string[]> {
    const { name } = workflow.metadata;
    if (!name) {
      throw new Error('Workflow name is missing');
    }
    if (!ArgoWorkflowClient.nodeHasArtifactsLogs(workflow, nodeId, container)) {
      throw new Error('No logs found');
    }
    const path = `artifact-files/${encodeURIComponent(this.namespace)}/workflows/${encodeURIComponent(name)}/${encodeURIComponent(nodeId)}/outputs/${container}-logs`;

    const stream = this.client.stream(path);

    const readlineInterface = createInterface({
      input: stream,
      crlfDelay: Number.POSITIVE_INFINITY,
    });

    const entries = [];
    for await (const line of readlineInterface) {
      // We don't use a RegExp to not be vulnerable to DoS attacks
      if (!grep || line.includes(grep)) {
        entries.push(line);
      }
    }

    if (tailLines > 0) {
      return entries.slice(-tailLines);
    }

    return entries;
  }

  async getWorkflowLogFromKubernetes({
    workflowName,
    podName,
    containerName = 'main',
    sinceSeconds,
    sinceTime,
    grep,
    tailLines = 1000,
  }: {
    workflowName: string;
    podName?: string;
    containerName?: string;
    sinceSeconds?: number;
    sinceTime?: number;
    grep?: string;
    tailLines?: number;
  }): Promise<string[]> {
    const stream = this.client.stream(
      `api/v1/workflows/${encodeURIComponent(this.namespace)}/${encodeURIComponent(workflowName)}/log`,
      {
        searchParams: {
          podName,
          grep,
          'logOptions.container': containerName,
          'logOptions.sinceSeconds': sinceSeconds,
          'logOptions.sinceTime': sinceTime,
          'logOptions.tailLines': tailLines,
          'logOptions.limitBytes': '16777216', // 16MB max
          // 'logOptions.previous': 'true',
          // 'logOptions.follow': 'false',
        },
      },
    );

    const readlineInterface = createInterface({
      input: stream,
      crlfDelay: Number.POSITIVE_INFINITY,
    });

    const entries = [];
    for await (const content of readlineInterface) {
      try {
        const jsonEntry = JSON.parse(content) as {
          result: {
            content: string;
            podName: string;
          };
        };
        entries.push(jsonEntry.result.content);
      } catch {
        entries.push(content);
      }
    }

    return entries;
  }

  async getWorkflowLog({
    workflow,
    nodeId,
    podName,
    container = 'main',
    sinceSeconds,
    sinceTime,
    grep,
    tailLines = 1000,
  }: {
    workflow: ArgoWorkflow;
    nodeId: string;
    podName?: string;
    container?: string;
    sinceSeconds?: number;
    sinceTime?: number;
    grep?: string;
    tailLines?: number;
  }): Promise<string[] | undefined> {
    const workflowName = workflow.metadata.name;
    if (ArgoWorkflowClient.isWorkflowNodePendingOrRunning(workflow, nodeId)) {
      if (!workflowName) {
        throw new Error('Workflow name is missing');
      }
      return await this.getWorkflowLogFromKubernetes({
        workflowName,
        podName,
        containerName: container,
        sinceSeconds,
        sinceTime,
        grep,
        tailLines,
      });
    }

    try {
      return await this.getWorkflowLogFromArtifact({
        workflow,
        nodeId,
        container,
        grep,
        tailLines,
      });
    } catch (error) {
      if ((error as Error).message === 'No logs found') {
        if (!workflowName) {
          return undefined;
        }
        return await this.getWorkflowLogFromKubernetes({
          workflowName,
          podName,
          containerName: container,
          sinceSeconds,
          sinceTime,
          grep,
          tailLines,
        });
      }
      throw error;
    }
  }

  async createWorkflowTemplate(
    workflowTemplate: ArgoWorkflowTemplate,
  ): Promise<ArgoWorkflowTemplate> {
    const response = await this.client.post<ArgoWorkflowTemplate>(
      `api/v1/workflow-templates/${encodeURIComponent(this.namespace)}`,
      {
        json: {
          template: workflowTemplate,
        },
      });
    return response.body;
  }

  workflowTemplateUrl(name: string): string {
    return `api/v1/workflow-templates/${encodeURIComponent(this.namespace)}/${encodeURIComponent(name)}`;
  }

  async getWorkflowTemplate(name: string): Promise<ArgoWorkflowTemplate> {
    const response = await this.client.get<ArgoWorkflowTemplate>(
      this.workflowTemplateUrl(name),
    );
    return response.body;
  }

  async updateWorkflowTemplate(
    name: string, workflowTemplate: ArgoWorkflowTemplate,
  ): Promise<ArgoWorkflowTemplate> {
    const response = await this.client.put<ArgoWorkflowTemplate>(
      this.workflowTemplateUrl(name),
      {
        json: {
          template: workflowTemplate,
        },
      });
    return response.body;
  }

  async deleteWorkflowTemplate(name: string): Promise<void> {
    await this.client.delete(this.workflowTemplateUrl(name));
  }
}

export type ArgoClientActionNames = 'suspend' | 'resume' | 'retry' | 'resubmit' | 'terminate' | 'stop';
