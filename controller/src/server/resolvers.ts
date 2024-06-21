import { randomUUID } from 'node:crypto';

import {
  assertDryRunNodeHasWorkflow,
  convertArgoWorkflowNode,
  convertArgoWorkflowToDryRun,
  createDryRun, deleteDryRun, dryRunsForProject,
  getDryRun, getDryRunNodeLog, resubmitDryRun, resumeDryRun,
  retryDryRun, stopDryRun, suspendDryRun,
} from '../argo/dry-runs.js';
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
import { SIMPIPE_PROJECT_LABEL } from '../k8s/label.js';
import {
  createProject, deleteProject, getProject, projects, renameProject,
} from '../k8s/projects.js';
import {
  computePresignedGetUrl, 
  computePresignedPutUrl, 
  listAllBuckets, 
  listAllObjects, 
  getObjectSize, 
  createBucket, 
  deleteBucket, 
  deleteObjects,
  getObjectMetadata,
} from '../minio/minio.js';
import { ArtifactItem } from '../minio/minio.js';
import { assertPrometheusIsHealthy } from '../prometheus/prometheus.js';
import queryPrometheusResolver from '../prometheus/query-prometheus-resolver.js';
import { aggregatedNodesMetrics, computeScalingLaws } from '../curve_fitting/dry-run-data.js';
import { NotFoundError, PingError } from './apollo-errors.js';
import type { ArgoWorkflow, ArgoWorkflowTemplate } from '../argo/argo-client.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import type K8sClient from '../k8s/k8s-client.js';
import type {
  Artifact,
  DryRun,
  DryRunNode,
  DryRunNodeArgs as DryRunNodeArguments,
  DryRunNodeMetrics,
  DryRunNodeMetricsCpuSystemSecondsTotalArgs as DryRunNodeMetricsCpuSystemSecondsTotalArguments,
  DryRunNodePod, DryRunNodePodLogArgs as DryRunNodePodLogArguments,
  Mutation,
  MutationCreateBucketArgs as MutationCreateBucketArguments,
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
  MutationDeleteArtifactsArgs as MutationDeleteArtifactsArguments,
  MutationGetAggregatedNodesMetricsArgs as MutationGetNodesData,
  MutationComputeScalingLawsFromNodesMetricsArgs as MutationComputeScalingLawsFromNodesMetricsArguments,
  Project,
  Query,
  QueryArtifactArgs as QueryArtifactArguments,
  QueryArtifactsArgs as QueryArtifactsArguments,
  QueryDryRunArgs as QueryDryRunArguments,
  QueryProjectArgs as QueryProjectArguments,
  QueryResolvers,
  QueryWorkflowTemplateArgs as QueryWorkflowTemplateArguments,
  WorkflowTemplate,
  NodesAggregatedNodeMetrics,
  NodesScalingLaws,
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

// Example custom error class
class NotAllowedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotAllowedError';
  }
}

// Create an assertion method for TypeScript that check that user is defined
/* function assertAuthenticated(context: Context): asserts context is AuthenticatedContext {
  if (context.user === undefined) {
    throw new Error('🎌 User is not defined');
  }
} */

