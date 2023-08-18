import { ConflictError, InvalidArgoWorkflowTemplateError, NotFoundError } from '../server/apollo-errors.js';
import { SIMPIPE_PROJECT_LABEL } from './project-label.js';
import type { WorkflowTemplate } from '../server/schema.js';
import type ArgoWorkflowClient from './argo-client.js';
import type { ArgoWorkflowTemplate } from './argo-client.js';

function convertArgoWorkflowTemplate(
  argoWorkflowTemplate: ArgoWorkflowTemplate,
): WorkflowTemplate {
  const { metadata } = argoWorkflowTemplate;
  return {
    name: metadata?.name ?? '',
    argoWorkflowTemplate,
  };
}

export async function createWorkflowTemplate({
  argoWorkflowTemplate: inputArgoWorkflowTemplate,
  projectId,
  name,
  argoClient,
}: {
  argoWorkflowTemplate: ArgoWorkflowTemplate;
  projectId?: string;
  name?: string;
  argoClient: ArgoWorkflowClient;
}): Promise<WorkflowTemplate> {
  const workflowTemplate: ArgoWorkflowTemplate = {
    ...inputArgoWorkflowTemplate,
    metadata: {
      ...inputArgoWorkflowTemplate.metadata,
    },
    apiVersion: 'argoproj.io/v1alpha1',
    kind: 'WorkflowTemplate',
    spec: {
      ...inputArgoWorkflowTemplate.spec,
    },
  };

  if (!workflowTemplate.metadata.labels) {
    workflowTemplate.metadata.labels = {};
  }

  if (projectId) {
    workflowTemplate.metadata.labels[SIMPIPE_PROJECT_LABEL] = projectId;
  }
  if (name) {
    workflowTemplate.metadata.name = name;
  } else if (!workflowTemplate.metadata.name && !workflowTemplate.metadata.generateName) {
    const projectLabelName = workflowTemplate.metadata.labels[SIMPIPE_PROJECT_LABEL];
    workflowTemplate.metadata.generateName = projectLabelName
      ? `${projectLabelName}-` : 'simpipe-unknown-project-';
  }

  let createdWorkflowTemplate: ArgoWorkflowTemplate;
  try {
    createdWorkflowTemplate = await argoClient.createWorkflowTemplate(workflowTemplate);
  } catch (error) {
    const httpStatusCode = (error as Error & { response?: { statusCode: number } })
      .response?.statusCode;
    if (httpStatusCode === 400) {
      const body = (error as Error & { response?: { body: unknown } })
        .response?.body as { message?: string };

      const message = body.message ?? 'Unknown ArgoWorkflowTemplate validation error';

      throw new InvalidArgoWorkflowTemplateError(message);
    }
    if (httpStatusCode === 409) {
      throw new ConflictError('Template already exists with same name');
    }
    throw error;
  }

  return convertArgoWorkflowTemplate(createdWorkflowTemplate);
}

export async function getWorkflowTemplate(
  name: string,
  argoClient: ArgoWorkflowClient,
): Promise<WorkflowTemplate> {
  let argoWorkflowTemplate: ArgoWorkflowTemplate;
  try {
    argoWorkflowTemplate = await argoClient.getWorkflowTemplate(name);
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 404) {
      throw new NotFoundError(`Workflow template ${name} not found`);
    }
    throw error;
  }
  return convertArgoWorkflowTemplate(argoWorkflowTemplate);
}

export async function updateWorkflowTemplate({
  argoWorkflowTemplate: inputArgoWorkflowTemplate,
  projectId,
  name,
  argoClient,
}: {
  argoWorkflowTemplate: ArgoWorkflowTemplate;
  projectId?: string;
  name: string;
  argoClient: ArgoWorkflowClient;
}): Promise<WorkflowTemplate> {
  const workflowTemplate: ArgoWorkflowTemplate = {
    ...inputArgoWorkflowTemplate,
    metadata: {
      ...inputArgoWorkflowTemplate.metadata,
      name,
    },
    apiVersion: 'argoproj.io/v1alpha1',
    kind: 'WorkflowTemplate',
    spec: {
      ...inputArgoWorkflowTemplate.spec,
    },
  };

  if (!workflowTemplate.metadata.labels) {
    workflowTemplate.metadata.labels = {};
  }

  if (projectId) {
    workflowTemplate.metadata.labels[SIMPIPE_PROJECT_LABEL] = projectId;
  }

  let updatedWorkflowTemplate: ArgoWorkflowTemplate;
  try {
    updatedWorkflowTemplate = await argoClient.updateWorkflowTemplate(name, workflowTemplate);
  } catch (error) {
    const httpStatusCode = (error as Error & { response?: { statusCode: number } })
      .response?.statusCode;
    if (httpStatusCode === 400) {
      const body = (error as Error & { response?: { body: unknown } })
        .response?.body as { message?: string };

      const message = body.message ?? 'Unknown ArgoWorkflowTemplate validation error';

      throw new InvalidArgoWorkflowTemplateError(message);
    }
    if (httpStatusCode === 404) {
      throw new NotFoundError(`Workflow template ${name} not found`);
    }
    if (httpStatusCode === 409) {
      throw new ConflictError('Did you put the right resourceVersion in the metadata?');
    }
    throw error;
  }
  return convertArgoWorkflowTemplate(updatedWorkflowTemplate);
}

export async function deleteWorkflowTemplate(
  name: string,
  argoClient: ArgoWorkflowClient,
): Promise<void> {
  try {
    await argoClient.deleteWorkflowTemplate(name);
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 404) {
      throw new NotFoundError(`Workflow template ${name} not found`);
    }
    throw error;
  }
}

export async function workflowTemplatesForProject(
  projectId: string,
  argoClient: ArgoWorkflowClient,
): Promise<WorkflowTemplate[]> {
  const workflowTemplates = await argoClient.listWorkflowTemplates({
    [SIMPIPE_PROJECT_LABEL]: projectId,
  });
  return workflowTemplates.map(
    (argoWorkflowTemplate) => convertArgoWorkflowTemplate(argoWorkflowTemplate));
}
