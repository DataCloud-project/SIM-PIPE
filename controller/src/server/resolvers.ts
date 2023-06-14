import { randomUUID } from 'node:crypto';
import type K8sClient from 'k8s/k8s-client.js';

import { getDryRun } from '../argo/dry-runs.js';
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
import { PingError } from './apollo-errors.js';
import * as functions from './functions.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import type {
  Mutation,
  MutationCancelDryRunArgs as MutationCancelDryRunArguments,
  MutationCreateDockerRegistryCredentialArgs as MutationCreateDockerRegistryCredentialArguments,
  MutationCreateDryRunArgs as MutationCreateDryRunArguments,
  MutationCreateProjectArgs as MutationCreateProjectArguments,
  MutationDeleteDockerRegistryCredentialArgs as MutationDeleteDockerRegistryCredentialArguments,
  MutationDeleteProjectArgs as MutationDeleteProjectArguments,
  MutationRenameProjectArgs as MutationRenameProjectArguments,
  MutationResolvers,
  MutationStartDryRunArgs as MutationStartDryRunArguments,
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
      const { k8sClient, k8sNamespace } = context;
      return await projects(k8sClient, k8sNamespace);
    },
    async project(
      _p: EmptyParent, arguments_: QueryProjectArguments, context: AuthenticatedContext,
    ): Promise<Query['project']> {
      const { k8sClient, k8sNamespace } = context;
      const { id } = arguments_;
      return await getProject(id, k8sClient, k8sNamespace);
    },
    async dryRun(
      _p: EmptyParent, arguments_: QueryDryRunArguments, context: AuthenticatedContext,
    ): Promise<Query['dryRun']> {
      const { id } = arguments_;
      const { argoClient } = context;
      return await getDryRun(id, argoClient);
    },
  } as Required<QueryResolvers<AuthenticatedContext, EmptyParent>>,
  Mutation: {
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
      return await createProject(project, k8sClient, k8sNamespace);
    },
    async renameProject(
      _p: EmptyParent,
      arguments_: MutationRenameProjectArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['renameProject']> {
      const { id, name } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await renameProject(id, name, k8sClient, k8sNamespace);
    },
    async deleteProject(
      _p: EmptyParent,
      arguments_: MutationDeleteProjectArguments,
      context: AuthenticatedContext,
    ): Promise<Mutation['deleteProject']> {
      const { id } = arguments_;
      const { k8sClient, k8sNamespace } = context;
      return await deleteProject(id, k8sClient, k8sNamespace);
    },
  } as Required<MutationResolvers<AuthenticatedContext, EmptyParent>>,
  Project: {
    async dryRuns(
      parent: Project,
      _a: EmptyArguments,
      context: AuthenticatedContext,
    ): Promise<Project['dryRuns']> {
      return [{ runId: 'toto' }];
    },
  },
};

export default resolvers;
