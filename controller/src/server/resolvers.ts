import { randomUUID } from 'node:crypto';

import {
  assertDryRunNodeHasWorkflow,
  convertArgoWorkflowNode,
  convertArgoWorkflowToDryRun,
  createDryRun, deleteDryRun, dryRunsForProject,
  getDryRun, getDryRunLog, getDryRunNodeLog, resubmitDryRun, resumeDryRun,
  retryDryRun, SIMPIPE_PROJECT_LABEL, stopDryRun, suspendDryRun,
} from '../argo/dry-runs.js';
import assignArgoWorkflowToProject from '../k8s/assign-argoworkflow-to-project.js';
import {
  createDockerRegistryCredential,
  deleteDockerRegistryCredential,
  dockerRegistryCredentials,
  updateDockerRegistryCredential,
} from '../k8s/docker-config-json.js';
import {
  createProject, deleteProject, getProject, projects, renameProject,
} from '../k8s/projects.js';
import { computePresignedPutUrl } from '../minio/minio.js';
import queryPrometheus from '../prometheus/prometheus.js';
import { PingError } from './apollo-errors.js';
import type { ArgoWorkflow } from '../argo/argo-client.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import type K8sClient from '../k8s/k8s-client.js';
import type {
  DryRun,
  DryRunLogArgs as DryRunLogArguments,
  DryRunNode,
  DryRunNodeArgs as DryRunNodeArguments,
  DryRunNodeMetrics,
  DryRunNodeMetricsCpuSystemSecondsTotalArgs as DryRunNodeMetricsCpuSystemSecondsTotalArguments,
  DryRunNodePod, DryRunNodePodLogArgs as DryRunNodePodLogArguments,
  Mutation,
  MutationAssignDryRunToProjectArgs as MutationAssignDryRunToProjectArguments,
  MutationCreateDockerRegistryCredentialArgs as MutationCreateDockerRegistryCredentialArguments,
  MutationCreateDryRunArgs as MutationCreateDryRunArguments,
  MutationCreateProjectArgs as MutationCreateProjectArguments,
  MutationDeleteDockerRegistryCredentialArgs as MutationDeleteDockerRegistryCredentialArguments,
  MutationDeleteDryRunArgs as MutationDeleteDryRunArguments,
  MutationDeleteProjectArgs as MutationDeleteProjectArguments,
  MutationRenameProjectArgs as MutationRenameProjectArguments,
  MutationResolvers,
  MutationResubmitDryRunArgs as MutationResubmitDryRunArguments,
  MutationResumeDryRunArgs as MutationResumeDryRunArguments,
  MutationRetryDryRunArgs as MutationRetryDryRunArguments,
  MutationStopDryRunArgs as MutationStopDryRunArguments,
  MutationSuspendDryRunArgs as MutationSuspendDryRunArguments,
  MutationUpdateDockerRegistryCredentialArgs as MutationUpdateDockerRegistryCredentialArguments,
  Project,
  Query,
  QueryDryRunArgs as QueryDryRunArguments,
  QueryProjectArgs as QueryProjectArguments,
  QueryResolvers,
} from './schema.js';

interface ContextUser {
  sub: string
  username: string
}

export interface Context {
  user?: ContextUser
  argoClient: ArgoWorkflowClient
  k8sClient: K8sClient
  k8sNamespace: string
}

interface AuthenticatedContext extends Context {
  user: ContextUser
}

// Create an assertion method for TypeScript that check that user is defined
/* function assertAuthenticated(context: Context): asserts context is AuthenticatedContext {
  if (context.user === undefined) {
    throw new Error('🎌 User is not defined');
  }
} */

type EmptyArguments = Record<string, never>;
type EmptyParent = Record<string, never>;

