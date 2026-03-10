import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import slugify from 'slugify';
import type { V1ListMeta, V1ObjectMeta } from '@kubernetes/client-node';

import createKubeNode, { deleteKubeNode } from '../argo/emulation-utils.js';
import { InputValidationError } from '../server/apollo-errors.js';
import { SIMPIPE_USER_LABEL } from './label.js';
import { assertIsValidKubernetesLabel } from './valid-kubernetes-label.js';
import type { CreateResourceInput, Resource } from '../server/schema.js';
import type K8sClient from './k8s-client.js';

const execFileAsync = promisify(execFile);

function getStatusCode(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  if (!('response' in error)) return undefined;
  const { response } = (error as { response?: { statusCode?: number } });
  return response?.statusCode;
}

function getResponseBody(error: unknown): unknown {
  if (typeof error !== 'object' || error === null) return undefined;
  if (!('response' in error)) return undefined;
  const { response } = (error as { response?: { body?: unknown } });
  return response?.body;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

async function getProcessTable(): Promise<string> {
  const commandVariants: Array<{ command: string; args: string[] }> = [
    {
      command: 'nsenter',
      args: ['-t', '1', '-p', '-m', '-u', '-n', '-i', '--', 'ps', '-eo', 'pid,args'],
    },
    { command: 'ps', args: ['-eo', 'pid,args'] },
  ];

  for (const variant of commandVariants) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const { stdout } = await execFileAsync(variant.command, variant.args);
      if (stdout) return stdout;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`resources.ts: unable to read process table via ${variant.command}`, error);
    }
  }

  return '';
}

async function isQemuRunningForNode(nodeName: string): Promise<boolean> {
  if (!/^[\w.-]+$/.test(nodeName)) {
    // Invalid node name; treat as not running to allow cleanup to proceed safely.
    return false;
  }

  const processTable = await getProcessTable();
  if (!processTable) return false;

  const needle = nodeName.toLowerCase();
  return processTable
    .split('\n')
    .some((line) => line.includes('qemu-system') && line.toLowerCase().includes(needle));
}

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

export async function cleanupStaleResource(
  id: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<boolean> {
  let vmnode: K8SVMNode | undefined;
  try {
    const response = await k8sClient.customObjects.getNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'vmnodes',
      id,
    );
    vmnode = response.body as K8SVMNode;
  } catch (error) {
    const code = getStatusCode(error);
    if (code === 404) {
      return false;
    }
    // eslint-disable-next-line no-console
    console.error('cleanupStaleResource: failed to load VMNode', { id, error });
    throw error;
  }

  const status = vmnode.spec?.status?.toLowerCase?.() ?? '';
  const isReady = status === 'ready' || status === 'running';
  if (isReady) return false;

  const nodeName = vmnode.metadata?.name ?? id;
  const qemuRunning = await isQemuRunningForNode(nodeName);
  if (qemuRunning) return false;

  try {
    await k8sClient.customObjects.patchNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'vmnodes',
      nodeName,
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
    const code = getStatusCode(error);
    if (code !== 404) {
      // eslint-disable-next-line no-console
      console.warn(`cleanupStaleResource: failed to patch status for ${nodeName}`, {
        statusCode: code,
        responseBody: getResponseBody(error),
        error,
      });
    }
  }

  await deleteKubeNode(nodeName);
  return true;
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
      // eslint-disable-next-line no-console
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
      if (nodeName) {
        const readyCond = node.status?.conditions?.find((c) => c.type === 'Ready');
        const isReady = readyCond?.status === 'True';
        desiredStatusByNodeName.set(nodeName, isReady ? 'running' : 'provisioning');
      }
    }

    // 4) Reconcile CRDs against actual Nodes and patch status if needed
    const patchPromises: Promise<unknown>[] = [];
    const cleanupPromises: Promise<void>[] = [];
    const cleanedIds = new Set<string>();
    for (const vmnode of items) {
      const vmnodeName = vmnode.metadata?.name ?? vmnode.spec?.name;
      if (vmnodeName) {
        const desired = desiredStatusByNodeName.get(vmnodeName) ?? 'shutdown';

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
            ).catch((error) => {
              // eslint-disable-next-line no-console
              console.error(
                `resources.ts: failed to patch VMNode ${vmnodeName} status -> ${desired}`,
                error,
              );
            }),
          );
          // Optimistically update local object so the return reflects the change
          vmnode.spec.status = desired;
        }

        const current = vmnode.spec.status?.toLowerCase?.();
        if (current && current !== 'ready' && current !== 'running') {
          cleanupPromises.push(
            cleanupStaleResource(vmnodeName, k8sClient, k8sNamespace)
              .then((removed) => {
                if (removed) cleanedIds.add(vmnodeName);
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(`resources.ts: cleanupStaleResource failed for ${vmnodeName}`, error);
              }),
          );
        }
      }
    }

    if (patchPromises.length > 0) {
      await Promise.allSettled(patchPromises);
    }

    if (cleanupPromises.length > 0) {
      await Promise.allSettled(cleanupPromises);
    }

    // 5) Return unified view
    const filtered = items.filter((vmnode) => {
      const name = vmnode.metadata?.name ?? vmnode.spec?.name;
      return name ? !cleanedIds.has(name) : true;
    });

    return filtered.map((vmnode) => convertK8SVMNodeToResource(vmnode));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('resources.ts: Kubernetes API call failed:', error);
    throw error;
  }
}

