import slugify from 'slugify';
import type { CreateProjectInput } from 'server/schema.js';

import type K8sClient from './k8s-client.js';

export interface Project {
  name: string
  id: string
  createdAt: string
  updatedAt: string
}

/** We use the custom resource definition
 * projects.simpipe.sct.sintef.no
 */

export async function projects(
  k8sClient: K8sClient, k8sNamespace = 'default',
): Promise<Project> {
  // load the list of projects (projects.simpipe.sct.sintef.no)
  const response = await k8sClient.customObjects.listNamespacedCustomObject(
    'simpipe.sct.sintef.no', 'v1', k8sNamespace, 'projects',
  );
  const { body } = response;
  return body.map((project: Project) => ({
    name: project.metadata?.name ?? '',
    createdAt: project.metadata?.creationTimestamp ?? '',
    updatedAt: project.metadata?.creationTimestamp ?? '',
  }));
}

export async function createProject(
  createProjectInput: CreateProjectInput,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<Project> {
  const { name, id } = createProjectInput;

  const slugName = id ?? slugify.default(name, { lower: true });
  // create the project (projects.simpipe.sct.sintef.no)
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

  const createdProject = response.body;
  return {
    name: createdProject.spec?.projectName ?? '',
    id: createdProject.metadata?.name ?? '',
    createdAt: createdProject.metadata?.creationTimestamp ?? '',
    updatedAt: createdProject.metadata?.creationTimestamp ?? '',
  };
}
