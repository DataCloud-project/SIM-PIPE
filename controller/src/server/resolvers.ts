import { randomUUID } from 'node:crypto';
import type K8sClient from 'k8s/k8s-client.js';

import {
  createDockerRegistryCredential,
  deleteDockerRegistryCredential,
  dockerRegistryCredentials,
  updateDockerRegistryCredential,
} from '../k8s/docker-config-json.js';
import { createProject } from '../k8s/projects.js';
import { computePresignedPutUrl } from '../minio/minio.js';
import { PingError } from './apollo-errors.js';
import * as functions from './functions.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import type {
  Mutation,
  MutationCancelDryRunArgs as MutationCancelDryRunArguments,
  MutationCreateDockerRegistryCredentialArgs as MutationCreateDockerRegistryCredentialArguments,
  MutationCreateDryRunArgs as MutationCreateDryRunArguments,
  MutationCreateProjectArgs as MutationCreateProjectArguments,
  MutationCreateSimulationArgs as MutationCreateSimulationArguments,
  MutationDeleteDockerRegistryCredentialArgs as MutationDeleteDockerRegistryCredentialArguments,
  MutationResolvers,
  MutationStartDryRunArgs as MutationStartDryRunArguments,
  MutationUpdateDockerRegistryCredentialArgs as MutationUpdateDockerRegistryCredentialArguments,
  Query,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['dockerRegistryCredentials']> {
      const { k8sClient, k8sNamespace } = context;
      return await dockerRegistryCredentials(k8sClient, k8sNamespace);
    },
    async projects(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext,
    ): Promise<Query['projects']> {
      return [];
    },
  } as Required<QueryResolvers<AuthenticatedContext, EmptyParent>>,
  Mutation: {
    async createSimulation(
      _p: EmptyParent,
      arguments_: MutationCreateSimulationArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createSimulation']> {
      const { name, pipelineDescription } = arguments_.simulation;
      const { sub: userId } = context.user;
      const simulationId = await functions.createSimulation({
        name, pipelineDescription, userId,
      });
      return { simulationId };
    },
    async createDryRun(
      _p: EmptyParent,
      arguments_: MutationCreateDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['createDryRun']> {
      const { simulationId, name } = arguments_.run;
      const { sub: userId } = context.user;
      await functions.checkSimulationOwner(simulationId, userId);
      const runId = await functions.createRun(simulationId, name);
      // TODO do something about timeouts and envs
      return { runId };
    },
    async startDryRun(
      _p: EmptyParent,
      arguments_: MutationStartDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['startDryRun']> {
      const { runId } = arguments_;
      const { sub: userId } = context.user;
      await functions.checkRunOwner(runId, userId);
      return { runId };
    },
    async cancelDryRun(
      _p: EmptyParent,
      arguments_: MutationCancelDryRunArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['cancelDryRun']> {
      const { runId } = arguments_;
      const { sub: userId } = context.user;
      await functions.checkRunOwner(runId, userId);
      throw new Error('Not implemented');
      // return { runId };
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
      const response = await createProject(project, k8sClient, k8sNamespace);
      return {
        name: response.name,
        id: response.id,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        dryRuns: [],
      };
    },
  } as Required<MutationResolvers<AuthenticatedContext, EmptyParent>>,
};

export default resolvers;
