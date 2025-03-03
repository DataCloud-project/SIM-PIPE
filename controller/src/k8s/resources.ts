import slugify from 'slugify';
import type { V1ListMeta, V1ObjectMeta } from '@kubernetes/client-node';

import createKubeNode, { deleteKubeNode } from '../argo/test-emulation.js';
import { ConflictError, InputValidationError, NotFoundError } from '../server/apollo-errors.js';
import { SIMPIPE_USER_LABEL } from './label.js';
import { assertIsValidKubernetesLabel } from './valid-kubernetes-label.js';
import type { CreateResourceInput, Resource } from '../server/schema.js';
import type K8sClient from './k8s-client.js';

// Define the Resource CR structure
interface K8SResource {
  apiVersion: 'simpipe.sct.sintef.no/v1';
  kind: 'Resource';
  metadata: V1ObjectMeta;
  spec: {
    resourceName: string;
    os: string;
    cpus: string;
    memory: string;
  };
}

interface K8SResourceList {
  apiVersion: 'simpipe.sct.sintef.no/v1';
  kind: 'ResourceList';
  metadata: V1ListMeta;
  items: K8SResource[];
}

// Convert Kubernetes Resource to GraphQL Resource
function convertK8SResourceToResource(k8sResource: K8SResource): Resource {
  const { metadata, spec } = k8sResource;
  return {
    id: metadata.name ?? '',
    name: spec.resourceName,
    os: spec.os,
    cpus: spec.cpus,
    memory: spec.memory,
  };
}

// List all resources
export async function resources(
  k8sClient: K8sClient,
  k8sNamespace = 'default',
  user?: string,
): Promise<Resource[]> {
  let labelSelector: string | undefined;
  if (user) {
    assertIsValidKubernetesLabel(user);
    labelSelector = `${SIMPIPE_USER_LABEL}=${user}`;
  }
  const response = await k8sClient.customObjects.listNamespacedCustomObject(
    'simpipe.sct.sintef.no',
    'v1',
    k8sNamespace,
    'resources',
    undefined,
    undefined,
    undefined,
    undefined,
    labelSelector,
  );
  const { body } = response as { body: K8SResourceList };
  return body.items.map((resource) => convertK8SResourceToResource(resource));
}

// Get a specific resource by ID
export async function getResource(
  id: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
  user?: string,
): Promise<Resource> {
  let body: K8SResource;
  try {
    const response = await k8sClient.customObjects.getNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'resources',
      id,
    );
    body = response.body as K8SResource;
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } }).response?.statusCode === 404) {
      throw new NotFoundError(`Resource not found: ${id}`);
    }
    throw error;
  }
  if (user && body.metadata.labels?.[SIMPIPE_USER_LABEL] !== user) {
    throw new NotFoundError(`Resource not found: ${id}`);
  }
  return convertK8SResourceToResource(body);
}

// Create a new resource
export async function createResource(
  createResourceInput: CreateResourceInput,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
  user?: string,
): Promise<Resource> {
  const {
    name, os, cpus, memory,
  } = createResourceInput;

  const slugName = slugify.default(name, { lower: true }).slice(0, 63);

  if (!/^[\da-z]([\da-z-]*[\da-z])?$/.test(slugName)) {
    throw new InputValidationError(`Resource name contains invalid characters: ${slugName}`);
  }

  let labels: Record<string, string> | undefined;
  if (user) {
    assertIsValidKubernetesLabel(user);
    labels = { [SIMPIPE_USER_LABEL]: user };
  }

  // Step 1: Create the k3s node
  try {
    await createKubeNode(slugName, memory, cpus, '600', os);
  } catch (error) {
    throw new Error(`Failed to create k3s node: ${(error as Error).message}`);
  }
  
  // Step 2: Persist as a CR
  let createdResource: K8SResource;
  try {
    const response = await k8sClient.customObjects.createNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'resources',
      {
        apiVersion: 'simpipe.sct.sintef.no/v1',
        kind: 'Resource',
        metadata: {
          name: slugName,
          labels,
        },
        spec: {
          resourceName: name,
          os,
          cpus,
          memory,
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createdResource = response.body as K8SResource;
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } }).response?.statusCode === 409) {
      throw new ConflictError(`Resource already exists with same id: ${slugName}`);
    }
    throw new Error(`Failed to create k3s node: ${(error as Error).message}`);
  }

  return convertK8SResourceToResource(createdResource);
}

// Rename an existing resource
export async function renameResource(
  id: string,
  name: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<Resource> {
  let body: K8SResource;
  try {
    const response = await k8sClient.customObjects.patchNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'resources',
      id,
      [{
        op: 'replace',
        path: '/spec/resourceName',
        value: name,
      }],
      undefined,
      undefined,
      undefined,
      {
        headers: { 'Content-Type': 'application/json-patch+json' },
      },
    );
    body = response.body as K8SResource;
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } }).response?.statusCode === 404) {
      throw new NotFoundError(`Resource not found: ${id}`);
    }
    throw error;
  }
  return convertK8SResourceToResource(body);
}

// Delete a resource
export async function deleteResource(
  id: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<boolean> {
  try {
    await k8sClient.customObjects.deleteNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'resources',
      id,
    );
    await deleteKubeNode(id);
    return true;
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } }).response?.statusCode === 404) {
      throw new NotFoundError(`Resource not found: ${id}`);
    }
    throw error;
  }
}
