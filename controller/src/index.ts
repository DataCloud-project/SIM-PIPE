import ArgoWorkflowClient from './argo/argo-client.js';
import startServer from './server/server.js';

await startServer();

const argoClient = new ArgoWorkflowClient('http://localhost:2746/');

const workflows = await argoClient.listWorkflows();
for (const workflow of workflows) {
  console.log(workflow.metadata.name);
  console.log(workflow.spec);
}
