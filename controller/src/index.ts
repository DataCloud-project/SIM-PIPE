import { CoreV1Api, KubeConfig } from '@kubernetes/client-node';

import ArgoWorkflowClient from './argo/argo-client.js';
import { argoClientEndpoint } from './config.js';
import startServer from './server/server.js';

const kubeconfig = new KubeConfig();
kubeconfig.loadFromDefault();
const k8sClient = kubeconfig.makeApiClient(CoreV1Api);

const argoClient = new ArgoWorkflowClient(argoClientEndpoint);

await startServer({
  argoClient,
  k8sClient,
});