function isValidFilePath(key: string): boolean {
  return /^[\w-/.]+$/i.test(key);
}

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
      const { argoClient, k8sClient, k8sNamespace } = context;
      try {
        await Promise.all([
          // Argo
          argoClient.ping(),
          // K8S (through the Custom Resource Definition)
          projects(k8sClient, k8sNamespace),
          // Prometheus
          assertPrometheusIsHealthy(),
        ]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
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
      const { k8sClient, k8sNamespace, user } = context;
      const { sub } = user;
      return await projects(k8sClient, k8sNamespace, sub);
    },
    async project(
      _p: EmptyParent, arguments_: QueryProjectArguments, context: AuthenticatedContext,
    ): Promise<Query['project']> {
      const { k8sClient, k8sNamespace, user } = context;
      const { sub } = user;
      const { projectId } = arguments_;
      return await getProject(projectId, k8sClient, k8sNamespace, sub);
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
      const { argoClient, user } = context;
      const { sub } = user;
      return await getWorkflowTemplate(name, argoClient, sub);
    },
    async buckets(
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['buckets']> {
      const buckets = await listAllBuckets();
      return buckets.map(({ name }) => ({
        name,
      }));
    },
    async artifact(
      _p: EmptyParent, arguments_: QueryArtifactArguments, context: AuthenticatedContext,
    ): Promise<Query['artifact']> {
      const { key, bucketName } = arguments_;
      const object = await getObjectMetadata(key, bucketName);
      let returnobject = {
        etag: object.etag,
        lastModified: object.lastModified.toISOString(),
        size: object.size,
        metadata: object.metaData,
      };
      return returnobject;
    },
    async artifacts(
      _p: EmptyParent, arguments_: QueryArtifactsArguments, context: AuthenticatedContext,
    ): Promise<Query['artifacts']> {
      const { bucketName } = arguments_;
      // console.log(bucketName);
      let objects: ArtifactItem[];
      if (!bucketName) {
        objects = await listAllObjects(); // will use default bucket
      } else {
        objects = await listAllObjects(bucketName);
      }
      return objects.map(({ name, size }) => ({
        name,
        key: name,
        size,
        bucketName,
      }));
    },
  } as Required<QueryResolvers<AuthenticatedContext, EmptyParent>>,
  Mutation: {
    async getAggregatedNodesMetrics(
      _p: EmptyParent, arguments_: MutationGetNodesData, context: AuthenticatedContext
    ): Promise<Mutation['getAggregatedNodesMetrics']> {
      const containerName = 'main'
      let aggregateMethod = 'average' // default
      if (arguments_.aggregateMethod) {
        aggregateMethod = arguments_.aggregateMethod;
      }
      const dryRynIds: string[] = arguments_.dryRunIds as string[];
      const nodesAggregatedNodeMetrics = await aggregatedNodesMetrics(dryRynIds, containerName, context.argoClient, aggregateMethod);
      return nodesAggregatedNodeMetrics;
    },
    async computeScalingLawsFromNodesMetrics(
      _p: EmptyParent,
      arguments_: MutationComputeScalingLawsFromNodesMetricsArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['computeScalingLawsFromNodesMetrics']> {
      const { nodesAggregatedNodeMetrics, dryRunIds } = arguments_;
      const containerName = 'main';
      let aggregateMethod = 'average'; // default

      let scalingLaws: NodesScalingLaws[] = [];

      // TODO: This is a bit of a mess, we should probably refactor this
      
      if (dryRunIds && !nodesAggregatedNodeMetrics) {
        const dryRunIds: string[] = arguments_.dryRunIds as string[];
        const data_x: number[] = arguments_.data_x as number[];
        const nodesAggregatedNodeMetrics = await aggregatedNodesMetrics(dryRunIds, containerName, context.argoClient, aggregateMethod);
        scalingLaws = await computeScalingLaws(nodesAggregatedNodeMetrics, data_x);
      } else if (!dryRunIds && nodesAggregatedNodeMetrics) {
        const nodesAggregatedNodeMetrics = arguments_.nodesAggregatedNodeMetrics as NodesAggregatedNodeMetrics[];
        const data_x: number[] = arguments_.data_x as number[];
        scalingLaws = await computeScalingLaws(nodesAggregatedNodeMetrics, data_x);
      } else {
        throw new Error('Provide either dryRunIds or nodesAggregatedNodeMetrics, and data_x.');
      }

      return scalingLaws;
    },
    async createBucket(
      _p: EmptyParent, arguments_: MutationCreateBucketArguments, context: AuthenticatedContext,
    ): Promise<Mutation['createBucket']> {
      const { name } = arguments_;
      // eslint-disable-next-line unicorn/prefer-ternary
      if (['artifacts', 'logs', 'registry'].includes(name)) {
        throw new NotAllowedError('Not allowed to create bucket with this name');
      } else {
        const returnedBucketName = createBucket(name);
        return returnedBucketName;
      }
    },
    async deleteBucket(
      _p: EmptyParent, arguments_: MutationCreateBucketArguments, context: AuthenticatedContext,
    ): Promise<Mutation['deleteBucket']> {
      const { name } = arguments_;
      // eslint-disable-next-line unicorn/prefer-ternary
      if (['artifacts', 'logs', 'registry'].includes(name)) {
        throw new NotAllowedError('Not allowed to delete bucket with this name');
      } else {
        return deleteBucket(name);
      }
    },
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
      const { k8sClient, k8sNamespace, user } = context;
      const { sub } = user;
      return await createProject(project, k8sClient, k8sNamespace, sub);
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
      /*
      // TODO: I uncommented this for now due to conseqenses to uploading files using the artifact browser.
      const { sub } = context.user;
      console.log('sub', sub);
      // Make sure the user is a filesystem safe string
      if (!/^[\w-]+$/i.test(sub)) {
        throw new Error('User identifier (sub) is unsupported for files');
      }
      */
      let { key, bucketName } = _arguments;
      //console.log('key', key);
      if (key) {
        //if (!/^[\w.-]+$/i.test(key)) {
        if (!isValidFilePath(key)) {
          throw new Error('Key is unsupported for files');
        }
      } else {
        key = randomUUID();
      }

      //const objectName = `${sub}/${key}`;
      const objectName = key;
      // console.log('bucketName', bucketName);
      // console.log('objectName', objectName);
      if (bucketName !== null) {
        return await computePresignedPutUrl(objectName, bucketName);
      } else {
        return await computePresignedPutUrl(objectName);
      }
    },
    async createWorkflowTemplate(
      _p: EmptyParent,
      arguments_: MutationCreateWorkflowTemplateArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createWorkflowTemplate']> {
      const { input } = arguments_;
      const { name, projectId, argoWorkflowTemplate } = input;
      const { argoClient, user } = context;
      const { sub } = user;
      return await createWorkflowTemplate({
        name: name ?? undefined,
        projectId: projectId ?? undefined,
        argoWorkflowTemplate: argoWorkflowTemplate as ArgoWorkflowTemplate,
        user: sub,
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
    async deleteArtifacts(
      _p: EmptyParent,
      arguments_: MutationDeleteArtifactsArguments,
      _context: AuthenticatedContext,
    ): Promise<Mutation['deleteArtifacts']> {
      const { bucketName, keys } = arguments_;
      const response = await deleteObjects(keys, bucketName);
      return response;
    }
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
      const { argoClient, user } = context;
      return await workflowTemplatesForProject(id, user.sub, argoClient);
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
      try {
        return await getProject(projectId, k8sClient, k8sNamespace);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return undefined;
        }
        throw error;
      }
    },
    nodes(
      parent: DryRun,
    ): DryRun['nodes'] {
      const { argoWorkflow } = parent as { argoWorkflow?: ArgoWorkflow };
      if (!argoWorkflow?.status?.nodes) {
        return undefined;
      }
      return Object.values(argoWorkflow.status.nodes)
        .map((node) => convertArgoWorkflowNode(node, argoWorkflow))
        .sort((a, b) => {
          if (a.startedAt && b.startedAt) {
            const startedAtDiff = a.startedAt.localeCompare(b.startedAt);
            if (startedAtDiff !== 0) {
              return startedAtDiff;
            }
            return a.name.localeCompare(b.name);
          }
          if (a.startedAt) {
            return -1;
          }
          if (b.startedAt) {
            return 1;
          }
          return a.name.localeCompare(b.name);
        });
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
      const {
        maxLines, grep, sinceSeconds, sinceTime,
      } = _arguments;
      const { argoClient } = context;
      return await getDryRunNodeLog({
        dryRunNode,
        workflow,
        maxLines: maxLines ?? undefined,
        grep: grep ?? undefined,
        sinceSeconds: sinceSeconds ?? undefined,
        sinceTime: sinceTime ?? undefined,
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
      return await queryPrometheusResolver<'cpuSystemSecondsTotal'>('simpipe_cpu_system_seconds_total', 'main', dryRunNodeMetrics, _arguments);
    },
    /* More concise way. The previous way is to explain what we are doing. */
    cpuUsageSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_cpu_usage_seconds_total', 'main'),
    cpuUserSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_cpu_user_seconds_total', 'main'),
    fileDescriptors: queryPrometheusResolver.bind(undefined, 'simpipe_file_descriptors', 'main'),
    fsInodesFree: queryPrometheusResolver.bind(undefined, 'simpipe_fs_inodes_free', 'main'),
    fsInodesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_inodes_total', 'main'),
    fsIoCurrent: queryPrometheusResolver.bind(undefined, 'simpipe_fs_io_current', 'main'),
    fsIoTimeSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_io_time_seconds_total', 'main'),
    fsIoTimeWeightedSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_io_time_weighted_seconds_total', 'main'),
    fsLimitBytes: queryPrometheusResolver.bind(undefined, 'simpipe_fs_limit_bytes', 'main'),
    fsReadSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_read_seconds_total', 'main'),
    fsReadsMergedTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_reads_merged_total', 'main'),
    fsReadsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_reads_total', 'main'),
    fsSectorReadsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_sector_reads_total', 'main'),
    fsSectorWritesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_sector_writes_total', 'main'),
    fsUsageBytes: queryPrometheusResolver.bind(undefined, 'simpipe_fs_usage_bytes', 'main'),
    fsWriteSecondsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_write_seconds_total', 'main'),
    fsWritesMergedTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_writes_merged_total', 'main'),
    fsWritesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_fs_writes_total', 'main'),
    memoryCache: queryPrometheusResolver.bind(undefined, 'simpipe_memory_cache', 'main'),
    memoryFailcnt: queryPrometheusResolver.bind(undefined, 'simpipe_memory_failcnt', 'main'),
    memoryFailuresTotal: queryPrometheusResolver.bind(undefined, 'simpipe_memory_failures_total', 'main'),
    memoryMappedFile: queryPrometheusResolver.bind(undefined, 'simpipe_memory_mapped_file', 'main'),
    memoryMaxUsageBytes: queryPrometheusResolver.bind(undefined, 'simpipe_memory_max_usage_bytes', 'main'),
    memoryRss: queryPrometheusResolver.bind(undefined, 'simpipe_memory_rss', 'main'),
    memorySwap: queryPrometheusResolver.bind(undefined, 'simpipe_memory_swap', 'main'),
    memoryUsageBytes: queryPrometheusResolver.bind(undefined, 'simpipe_memory_usage_bytes', 'main'),
    memoryWorkingSetBytes: queryPrometheusResolver.bind(undefined, 'simpipe_memory_working_set_bytes', 'main'),
    networkReceiveBytesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_receive_bytes_total', 'POD'),
    networkReceiveErrorsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_receive_errors_total', 'POD'),
    networkReceivePacketsDroppedTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_receive_packets_dropped_total', 'POD'),
    networkReceivePacketsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_receive_packets_total', 'POD'),
    networkTransmitBytesTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_transmit_bytes_total', 'POD'),
    networkTransmitErrorsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_transmit_errors_total', 'POD'),
    networkTransmitPacketsDroppedTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_transmit_packets_dropped_total', 'POD'),
    networkTransmitPacketsTotal: queryPrometheusResolver.bind(undefined, 'simpipe_network_transmit_packets_total', 'POD'),
    processes: queryPrometheusResolver.bind(undefined, 'simpipe_processes', 'main'),
    sockets: queryPrometheusResolver.bind(undefined, 'simpipe_sockets', 'main'),
    threads: queryPrometheusResolver.bind(undefined, 'simpipe_threads', 'main'),
    threadsMax: queryPrometheusResolver.bind(undefined, 'simpipe_threads_max', 'main'),
    ulimitsSoft: queryPrometheusResolver.bind(undefined, 'simpipe_ulimits_soft', 'main'),
  },
  Artifact: {
    async url(
      artifact: Artifact,
    ): Promise<Artifact['url']> {
      const { key, bucketName } = artifact;
      if (!key) {
        return undefined;
      }
      return await computePresignedGetUrl(key, bucketName as string);
    },
    async size(
      artifact: Artifact,
    ): Promise<Artifact['size']> {
      const { key, bucketName } = artifact;
      if (!key) {
        return undefined;
      }
      const filesize = await getObjectSize(key, bucketName as string);
      // console.log('artifact size calc', filesize, key, bucketName, artifact)
      return filesize
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
