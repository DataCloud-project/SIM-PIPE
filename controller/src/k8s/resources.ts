import slugify from 'slugify';
import type { V1ListMeta, V1ObjectMeta } from '@kubernetes/client-node';

import createKubeNode, { deleteKubeNode } from '../argo/emulation-utils.js';
import { InputValidationError, NotFoundError } from '../server/apollo-errors.js';
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
    status: spec.status,
  };
}

export async function resources(
  k8sClient: K8sClient,
  k8sNamespace = 'default',
  user?: string,
): Promise<Resource[]> {
  let labelSelector: string | undefined;
  if (user) {
    try {
      assertIsValidKubernetesLabel(user);
      labelSelector = `${SIMPIPE_USER_LABEL}=${user}`;
    } catch (validationError) {
      console.error('resources.ts: Invalid Kubernetes label for user:', user, validationError);
      throw validationError;
    }
  }

  try {
    // 1) List VMNode CRDs (optionally filtered by user label)
    const crdResp = await k8sClient.customObjects.listNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'vmnodes',
      undefined,
      undefined,
      undefined,
      undefined,
      labelSelector,
    );
    const { body } = crdResp as { body: K8SVMNodeList };
    const items = body.items ?? [];

    // 2) List actual Kubernetes Nodes (equivalent of `kubectl get nodes`)
    const nodesResp = await k8sClient.core.listNode();
    const k8sNodes = nodesResp.body?.items ?? [];

    // 3) Build a map of nodeName -> desiredStatus based on Ready condition
    const desiredStatusByNodeName = new Map<string, 'running' | 'provisioning'>();
    for (const node of k8sNodes) {
      const nodeName = node.metadata?.name;
      if (!nodeName) continue;
      const readyCond = node.status?.conditions?.find((c) => c.type === 'Ready');
      const isReady = readyCond?.status === 'True';
      desiredStatusByNodeName.set(nodeName, isReady ? 'running' : 'provisioning');
    }

    // 4) Reconcile CRDs against actual Nodes and patch status if needed
    const patchPromises: Promise<unknown>[] = [];
    for (const vmnode of items) {
      const vmnodeName = vmnode.metadata?.name ?? vmnode.spec?.name;
      if (!vmnodeName) continue;

      const desired =
        desiredStatusByNodeName.has(vmnodeName)
          ? desiredStatusByNodeName.get(vmnodeName)!
          : 'shutdown'; // Node not found in cluster

      if (vmnode.spec.status !== desired) {
        // Patch CRD status to reflect actual node state
        patchPromises.push(
          k8sClient.customObjects.patchNamespacedCustomObject(
            'simpipe.sct.sintef.no',
            'v1',
            k8sNamespace,
            'vmnodes',
            vmnodeName,
            [
              {
                op: 'replace',
                path: '/spec/status',
                value: desired,
              },
            ],
            undefined,
            undefined,
            undefined,
            { headers: { 'Content-Type': 'application/json-patch+json' } },
          ).catch((err) => {
            console.error(`resources.ts: failed to patch VMNode ${vmnodeName} status -> ${desired}`, err);
          }),
        );
        // Optimistically update local object so the return reflects the change
        vmnode.spec.status = desired;
      }
    }

    if (patchPromises.length) {
      await Promise.allSettled(patchPromises);
    }

    // 5) Return unified view
    return items.map((vmnode) => convertK8SVMNodeToResource(vmnode));
  } catch (error) {
    console.error('resources.ts: Kubernetes API call failed:', error);
    throw error;
  }
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
      'vmnodes',
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

  const nodeName = slugify.default(name, { lower: true }).slice(0, 63);

  if (!/^[\da-z]([\da-z-]*[\da-z])?$/.test(nodeName)) {
    throw new InputValidationError(`Resource name contains invalid characters: ${nodeName}`);
  }

  let labels: Record<string, string> | undefined;
  if (user) {
    assertIsValidKubernetesLabel(user);
    labels = { [SIMPIPE_USER_LABEL]: user };
  }
  let status: string = 'provisioning';
  // Step 1: Create the k3s node
  try {
    await createKubeNode(nodeName, memory, cpus, os);
    status = 'running';
  } catch (error) {
    status = 'failed';
    console.error('Error creating kube node:', error);
    throw new Error(`Failed to create k3s node: ${(error as Error).message}`);
  }

  // Step 2: Persist as a CRD VMNode
  let createdVMNode: K8SVMNode;
  try {
    const response = await k8sClient.customObjects.createNamespacedCustomObject(
      'simpipe.sct.sintef.no',  // group
      'v1',                     // version
      k8sNamespace,             // namespace
      'vmnodes',                // plural
      {
        apiVersion: 'simpipe.sct.sintef.no/v1',
        kind: 'VMNode',
        metadata: { name: nodeName, labels },
        spec: { name, os, cpus, memory, status },
      },
    );

    createdVMNode = response.body as K8SVMNode;
  } catch (error: any) {
    console.error('[CRD] Failed to create VMNode CRD');
    if (error.response?.body) {
      console.error('[CRD] Error response body:', JSON.stringify(error.response.body, null, 2));
    }
    console.error('[CRD] Full error:', error);
    throw new Error(`Failed to create VMNode: ${error.message}`);
  }


  return convertK8SVMNodeToResource(createdVMNode);
}

// Delete a resource
export async function deleteResource(
  id: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<boolean> {
  try {
    await k8sClient.customObjects.patchNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'vmnodes',
      id,
      [
        {
          op: 'replace',
          path: '/spec/status',
          value: 'shutdown',
        },
      ],
      undefined,
      undefined,
      undefined,
      { headers: { 'Content-Type': 'application/json-patch+json' } },
    );
  } catch (error) {
    const code = (error as Error & { response?: { statusCode?: number } }).response?.statusCode;
    if (code !== 404) {
      console.warn(`deleteResource: failed to set status=shutdown for ${id}`, error);
    }
    // continue even if patch fails
  }

  // Tear down the underlying VM/K3s node
  await deleteKubeNode(id);
  return true;
}
