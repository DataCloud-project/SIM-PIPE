import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

import {
  parseCarbontrackerAnnotation,
  storeCarbontrackerAnnotation,
} from '../argo/carbontracker-annotation.js';
import {
  assertDryRunNodeHasWorkflow,
  convertArgoWorkflowNode,
  convertArgoWorkflowToDryRun,
  createDryRun, deleteDryRun, dryRunsForNode, dryRunsForProject,
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
import fetchCarbontrackerData from '../carbontracker/carbontracker.js';
import {
  aggregatedNodesMetrics,
  computeScalingLaws,
  extrapolateFromScalingLaws,
} from '../curve_fitting/dry-run-data.js';
import cpuCoresData from '../hardwaremetrics/hardwaremetrics.js';
import { getApiTokenStates, updateApiTokenSecrets } from '../k8s/api-tokens.js';
import assignArgoWorkflowToProject from '../k8s/assign-argoworkflow-to-project.js';
import {
  createDockerRegistryCredential,
  deleteDockerRegistryCredential,
  dockerRegistryCredentials,
  updateDockerRegistryCredential,
} from '../k8s/docker-config-json.js';
import { getK3sClusterSecret, updateK3sClusterSecret } from '../k8s/k3s-cluster-secret.js';
import { SIMPIPE_PROJECT_LABEL } from '../k8s/label.js';
import {
  createProject, deleteProject, getProject, projects, renameProject,
} from '../k8s/projects.js';
import {
  cleanupStaleResource,
  createResource,
  deleteResource,
  resources,
  shutdownResource,
} from '../k8s/resources.js';
import {
  computePresignedGetUrl,
  computePresignedPutUrl,
  createBucket,
  deleteBucket,
  deleteObjects,
  getBucketUserTag,
  getMooseReportForArtifact,
  getObjectMetadata,
  getObjectSize,
  listAllBuckets,
  listAllObjects,
  objectExists,
  setBucketUserTag,
  setMooseReportForArtifact,
} from '../minio/minio.js';
import { getMooseAnalysis } from '../moose/moose.js';
import { assertPrometheusIsHealthy } from '../prometheus/prometheus.js';
import queryPrometheusResolver from '../prometheus/query-prometheus-resolver.js';
import { NotFoundError, PingError } from './apollo-errors.js';
import type { ArgoWorkflow, ArgoWorkflowTemplate } from '../argo/argo-client.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import type K8sClient from '../k8s/k8s-client.js';
import type { ArtifactItem } from '../minio/minio.js';
import type {
  Artifact,
  DryRun,
  DryRunNode,
  DryRunNodeArgs as DryRunNodeArguments,
  DryRunNodeMetrics,
  DryRunNodeMetricsCpuSystemSecondsTotalArgs as DryRunNodeMetricsCpuSystemSecondsTotalArguments,
  DryRunNodePod, DryRunNodePodLogArgs as DryRunNodePodLogArguments,
  Mutation,
  MutationAssignDryRunToProjectArgs as MutationAssignDryRunToProjectArguments,
  MutationCleanupStaleResourceArgs as MutationCleanupStaleResourceArguments,
  MutationComputeUploadPresignedUrlArgs as MutationComputeUploadPresignedUrlArguments,
  MutationCreateBucketArgs as MutationCreateBucketArguments,
  MutationCreateDockerRegistryCredentialArgs as MutationCreateDockerRegistryCredentialArguments,
  MutationCreateDryRunArgs as MutationCreateDryRunArguments,
  MutationCreateProjectArgs as MutationCreateProjectArguments,
  MutationCreateResourceArgs as MutationCreateResourceArguments,
  MutationCreateWorkflowTemplateArgs as MutationCreateWorkflowTemplateArguments,
  MutationDeleteArtifactsArgs as MutationDeleteArtifactsArguments,
  MutationDeleteDockerRegistryCredentialArgs as MutationDeleteDockerRegistryCredentialArguments,
  MutationDeleteDryRunArgs as MutationDeleteDryRunArguments,
  MutationDeleteProjectArgs as MutationDeleteProjectArguments,
  MutationDeleteResourceArgs as MutationDeleteResourceArguments,
  MutationDeleteWorkflowTemplateArgs as MutationDeleteWorkflowTemplateArguments,
  MutationRenameProjectArgs as MutationRenameProjectArguments,
  MutationResolvers,
  MutationResubmitDryRunArgs as MutationResubmitDryRunArguments,
  MutationResumeDryRunArgs as MutationResumeDryRunArguments,
  MutationRetryDryRunArgs as MutationRetryDryRunArguments,
  MutationSetMooseReportArgs as MutationSetMooseReportArguments,
  MutationShutdownResourceArgs as MutationShutdownResourceArguments,
  MutationStopDryRunArgs as MutationStopDryRunArguments,
  MutationStoreCarbontrackerDataArgs as MutationStoreCarbontrackerDataArguments,
  MutationSuspendDryRunArgs as MutationSuspendDryRunArguments,
  MutationUpdateApiTokensArgs as MutationUpdateApiTokensArguments,
  MutationUpdateDockerRegistryCredentialArgs as MutationUpdateDockerRegistryCredentialArguments,
  MutationUpdateK3sClusterSecretArgs as MutationUpdateK3sClusterSecretArguments,
  MutationUpdateWorkflowTemplateArgs as MutationUpdateWorkflowTemplateArguments,
  NodesAggregatedNodeMetrics,
  NodesScalingLaws,
  Project,
  Query,
  QueryArtifactArgs as QueryArtifactArguments,
  QueryArtifactsArgs as QueryArtifactsArguments,
  QueryComputeScalingLawsFromNodesMetricsArgs as QueryComputeScalingLawsFromNodesMetricsArguments,
  QueryDryRunArgs as QueryDryRunArguments,
  QueryFetchCarbontrackerDataArgs as QueryFetchCarbontrackerDataArguments,
  QueryGetAggregatedNodesMetricsArgs as QueryGetAggregatedNodesMetricsArguments,
  QueryGetMooseAnalysisArgs as QueryGetMooseAnalysisArguments,
  QueryPredictScalingArgs as QueryPredictScalingArguments,
  QueryProjectArgs as QueryProjectArguments,
  QueryResolvers,
  QueryWorkflowTemplateArgs as QueryWorkflowTemplateArguments,
  WorkflowTemplate,
} from './schema.js';

const requireJson = createRequire(import.meta.url);

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
    async apiTokens(
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['apiTokens']> {
      const { k8sClient, k8sNamespace } = context;
      return await getApiTokenStates(k8sClient, k8sNamespace);
    },
    async k3sClusterSecret(
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['k3sClusterSecret']> {
      const { k8sClient, k8sNamespace } = context;
      return await getK3sClusterSecret(k8sClient, k8sNamespace);
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
    dryRunsForNode: async (_p: EmptyParent,
      arguments_: { nodeName: string }, context: AuthenticatedContext) => dryRunsForNode(arguments_.nodeName, context.argoClient),
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
      const { user } = context;
      const { sub } = user;
      const allBuckets = await listAllBuckets();
      // System buckets are visible to all authenticated users (their contents are
      // filtered per-user in the `artifacts` resolver).
      const systemBuckets = new Set(['artifacts', 'logs', 'registry']);
      const results = await Promise.all(
        allBuckets.map(async ({ name }) => {
          if (systemBuckets.has(name)) return { name };
          // User-created buckets are only visible to their owner.
          const owner = await getBucketUserTag(name);
          return owner === sub ? { name } : null;
        }),
      );
      return results.filter((b): b is { name: string } => b !== null);
    },
    async resources(
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['resources']> {
      const { k8sClient, k8sNamespace, user } = context;
      const { sub } = user;
      return await resources(k8sClient, k8sNamespace, sub);
    },
    async artifact(
      _p: EmptyParent, arguments_: QueryArtifactArguments,
    ): Promise<Query['artifact']> {
      const { key, bucketName } = arguments_;
      const object = await getObjectMetadata(key, bucketName);
      const returnobject = {
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
      const {
        user, argoClient, k8sClient, k8sNamespace,
      } = context;
      const { sub } = user;
      const systemBuckets = new Set(['artifacts', 'logs', 'registry']);
      const isSystemBucket = !bucketName || systemBuckets.has(bucketName);
      let objects: ArtifactItem[];
      if (isSystemBucket) {
        // For system buckets, only return artifacts that belong to the requesting
        // user's dry runs. Argo stores artifacts at <workflow-name>/... so we
        // filter by the set of dry-run IDs (= Argo workflow names) owned by the user.
        const userProjects = await projects(k8sClient, k8sNamespace, sub);
        const dryRunArrays = await Promise.all(
          userProjects.map((project) => dryRunsForProject(project.id, argoClient)),
        );
        const userDryRunIds = new Set(dryRunArrays.flat().map((dr) => dr.id));
        const allObjects = await listAllObjects(bucketName || undefined);
        objects = allObjects.filter(
          ({ name }) => name !== undefined
            && (
              [...userDryRunIds].some((id) => (name).startsWith(`${id}/`))
              || (name).startsWith(`${sub}/`)
            ),
        );
      } else {
        // For user-created buckets, verify the requesting user is the owner.
        const owner = await getBucketUserTag(bucketName);
        if (owner !== sub) {
          throw new NotAllowedError('Access denied to this bucket');
        }
        objects = await listAllObjects(bucketName);
      }
      const effectiveBucketName = bucketName || undefined;
      const subPrefix = `${sub}/`;
      return objects
        .filter((o): o is ArtifactItem & { name: string } => o.name !== undefined)
        .map(({ name, size }) => ({
          // Strip the user-sub prefix from the display name so that files uploaded
          // directly by the user appear as "sample1.txt" rather than
          // "<uuid>/sample1.txt". The full MinIO key is preserved in `key` so that
          // download presigned URLs and deletes continue to work.
          name: isSystemBucket && name.startsWith(subPrefix) ? name.slice(subPrefix.length) : name,
          key: name,
          size,
          bucketName: effectiveBucketName,
        }));
    },
    async hardwaremetrics(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['hardwaremetrics']> {
      const ncores = cpuCoresData.length;
      const hardwaremetrics = { cpuCores: ncores, cpuCoresData };

      return hardwaremetrics;
    },
    async getAggregatedNodesMetrics(
      _p: EmptyParent, arguments_: QueryGetAggregatedNodesMetricsArguments, context: AuthenticatedContext,
    ): Promise<Query['getAggregatedNodesMetrics']> {
      return aggregatedNodesMetrics(
        arguments_.dryRunIds as string[],
        'main',
        context.argoClient,
        arguments_.aggregateMethod || 'average',
      );
    },
    async computeScalingLawsFromNodesMetrics(
      _p: EmptyParent,
      arguments_: QueryComputeScalingLawsFromNodesMetricsArguments,
      context: AuthenticatedContext,
    ): Promise<Query['computeScalingLawsFromNodesMetrics']> {
      const {
        nodesAggregatedNodeMetrics, dryRunIds, aggregateMethod, regressionMethod, data_x,
      } = arguments_;
      const aggregateMethodUsed = aggregateMethod || 'average';
      const regressionMethodUsed = regressionMethod || 'linear';

      if (dryRunIds && !nodesAggregatedNodeMetrics) {
        const metrics = await aggregatedNodesMetrics(dryRunIds as string[], 'main', context.argoClient, aggregateMethodUsed);
        return computeScalingLaws(metrics, data_x as number[], regressionMethodUsed);
      }
      if (!dryRunIds && nodesAggregatedNodeMetrics) {
        return computeScalingLaws(nodesAggregatedNodeMetrics as NodesAggregatedNodeMetrics[], data_x as number[], regressionMethodUsed);
      }
      throw new Error('Provide either dryRunIds or nodesAggregatedNodeMetrics, and data_x.');
    },
    async predictScaling(
      _p: EmptyParent,
      arguments_: QueryPredictScalingArguments,
      context: AuthenticatedContext,
    ): Promise<Query['predictScaling']> {
      const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        nodesAggregatedNodeMetrics, dryRunIds, aggregateMethod, regressionMethod, data_x_to_predict, data_x,
      } = arguments_;
      const aggregateMethodUsed = aggregateMethod || 'average';
      const regressionMethodUsed = regressionMethod || 'linear';

      let scalingLaws: NodesScalingLaws[];
      if (dryRunIds && !nodesAggregatedNodeMetrics) {
        const metrics = await aggregatedNodesMetrics(dryRunIds as string[], 'main', context.argoClient, aggregateMethodUsed);
        scalingLaws = await computeScalingLaws(metrics, data_x as number[], regressionMethodUsed);
      } else if (!dryRunIds && nodesAggregatedNodeMetrics) {
        scalingLaws = await computeScalingLaws(nodesAggregatedNodeMetrics as NodesAggregatedNodeMetrics[], data_x as number[], regressionMethodUsed);
      } else {
        throw new Error('Provide either dryRunIds or nodesAggregatedNodeMetrics, and data_x.');
      }

      return extrapolateFromScalingLaws(scalingLaws, data_x_to_predict);
    },
    async fetchCarbontrackerData(
      _p: EmptyParent,
      arguments_: QueryFetchCarbontrackerDataArguments,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _context: AuthenticatedContext,
    ): Promise<Query['fetchCarbontrackerData']> {
      const { input } = arguments_;

      return await fetchCarbontrackerData(input);
    },
    async getMooseAnalysis(
      _p: EmptyParent,
      arguments_: QueryGetMooseAnalysisArguments,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _context: AuthenticatedContext,
    ): Promise<Query['getMooseAnalysis']> {
      return await getMooseAnalysis(arguments_);
    },
    async inlumenPipelines(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _p: EmptyParent,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _a: EmptyArguments,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _context: AuthenticatedContext,
    ): Promise<Query['inlumenPipelines']> {
      // TODO: Replace with real inLUMEN API call once endpoint is reachable:
      // const response = await fetch(`${inlumenEndpoint}/agentic_generate_version_yamls`);
      // if (!response.ok) throw new Error(`inLUMEN API error: ${response.status}`);
      // return response.text();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return JSON.stringify(requireJson('../placeholder-inlumen-output.json'));
    },
  } as Required<QueryResolvers<AuthenticatedContext, EmptyParent>>,
  Mutation: {
    async updateApiTokens(
      _p: EmptyParent,
      arguments_: MutationUpdateApiTokensArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['updateApiTokens']> {
      const { k8sClient, k8sNamespace } = context;
      const { mooseApiKey, openrouterApiKey } = arguments_;
      return await updateApiTokenSecrets(k8sClient, k8sNamespace, {
        mooseApiKey: mooseApiKey ?? undefined,
        openrouterApiKey: openrouterApiKey ?? undefined,
      });
    },
    async updateK3sClusterSecret(
      _p: EmptyParent,
      arguments_: MutationUpdateK3sClusterSecretArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['updateK3sClusterSecret']> {
      const { k8sClient, k8sNamespace } = context;
      const { token, serverIp } = arguments_;
      return await updateK3sClusterSecret(k8sClient, k8sNamespace, {
        token: token ?? undefined,
        serverIp: serverIp ?? undefined,
      });
    },
    async createBucket(
      _p: EmptyParent, arguments_: MutationCreateBucketArguments, context: AuthenticatedContext,
    ): Promise<Mutation['createBucket']> {
      const { name } = arguments_;
      const { user } = context;
      if (['artifacts', 'logs', 'registry'].includes(name)) {
        throw new NotAllowedError('Not allowed to create bucket with this name');
      }
      const returnedBucketName = await createBucket(name);
      // Tag the bucket with the owner so listing/access can be scoped per-user.
      await setBucketUserTag(name, user.sub);
      return returnedBucketName;
    },
    async deleteBucket(
      _p: EmptyParent, arguments_: MutationCreateBucketArguments, context: AuthenticatedContext,
    ): Promise<Mutation['deleteBucket']> {
      const { name } = arguments_;
      const { user } = context;
      if (['artifacts', 'logs', 'registry'].includes(name)) {
        throw new NotAllowedError('Not allowed to delete bucket with this name');
      }
      const owner = await getBucketUserTag(name);
      if (owner !== user.sub) {
        throw new NotAllowedError('Not allowed to delete a bucket you do not own');
      }
      return deleteBucket(name);
    },
    async createDryRun(
      _p: EmptyParent,
      arguments_: MutationCreateDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createDryRun']> {
      const { input } = arguments_;
      const { argoWorkflow, dryRunId, projectId, nodeName } = input;
      const { argoClient } = context;
      return await createDryRun({
        argoWorkflow: argoWorkflow as ArgoWorkflow,
        projectId: projectId ?? undefined,
        dryRunId: dryRunId ?? undefined,
        nodeName: nodeName ?? undefined,
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
    async createResource(
      _p: EmptyParent,
      arguments_: MutationCreateResourceArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createResource']> {
      const { input } = arguments_;
      const { k8sClient, k8sNamespace, user } = context;
      const { sub } = user;
      return await createResource(input, k8sClient, k8sNamespace, sub);
    },
    async deleteResource(
      _p: EmptyParent,
      arguments_: MutationDeleteResourceArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['deleteResource']> {
      const { resourceId } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await deleteResource(resourceId, k8sClient, k8sNamespace);
    },
    async cleanupStaleResource(
      _p: EmptyParent,
      arguments_: MutationCleanupStaleResourceArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['cleanupStaleResource']> {
      const { resourceId } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await cleanupStaleResource(resourceId, k8sClient, k8sNamespace);
    },
    async shutdownResource(
      _p: EmptyParent,
      arguments_: MutationShutdownResourceArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['shutdownResource']> {
      const { resourceId } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await shutdownResource(resourceId, k8sClient, k8sNamespace);
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
      const { sub } = context.user;
      // eslint-disable-next-line prefer-const
      let { key, bucketName } = _arguments;
      if (key) {
        if (!isValidFilePath(key)) {
          throw new Error('Key is unsupported for files');
        }
      } else {
        key = randomUUID();
      }

      // For system buckets (or when no bucket is specified), scope uploaded objects
      // under the user's sub prefix so the artifacts resolver can return them only
      // to their owner.  User-created buckets are already isolated by ownership tag.
      const systemBuckets = new Set(['artifacts', 'logs', 'registry']);
      const isSystemBucket = !bucketName || systemBuckets.has(bucketName);
      const objectName = isSystemBucket ? `${sub}/${key}` : key;

      if (bucketName !== null) {
        return await computePresignedPutUrl(objectName, bucketName);
      }
      return await computePresignedPutUrl(objectName);
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
      context: AuthenticatedContext,
    ): Promise<Mutation['deleteArtifacts']> {
      const { bucketName, keys } = arguments_;
      const {
        user, argoClient, k8sClient, k8sNamespace,
      } = context;
      const { sub } = user;
      const systemBuckets = new Set(['artifacts', 'logs', 'registry']);
      if (systemBuckets.has(bucketName)) {
        // Verify all requested keys belong to the user's dry runs.
        const userProjects = await projects(k8sClient, k8sNamespace, sub);
        const dryRunArrays = await Promise.all(
          userProjects.map((project) => dryRunsForProject(project.id, argoClient)),
        );
        const userDryRunIds = new Set(dryRunArrays.flat().map((dr) => dr.id));
        for (const key of keys) {
          const ownedByUser = key.startsWith(`${sub}/`)
            || [...userDryRunIds].some((id) => key.startsWith(`${id}/`));
          if (!ownedByUser) {
            throw new NotAllowedError('Access denied to one or more artifacts');
          }
        }
      } else {
        // For user-created buckets, verify ownership.
        const owner = await getBucketUserTag(bucketName);
        if (owner !== sub) {
          throw new NotAllowedError('Access denied to this bucket');
        }
      }
      const response = await deleteObjects(keys, bucketName);
      return response;
    },
    async setMooseReport(
      _p: EmptyParent,
      arguments_: MutationSetMooseReportArguments,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _context: AuthenticatedContext,
    ): Promise<Mutation['setMooseReport']> {
      const { bucketName, key, report } = arguments_;
      // bucketName is optional; if not provided, the Minio helper
      // will fall back to the default artifacts bucket.
      await setMooseReportForArtifact(key, report, bucketName ?? undefined);
      return true;
    },
    async storeCarbontrackerData(
      _p: EmptyParent,
      arguments_: MutationStoreCarbontrackerDataArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['storeCarbontrackerData']> {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { dryRunId, data } = arguments_;
      const { argoClient, k8sClient, k8sNamespace } = context;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const argoWorkflow = await argoClient.getWorkflow(dryRunId);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await storeCarbontrackerAnnotation(dryRunId, data, argoWorkflow, k8sClient, k8sNamespace);
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
    carbontracker(
      dryRunNode: DryRunNodePod,
    ): DryRunNodePod['carbontracker'] {
      assertDryRunNodeHasWorkflow(dryRunNode);
      const data = parseCarbontrackerAnnotation(dryRunNode.workflow);
      return data[dryRunNode.id] ?? null;
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
      return filesize;
    },
    async mooseReport(
      artifact: Artifact,
    ): Promise<Artifact['mooseReport']> {
      const { key, bucketName } = artifact;
      if (!key) {
        return undefined;
      }

      try {
        const report = await getMooseReportForArtifact(key, bucketName as string | undefined);
        return report ?? undefined;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Moose] Error resolving mooseReport for artifact', {
          key,
          bucketName,
          error,
        });
        return undefined;
      }
    },
    async sotwReportUrl(
      artifact: Artifact,
    ): Promise<Artifact['sotwReportUrl']> {
      const { key, bucketName } = artifact;
      if (!key) {
        return undefined;
      }
      // The SoTW CSV is stored alongside the main artifact with a
      // fixed suffix; we expose a presigned URL for download.
      // Guard against returning a presigned URL for a non-existent object:
      // MinIO responds with 403 on presigned GETs for missing objects on
      // private buckets, which surfaces as a confusing browser error.
      try {
        const sotwKey = `${key}.sotw.csv`;
        if (!(await objectExists(sotwKey, bucketName as string))) {
          return undefined;
        }
        return await computePresignedGetUrl(sotwKey, bucketName as string);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[SoTW] Error resolving sotwReportUrl for artifact', {
          key,
          bucketName,
          error,
        });
        return undefined;
      }
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
