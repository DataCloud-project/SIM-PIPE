import { randomUUID } from 'node:crypto';

import {
  assertDryRunNodeHasWorkflow,
  convertArgoWorkflowNode,
  convertArgoWorkflowToDryRun,
  createDryRun, deleteDryRun, dryRunsForProject,
  getDryRun, getDryRunLog, getDryRunNodeLog, resubmitDryRun, resumeDryRun,
  retryDryRun, stopDryRun, suspendDryRun,
} from '../argo/dry-runs.js';
import { SIMPIPE_PROJECT_LABEL } from '../argo/project-label.js';
import {
  createWorkflowTemplate,
  deleteWorkflowTemplate,
  getWorkflowTemplate,
  updateWorkflowTemplate,
  workflowTemplatesForProject,
} from '../argo/workflow-template.js';
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
import { computePresignedGetUrl, computePresignedPutUrl } from '../minio/minio.js';
import queryPrometheusResolver from '../prometheus/query-prometheus-resolver.js';
import { PingError } from './apollo-errors.js';
import type { ArgoWorkflow, ArgoWorkflowTemplate } from '../argo/argo-client.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import type K8sClient from '../k8s/k8s-client.js';
import type {
  DryRun,
  DryRunLogArgs as DryRunLogArguments,
  DryRunNode,
  DryRunNodeArgs as DryRunNodeArguments,
  DryRunNodeArtifact,
  DryRunNodeMetrics,
  DryRunNodeMetricsCpuSystemSecondsTotalArgs as DryRunNodeMetricsCpuSystemSecondsTotalArguments,
  DryRunNodePod, DryRunNodePodLogArgs as DryRunNodePodLogArguments,
  Mutation,
  MutationAssignDryRunToProjectArgs as MutationAssignDryRunToProjectArguments,
  MutationComputeUploadPresignedUrlArgs as MutationComputeUploadPresignedUrlArguments,
  MutationCreateDockerRegistryCredentialArgs as MutationCreateDockerRegistryCredentialArguments,
  MutationCreateDryRunArgs as MutationCreateDryRunArguments,
  MutationCreateProjectArgs as MutationCreateProjectArguments,
  MutationCreateWorkflowTemplateArgs as MutationCreateWorkflowTemplateArguments,
  MutationDeleteDockerRegistryCredentialArgs as MutationDeleteDockerRegistryCredentialArguments,
  MutationDeleteDryRunArgs as MutationDeleteDryRunArguments,
  MutationDeleteProjectArgs as MutationDeleteProjectArguments,
  MutationDeleteWorkflowTemplateArgs as MutationDeleteWorkflowTemplateArguments,
  MutationRenameProjectArgs as MutationRenameProjectArguments,
  MutationResolvers,
  MutationResubmitDryRunArgs as MutationResubmitDryRunArguments,
  MutationResumeDryRunArgs as MutationResumeDryRunArguments,
  MutationRetryDryRunArgs as MutationRetryDryRunArguments,
  MutationStopDryRunArgs as MutationStopDryRunArguments,
  MutationSuspendDryRunArgs as MutationSuspendDryRunArguments,
  MutationUpdateDockerRegistryCredentialArgs as MutationUpdateDockerRegistryCredentialArguments,
  MutationUpdateWorkflowTemplateArgs as MutationUpdateWorkflowTemplateArguments,
  Project,
  Query,
  QueryDryRunArgs as QueryDryRunArguments,
  QueryProjectArgs as QueryProjectArguments,
  QueryResolvers,
  QueryWorkflowTemplateArgs as QueryWorkflowTemplateArguments,
  WorkflowTemplate,
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
    async workflowTemplate(
      _p: EmptyParent, arguments_: QueryWorkflowTemplateArguments, context: AuthenticatedContext,
    ): Promise<Query['workflowTemplate']> {
      const { name } = arguments_;
      const { argoClient } = context;
      return await getWorkflowTemplate(name, argoClient);
    },
  } as Required<QueryResolvers<AuthenticatedContext, EmptyParent>>,
  Mutation: {
    async createDryRun(
      _p: EmptyParent,
      arguments_: MutationCreateDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createDryRun']> {
      const { input } = arguments_;
      const { argoWorkflow, dryRunId, projectId } = input;
      const { argoClient } = context;
      return await createDryRun({
        argoWorkflow: argoWorkflow as ArgoWorkflow,
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
    async computeUploadPresignedUrl(
      _p: EmptyParent,
      _arguments: MutationComputeUploadPresignedUrlArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['computeUploadPresignedUrl']> {
      const { sub } = context.user;
      // Make sure the user is a filesystem safe string
      if (!/^[\w-]+$/i.test(sub)) {
        throw new Error('User identifier (sub) is unsupported for files');
      }

      let { key } = _arguments;
      if (key) {
        if (!/^[\w.-]+$/i.test(key)) {
          throw new Error('Key is unsupported for files');
        }
      } else {
        key = randomUUID();
      }

      const objectName = `${sub}/${key}`;
      return await computePresignedPutUrl(objectName);
    },
    async createWorkflowTemplate(
      _p: EmptyParent,
      arguments_: MutationCreateWorkflowTemplateArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createWorkflowTemplate']> {
      const { input } = arguments_;
      const { name, projectId, argoWorkflowTemplate } = input;
      const { argoClient } = context;
      return await createWorkflowTemplate({
        name: name ?? undefined,
        projectId: projectId ?? undefined,
        argoWorkflowTemplate: argoWorkflowTemplate as ArgoWorkflowTemplate,
        argoClient,
      });
    },
    async updateWorkflowTemplate(
      _p: EmptyParent,
      arguments_: MutationUpdateWorkflowTemplateArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['updateWorkflowTemplate']> {
      const { update } = arguments_;
      const { name, projectId, argoWorkflowTemplate } = update;
      const { argoClient } = context;
      return await updateWorkflowTemplate({
        name,
        projectId: projectId ?? undefined,
        argoWorkflowTemplate: argoWorkflowTemplate as ArgoWorkflowTemplate,
        argoClient,
      });
    },
    async deleteWorkflowTemplate(
      _p: EmptyParent,
      arguments_: MutationDeleteWorkflowTemplateArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['deleteWorkflowTemplate']> {
      const { name } = arguments_;
      const { argoClient } = context;
      await deleteWorkflowTemplate(name, argoClient);
      return true;
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
    async workflowTemplates(
      parent: Project,
      _a: EmptyArguments,
      context: AuthenticatedContext,
    ): Promise<Project['workflowTemplates']> {
      const { id } = parent;
      const { argoClient } = context;
      return await workflowTemplatesForProject(id, argoClient);
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
    /* Verbose way of doing the resolver. */
    async cpuSystemSecondsTotal(
      dryRunNodeMetrics: DryRunNodeMetrics & { dryRunNode: DryRunNodePod },
      _arguments: DryRunNodeMetricsCpuSystemSecondsTotalArguments,
    ): Promise<DryRunNodeMetrics['cpuSystemSecondsTotal']> {
      return await queryPrometheusResolver<'cpuSystemSecondsTotal'>('simpipe_cpu_system_seconds_total', dryRunNodeMetrics, _arguments);
    },
    /* More concise way. The previous way is to explain what we are doing. */
    cpuUsageSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_cpu_usage_seconds_total'),
    cpuUserSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_cpu_user_seconds_total'),
    fileDescriptors: queryPrometheusResolver.bind(undefined, 'simpipe_file_descriptors'),
    fsInodesFree: queryPrometheusResolver.bind(undefined, 'simpipe_fs_inodes_free'),
    fsInodesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_inodes_total'),
    fsIoCurrent: queryPrometheusResolver.bind(undefined, 'simpipe_fs_io_current'),
    fsIoTimeSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_io_time_seconds_total'),
    fsIoTimeWeightedSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_io_time_weighted_seconds_total'),
    fsLimitBytes: queryPrometheusResolver.bind(undefined, 'simpipe_fs_limit_bytes'),
    fsReadSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_read_seconds_total'),
    fsReadsMergedTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_reads_merged_total'),
    fsReadsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_reads_total'),
    fsSectorReadsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_sector_reads_total'),
    fsSectorWritesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_sector_writes_total'),
    fsUsageBytes: queryPrometheusResolver.bind(undefined, 'simpipe_fs_usage_bytes'),
    fsWriteSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_write_seconds_total'),
    fsWritesMergedTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_writes_merged_total'),
    fsWritesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_writes_total'),
    memoryCache: queryPrometheusResolver.bind(undefined, 'simpipe_memory_cache'),
    memoryFailcnt: queryPrometheusResolver.bind(undefined, 'simpipe_memory_failcnt'),
    memoryFailuresTotal: queryPrometheusResolver.bind(undefined, 'simpipe_memory_failures_total'),
    memoryMappedFile: queryPrometheusResolver.bind(undefined, 'simpipe_memory_mapped_file'),
    memoryMaxUsageBytes: queryPrometheusResolver.bind(undefined, 'simpipe_memory_max_usage_bytes'),
    memoryRss: queryPrometheusResolver.bind(undefined, 'simpipe_memory_rss'),
    memorySwap: queryPrometheusResolver.bind(undefined, 'simpipe_memory_swap'),
    memoryUsageBytes: queryPrometheusResolver.bind(undefined, 'simpipe_memory_usage_bytes'),
    memoryWorkingSetBytes: queryPrometheusResolver.bind(undefined, 'simpipe_memory_working_set_bytes'),
    networkReceiveBytesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_receive_bytes_total'),
    networkReceiveErrorsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_receive_errors_total'),
    networkReceivePacketsDroppedTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_receive_packets_dropped_total'),
    networkReceivePacketsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_receive_packets_total'),
    networkTransmitBytesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_transmit_bytes_total'),
    networkTransmitErrorsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_transmit_errors_total'),
    networkTransmitPacketsDroppedTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_transmit_packets_dropped_total'),
    networkTransmitPacketsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_transmit_packets_total'),
    processes: queryPrometheusResolver.bind(undefined, 'simpipe_processes'),
    sockets: queryPrometheusResolver.bind(undefined, 'simpipe_sockets'),
    threads: queryPrometheusResolver.bind(undefined, 'simpipe_threads'),
    threadsMax: queryPrometheusResolver.bind(undefined, 'simpipe_threads_max'),
    ulimitsSoft: queryPrometheusResolver.bind(undefined, 'simpipe_ulimits_soft'),
  },
  DryRunNodeArtifact: {
    async url(
      dryRunNodeArtifact: DryRunNodeArtifact,
    ): Promise<DryRunNodeArtifact['url']> {
      const { key } = dryRunNodeArtifact;
      if (!key) {
        return undefined;
      }
      return await computePresignedGetUrl(key);
    },
  },
  WorkflowTemplate: {
    async project(
      parent: WorkflowTemplate,
      _a: EmptyArguments,
      context: AuthenticatedContext,
    ): Promise<WorkflowTemplate['project']> {
      const projectId = (parent.argoWorkflowTemplate as (ArgoWorkflowTemplate | undefined))
        ?.metadata?.labels?.[SIMPIPE_PROJECT_LABEL];
      if (!projectId) {
        return undefined;
      }
      const { k8sClient, k8sNamespace } = context;
      return await getProject(projectId, k8sClient, k8sNamespace);
    },
  },
};

export default resolvers;