const resolvers = {
  Query: {
    username(
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Query['username'] {
      return context.user.username;
    },
    async ping(
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['ping']> {
      const { argoClient, k8sClient } = context;
      try {
        await Promise.all([
          argoClient.ping(),
          k8sClient.core.listNode(),
          // Ping argo, kubernetes, prometheus, and minio
        ]);
      } catch (error) {
        throw new PingError(error as Error);
      }

      return 'pong';
    },
    async computeUploadPresignedUrl(
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['computeUploadPresignedUrl']> {
      const { sub } = context.user;
      // Make sure the user is a filesystem safe string
      if (!/^[\w-]+$/i.test(sub)) {
        throw new Error('User identifier (sub) is unsupported for files');
      }
      const uuid = randomUUID();
      const objectName = `${sub}/${uuid}`;
      const url = await computePresignedPutUrl(objectName);
      return url;
    },
    async dockerRegistryCredentials(
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['dockerRegistryCredentials']> {
      const { k8sClient, k8sNamespace } = context;
      return await dockerRegistryCredentials(k8sClient, k8sNamespace);
    },
    async projects(
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['projects']> {
      const { k8sClient, k8sNamespace } = context;
      return await projects(k8sClient, k8sNamespace);
    },
    async project(
      _p: EmptyParent, arguments_: QueryProjectArguments, context: AuthenticatedContext,
    ): Promise<Query['project']> {
      const { k8sClient, k8sNamespace } = context;
      const { projectId } = arguments_;
      return await getProject(projectId, k8sClient, k8sNamespace);
    },
    async dryRun(
      _p: EmptyParent, arguments_: QueryDryRunArguments, context: AuthenticatedContext,
    ): Promise<Query['dryRun']> {
      const { dryRunId } = arguments_;
      const { argoClient } = context;
      return await getDryRun(dryRunId, argoClient);
    },
  } as Required<QueryResolvers<AuthenticatedContext, EmptyParent>>,
  Mutation: {
    async createDryRun(
      _p: EmptyParent,
      arguments_: MutationCreateDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createDryRun']> {
      const { argoWorkflow, dryRunId, projectId } = arguments_;
      const { argoClient } = context;
      return await createDryRun({
        argoWorkflow: (argoWorkflow as ArgoWorkflow),
        projectId: projectId ?? undefined,
        dryRunId: dryRunId ?? undefined,
        argoClient,
      });
      // const { sub: userId } = context.user;
      // await functions.checkSimulationOwner(simulationId, userId);
      // const runId = await functions.createRun(simulationId, name);
    },
    async suspendDryRun(
      _p: EmptyParent,
      arguments_: MutationSuspendDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['suspendDryRun']> {
      const { dryRunId } = arguments_;
      const { argoClient } = context;
      return await suspendDryRun(dryRunId, argoClient);
    },
    async resumeDryRun(
      _p: EmptyParent,
      arguments_: MutationResumeDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['resumeDryRun']> {
      const { dryRunId } = arguments_;
      const { argoClient } = context;
      return await resumeDryRun(dryRunId, argoClient);
    },
    async retryDryRun(
      _p: EmptyParent,
      arguments_: MutationRetryDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['retryDryRun']> {
      const { dryRunId } = arguments_;
      const { argoClient } = context;
      return await retryDryRun(dryRunId, argoClient);
    },
    async resubmitDryRun(
      _p: EmptyParent,
      arguments_: MutationResubmitDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['resumeDryRun']> {
      const { dryRunId } = arguments_;
      const { argoClient } = context;
      return await resubmitDryRun(dryRunId, argoClient);
    },
    async stopDryRun(
      _p: EmptyParent,
      arguments_: MutationStopDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['stopDryRun']> {
      const { dryRunId, terminate } = arguments_;
      const { argoClient } = context;
      return await stopDryRun(dryRunId, terminate ?? false, argoClient);
    },
    async deleteDryRun(
      _p: EmptyParent,
      arguments_: MutationDeleteDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['deleteDryRun']> {
      const { dryRunId } = arguments_;
      const { argoClient } = context;
      await deleteDryRun(dryRunId, argoClient);
      return true;
    },
    async assignDryRunToProject(
      _p: EmptyParent,
      arguments_: MutationAssignDryRunToProjectArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['assignDryRunToProject']> {
      const { dryRunId, projectId } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      // load project to make sure it exists,
      // it has a small window where it could be deleted
      // between the check and the assignment
      // but it's better than nothing.
      await getProject(projectId, k8sClient, k8sNamespace);
      const workflow = await assignArgoWorkflowToProject(
        dryRunId, projectId, k8sClient, k8sNamespace,
      );
      return convertArgoWorkflowToDryRun(workflow);
    },
    async createDockerRegistryCredential(
      _p: EmptyParent,
      arguments_: MutationCreateDockerRegistryCredentialArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createDockerRegistryCredential']> {
      const { credential } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await createDockerRegistryCredential(credential, k8sClient, k8sNamespace);
    },
    async updateDockerRegistryCredential(
      _p: EmptyParent,
      arguments_: MutationUpdateDockerRegistryCredentialArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['updateDockerRegistryCredential']> {
      const { credential } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await updateDockerRegistryCredential(credential, k8sClient, k8sNamespace);
    },
    async deleteDockerRegistryCredential(
      _p: EmptyParent,
      arguments_: MutationDeleteDockerRegistryCredentialArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['deleteDockerRegistryCredential']> {
      const { name } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await deleteDockerRegistryCredential(name, k8sClient, k8sNamespace);
    },
    async createProject(
      _p: EmptyParent,
      arguments_: MutationCreateProjectArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createProject']> {
      const { project } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await createProject(project, k8sClient, k8sNamespace);
    },
    async renameProject(
      _p: EmptyParent,
      arguments_: MutationRenameProjectArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['renameProject']> {
      const { projectId, name } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await renameProject(projectId, name, k8sClient, k8sNamespace);
    },
    async deleteProject(
      _p: EmptyParent,
      arguments_: MutationDeleteProjectArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['deleteProject']> {
      const { projectId } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await deleteProject(projectId, k8sClient, k8sNamespace);
    },
  } as Required<MutationResolvers<AuthenticatedContext, EmptyParent>>,
  Project: {
    async dryRuns(
      parent: Project,
      _a: EmptyArguments,
      context: AuthenticatedContext,
    ): Promise<Project['dryRuns']> {
      const { id } = parent;
      const { argoClient } = context;
      return await dryRunsForProject(id, argoClient);
    },
  },
  DryRun: {
    async project(
      parent: DryRun,
      _a: EmptyArguments,
      context: AuthenticatedContext,
    ): Promise<DryRun['project']> {
      const projectId = (parent.argoWorkflow as ArgoWorkflow)
        .metadata.labels?.[SIMPIPE_PROJECT_LABEL];
      if (!projectId) {
        return undefined;
      }
      const { k8sClient, k8sNamespace } = context;
      return await getProject(projectId, k8sClient, k8sNamespace);
    },
    async log(
      parent: DryRun,
      _arguments: DryRunLogArguments,
      context: AuthenticatedContext,
    ): Promise<DryRun['log']> {
      const { id } = parent;
      const { maxLines, grep } = _arguments;
      const { argoClient } = context;
      return await getDryRunLog({
        dryRunId: id,
        maxLines: maxLines ?? undefined,
        grep: grep ?? undefined,
        argoClient,
      });
    },
    nodes(
      parent: DryRun,
    ): DryRun['nodes'] {
      const { argoWorkflow } = parent as { argoWorkflow?: ArgoWorkflow };
      if (!argoWorkflow?.status?.nodes) {
        return undefined;
      }
      return Object.values(argoWorkflow.status.nodes)
        .map((node) => convertArgoWorkflowNode(node, argoWorkflow));
    },
    node(
      parent: DryRun,
      arguments_: DryRunNodeArguments,
    ): DryRun['node'] {
      const { argoWorkflow } = parent as { argoWorkflow?: ArgoWorkflow };
      if (!argoWorkflow) {
        return undefined;
      }
      const node = argoWorkflow?.status?.nodes?.[arguments_.id];
      if (!node) {
        return undefined;
      }
      return convertArgoWorkflowNode(node, argoWorkflow);
    },
  },
  DryRunNode: {
    // eslint-disable-next-line no-underscore-dangle
    __resolveType(dryRunNode: DryRunNode): string {
      // We use a switch to be future proof of course.
      switch (dryRunNode.type) {
        case 'Pod': {
          return 'DryRunNodePod';
        }
        default: {
          return 'DryRunNodeMisc';
        }
      }
    },
  },
  DryRunNodePod: {
    async log(
      dryRunNode: DryRunNodePod,
      _arguments: DryRunNodePodLogArguments,
      context: AuthenticatedContext,
    ): Promise<DryRunNodePod['log']> {
      assertDryRunNodeHasWorkflow(dryRunNode);
      const { workflow } = dryRunNode;
      const { maxLines, grep } = _arguments;
      const { argoClient } = context;
      return await getDryRunNodeLog({
        dryRunNode,
        workflow,
        maxLines: maxLines ?? undefined,
        grep: grep ?? undefined,
        argoClient,
      });
    },
    metrics(
      dryRunNode: DryRunNodePod,
    ): DryRunNodePod['metrics'] & { dryRunNode: DryRunNodePod } {
      return { dryRunNode };
    },
  },
  DryRunNodeMetrics: {
    async cpuSystemSecondsTotal(
      dryRunNodeMetrics: DryRunNodeMetrics & { dryRunNode: DryRunNodePod },
      _arguments: DryRunNodeMetricsCpuSystemSecondsTotalArguments,
    ): Promise<DryRunNodeMetrics['cpuSystemSecondsTotal']> {
      const { dryRunNode } = dryRunNodeMetrics;
      let { step } = _arguments;
      const { startedAt, finishedAt, podName } = dryRunNode;
      if (!startedAt) {
        return [];
      }

      // We have a 10s offset to avoid most clock drifts.
      const startTimestamp = new Date(startedAt).getTime() / 1000 - 10;

      const endTimestamp = finishedAt
        ? new Date(finishedAt).getTime() / 1000 + 10
        : Date.now() / 1000 + 10;

      if (!step) {
        step = Math.ceil((endTimestamp - startTimestamp) / 1000);
      }

      const data = await queryPrometheus('simpipe_cpu_system_seconds_total', {
        container_name: 'main',
        pod_name: podName,
      }, startTimestamp, endTimestamp, step);

      return data.flatMap(({ values }) => values)
        .map(([timestamp, value]) => ({
          timestamp,
          value,
        }));
    },
  },
};

export default resolvers;
