import slugify from 'slugify';
import type { V1ListMeta, V1ObjectMeta } from '@kubernetes/client-node';

import createKubeNode, { deleteKubeNode } from '../argo/test-emulation.js';
import { ConflictError, InputValidationError, NotFoundError } from '../server/apollo-errors.js';
import { SIMPIPE_USER_LABEL } from './label.js';
import { assertIsValidKubernetesLabel } from './valid-kubernetes-label.js';
import type { CreateResourceInput, Resource } from '../server/schema.js';
import type K8sClient from './k8s-client.js';


interface K8SVMNode {
  apiVersion: 'simpipe.sct.sintef.no/v1';
  kind: 'VMNode';
  metadata: V1ObjectMeta;
  spec: {
    name: string;
    os: string;
    cpus: string;
    memory: string;
    status: string;
    labels?: Record<string, string>;
  };
}

interface K8SVMNodeList {
  apiVersion: 'simpipe.sct.sintef.no/v1';
  kind: 'VMNodeList';
  metadata: V1ListMeta;
  items: K8SVMNode[];
}

// Convert Kubernetes Resource to GraphQL Resource
function convertK8SVMNodeToResource(k8sVMNode: K8SVMNode): Resource {
  const { metadata, spec } = k8sVMNode;
  return {
    id: metadata.name ?? '',
    name: spec.name,
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
  'vmnodes',   // <- changed
  undefined,
  undefined,
  undefined,
  undefined,
  labelSelector,
  );
  const { body } = response as { body: K8SVMNodeList };
  return body.items.map((vmnode) => convertK8SVMNodeToResource(vmnode));
}

// Get a specific resource by ID
export async function getResource(
  id: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
  user?: string,
): Promise<Resource> {
  let body: K8SVMNode;
;
  try {
    const response = await k8sClient.customObjects.getNamespacedCustomObject(
    'simpipe.sct.sintef.no',
    'v1',
    k8sNamespace,
    'vmnodes',   // <- changed
    id,
  );
  body = response.body as K8SVMNode;

  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } }).response?.statusCode === 404) {
      throw new NotFoundError(`Resource not found: ${id}`);
    }
    throw error;
  }
  if (user && body.metadata.labels?.[SIMPIPE_USER_LABEL] !== user) {
    throw new NotFoundError(`Resource not found: ${id}`);
  }
  return convertK8SVMNodeToResource(body);
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
    console.log('calling create kube node in create resource')
    await createKubeNode(slugName, memory, cpus, '600', os);
  } catch (error) {
    throw new Error(`Failed to create k3s node: ${(error as Error).message}`);
  }
  
  // Step 2: Persist as a CRD VMNode
let createdVMNode: K8SVMNode;
try {
  const response = await k8sClient.customObjects.createNamespacedCustomObject(
    'simpipe.sct.sintef.no', // same group
    'v1',                     // version
    k8sNamespace,
    'vmnodes',                // <- changed from 'resources' to 'vmnodes'
    {
      apiVersion: 'simpipe.sct.sintef.no/v1',
      kind: 'VMNode',         // <- changed from 'Resource' to 'VMNode'
      metadata: {
        name: slugName,
        labels,
      },
      spec: {
        name,                 // <- changed from 'resourceName' to 'name'
        os,
        cpus,
        memory,
        status: 'Provisioning',     // <- new field for VM status
      },
    },
  );

  createdVMNode = response.body as K8SVMNode;

} catch (error) {
  if ((error as Error & { response?: { statusCode: number } }).response?.statusCode === 409) {
    throw new ConflictError(`VMNode already exists with same id: ${slugName}`); // updated message
  }
  throw new Error(`Failed to create VMNode: ${(error as Error).message}`);       // updated message
}

  return convertK8SVMNodeToResource(createdVMNode);
}

// Rename an existing resource
export async function renameResource(
  id: string,
  name: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<Resource> {
  let body: K8SVMNode;
  try {
    const response = await k8sClient.customObjects.patchNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'vmnodes',
      id,
      [{
        op: 'replace',
        path: '/spec/name',
        value: name,
      }],
      undefined,
      undefined,
      undefined,
      {
        headers: { 'Content-Type': 'application/json-patch+json' },
      },
    );
    body = response.body as K8SVMNode;
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } }).response?.statusCode === 404) {
      throw new NotFoundError(`VMNode not found: ${id}`);
    }
    throw error;
  }
  return convertK8SVMNodeToResource(body);
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
      'vmnodes',
      id,
    );
    await deleteKubeNode(id);
    return true;
  } catch (error) {
    if ((error as Error & { response?: { statusCode: number } }).response?.statusCode === 404) {
      throw new NotFoundError(`VMNode not found: ${id}`);
    }
    throw error;
  }
}
