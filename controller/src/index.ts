import ArgoWorkflowClient from './argo/argo-client.js';
import { argoClientEndpoint } from './config.js';
import K8sClient from './k8s/k8s-client.js';
import startServer from './server/server.js';

const k8sClient = new K8sClient();

const argoClient = new ArgoWorkflowClient(argoClientEndpoint);

await startServer({
  argoClient,
  k8sClient,
});
