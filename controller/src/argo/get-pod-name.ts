// This file is based on the following argo source code file:
// https://github.com/argoproj/argo-workflows/blob/0994de6b9de9b3b5a8b5faad53060eceecdc4acf/ui/src/app/shared/pod-name.ts#L51

import type { ArgoWorkflow } from './argo-client.js';

interface SimplePodNameNode {
  id: string;
  name: string;
  templateName?: string | null;
  templateRef?: {
    template?: string;
  };
}

function getTemplateNameFromNode(node: SimplePodNameNode): string {
  if (node.templateName && node.templateName !== '') {
    return node.templateName;
  }

  return node.templateRef?.template ?? '';
}

const maxK8sResourceNameLength = 253;
const k8sNamingHashLength = 10;
const maxPrefixLength = maxK8sResourceNameLength - k8sNamingHashLength - 1;
function ensurePodNamePrefixLength(prefix: string): string {
  if (prefix.length > maxPrefixLength) {
    return prefix.slice(0, maxPrefixLength);
  }
  return prefix;
}

function createFNVHash(input: string): number {
  const data = Buffer.from(input);

  let hashint = 2_166_136_261;

  /* eslint-disable no-bitwise */
  for (const character of data) {
    hashint ^= character;
    hashint += (hashint << 1) + (hashint << 4) + (hashint << 7) + (hashint << 8) + (hashint << 24);
  }

  return hashint >>> 0;
  /* eslint-enable no-bitwise */
}

// workflows.argoproj.io/pod-name-format
export default function getPodName(
  node: SimplePodNameNode,
  argoWorkflow: ArgoWorkflow,
): string {
  const version = argoWorkflow.metadata.annotations?.['workflows.argoproj.io/pod-name-format'];
  const { id, name: nodeName } = node;
  const templateName = getTemplateNameFromNode(node);
  const { name: workflowName } = argoWorkflow.metadata;

  if (!workflowName) {
    throw new Error('Workflow name is not defined');
  }

  if (version === 'v1' || templateName === '') {
    return id;
  }

  if (workflowName === nodeName) {
    return workflowName;
  }

  const prefix = ensurePodNamePrefixLength(`${workflowName}-${templateName}`);
  const hash = createFNVHash(nodeName);
  return `${prefix}-${hash}`;
}
