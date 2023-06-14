import slugify from 'slugify';
import type { V1ListMeta, V1ObjectMeta } from '@kubernetes/client-node';

import { ConflictError, InputValidationError, NotFoundError } from '../server/apollo-errors.js';
import type { CreateProjectInput, Mutation } from '../server/schema.js';
import type K8sClient from './k8s-client.js';

export interface Project {
  name: string
  id: string
  createdAt: string
}

/**
 * We use the custom resource definition
 * projects.simpipe.sct.sintef.no
 */

interface K8SProject {
  apiVersion: 'simpipe.sct.sintef.no/v1'
  kind: 'Project'
  metadata: V1ObjectMeta
  spec: {
    projectName: string
  }
}

interface K8SProjectList {
  apiVersion: 'simpipe.sct.sintef.no/v1'
  kind: 'ProjectList'
  metadata: V1ListMeta
  items: K8SProject[]
}

function convertK8SProjectToProject(k8sProject: K8SProject): Project {
  const { metadata, spec } = k8sProject;
  return {
    id: metadata.name ?? '',
    name: spec.projectName,
    createdAt: (new Date(metadata.creationTimestamp ?? '') ?? new Date()).toISOString(),
  };
}

export async function projects(
  k8sClient: K8sClient, k8sNamespace = 'default',
): Promise<Project[]> {
  // load the list of projects (projects.simpipe.sct.sintef.no)
  const response = await k8sClient.customObjects.listNamespacedCustomObject(
    'simpipe.sct.sintef.no', 'v1', k8sNamespace, 'projects',
  );
  const { body } = response as { body: K8SProjectList };
  return body.items.map((project) => convertK8SProjectToProject(project));
}

export async function getProject(
  id: string, k8sClient: K8sClient, k8sNamespace = 'default',
): Promise<Project> {
  let body: K8SProject;
  try {
    const response = await k8sClient.customObjects.getNamespacedCustomObject(
      'simpipe.sct.sintef.no', 'v1', k8sNamespace, 'projects', id,
    );
    body = response.body as K8SProject;
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 404) {
      throw new NotFoundError(`Project not found: ${id}`);
    }
    throw error;
  }
  return convertK8SProjectToProject(body);
}

export async function createProject(
  createProjectInput: CreateProjectInput,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<Mutation['createProject']> {
  const { name, id } = createProjectInput;

  if (id) {
    // If id is longer than the max length of kubernetes names
    if (id.length > 63) {
      throw new InputValidationError(`Project id is too long: ${id}`);
    }
    // If id contains invalid characters
    if (!/^[\da-z]([\da-z-]*[\da-z])?$/.test(id)) {
      throw new InputValidationError(`Project id contains invalid characters: ${id}`);
    }
  }

  const slugName = id ?? slugify.default(name, { lower: true }).slice(0, 63);

  let createdProject: K8SProject;
  // create the project (projects.simpipe.sct.sintef.no)
  try {
    const response = await k8sClient.customObjects.createNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'projects',
      {
        apiVersion: 'simpipe.sct.sintef.no/v1',
        kind: 'Project',
        metadata: {
          name: slugName,
        },
        spec: {
          projectName: name,
        },
      },
    );
    createdProject = response.body as K8SProject;
  } catch (error) {
    // If HTTP 409 Conflict, the project already exists
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 409) {
      throw new ConflictError(`Project already exists with same id: ${slugName}`);
    }
    throw error;
  }

  return convertK8SProjectToProject(createdProject);
}

export async function renameProject(
  id: string,
  name: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<Mutation['renameProject']> {
  let body: K8SProject;
  try {
    const response = await k8sClient.customObjects.patchNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'projects',
      id,
      [{
        op: 'replace',
        path: '/spec/projectName',
        value: name,
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
    body = response.body as K8SProject;
  } catch (error) {
    // If 404, return false, otherwise throws
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 404) {
      throw new NotFoundError('Project not found');
    }
    throw error;
  }
  return convertK8SProjectToProject(body);
}

export async function deleteProject(
  id: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<Mutation['deleteProject']> {
  try {
    // delete the project (projects.simpipe.sct.sintef.no)
    await k8sClient.customObjects.deleteNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'projects',
      id,
    );
    return true;
  } catch (error) {
    // If 404, return false, otherwise throws
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 404) {
      throw new NotFoundError('Project not found');
    }
    throw error;
  }
}