// Get a specific resource by ID
// export async function getResource(
//   id: string,
//   k8sClient: K8sClient,
//   k8sNamespace = 'default',
//   user?: string,
// ): Promise<Resource> {
//   let body: K8SVMNode;
//   try {
//     const response = await k8sClient.customObjects.getNamespacedCustomObject(
//       'simpipe.sct.sintef.no',
//       'v1',
//       k8sNamespace,
//       'vmnodes',
//       id,
//     );
//     body = response.body as K8SVMNode;
//   } catch (error) {
//     if ((error as Error & { response?: { statusCode: number } }).response?.statusCode === 404) {
//       throw new NotFoundError(`Resource not found: ${id}`);
//     }
//     throw error;
//   }
//   if (user && body.metadata.labels?.[SIMPIPE_USER_LABEL] !== user) {
//     throw new NotFoundError(`Resource not found: ${id}`);
//   }
//   return convertK8SVMNodeToResource(body);
// }

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
  let status = 'provisioning';
  // Step 1: Create the k3s node
  try {
    await createKubeNode(nodeName, memory, cpus, os);
    status = 'running';
  } catch (error) {
    status = 'failed';
    // eslint-disable-next-line no-console
    console.error('Error creating kube node:', error);
    throw new Error(`Failed to create k3s node: ${getErrorMessage(error)}`);
  }

  // Step 2: Persist as a CRD VMNode
  let createdVMNode: K8SVMNode;
  try {
    const response = await k8sClient.customObjects.createNamespacedCustomObject(
      'simpipe.sct.sintef.no', // group
      'v1', // version
      k8sNamespace, // namespace
      'vmnodes', // plural
      {
        apiVersion: 'simpipe.sct.sintef.no/v1',
        kind: 'VMNode',
        metadata: {
          name: nodeName,
          labels,
        },
        spec: {
          name,
          os,
          cpus,
          memory,
          status,
        },
      },
    );

    createdVMNode = response.body as K8SVMNode;
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('[CRD] Failed to create VMNode CRD');
    const responseBody = getResponseBody(error);
    if (responseBody) {
      // eslint-disable-next-line no-console
      console.error('[CRD] Error response body:', JSON.stringify(responseBody, undefined, 2));
    }
    // eslint-disable-next-line no-console
    console.error('[CRD] Full error:', error);
    throw new Error(`Failed to create VMNode: ${getErrorMessage(error)}`);
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
    // Delete the VMNode CRD
    await k8sClient.customObjects.deleteNamespacedCustomObject(
      'simpipe.sct.sintef.no',
      'v1',
      k8sNamespace,
      'vmnodes',
      id,
    );
  } catch (error) {
    const code = getStatusCode(error);
    if (code !== 404) {
      // eslint-disable-next-line no-console
      console.warn(`deleteResource: failed to delete VMNode CRD for ${id}`, error);
    }
  }

  // Tear down the underlying VM/K3s node
  await deleteKubeNode(id);
  return true;
}

// Shutdown a resource
export async function shutdownResource(
  id: string,
  k8sClient: K8sClient,
  k8sNamespace = 'default',
): Promise<boolean> {
  try {
    // Patch CRD for VM Node to modify status to 'shutdown'
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
    const code = getStatusCode(error);
    if (code !== 404) {
      // eslint-disable-next-line no-console
      console.warn(`shutdownResource: failed to set status=shutdown for ${id}`, {
        statusCode: code,
        responseBody: getResponseBody(error),
        error,
      });
    }
  }
  // Tear down the underlying VM/K3s node
  await deleteKubeNode(id);
  return true;
}
