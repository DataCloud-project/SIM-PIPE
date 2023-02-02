import sdk from '../db/sdk.js';
import { FeatureDisabledError, PingError } from './apollo-errors.js';
import * as functions from './functions.js';
import type {
  MutationCancelRunArgs as MutationCancelRunArguments,
  MutationCreateRunArgs as MutationCreateRunArguments,
  MutationCreateSimulationArgs as MutationCreateSimulationArguments,
  MutationResolvers,
  MutationStartRunArgs as MutationStartRunArguments,
  QueryResolvers,
  Run, Simulation,
} from './schema.js';

interface ContextUser {
  sub: string
  username: string
}

export interface Context {
  user?: ContextUser
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
    username(_p: EmptyParent, _a: EmptyArguments, context: AuthenticatedContext): string {
      return context.user.username;
    },
    async ping(): Promise<string> {
      try {
        await Promise.all([
          sdk.ping(),
        ]);
      } catch (error) {
        throw new PingError(error as Error);
      }

      return 'pong';
    },
    async computeUploadPresignedUrl(): Promise<string> {
      throw new FeatureDisabledError('Uploads are disabled');
    },
  } as QueryResolvers<AuthenticatedContext, EmptyParent>,
  Mutation: {
    async createSimulation(
      _p: EmptyParent,
      arguments_: MutationCreateSimulationArguments,
      context: AuthenticatedContext,
    ): Promise<Simulation> {
      const { name, pipelineDescription } = arguments_.simulation;
      const { sub: userId } = context.user;
      const simulationId = await functions.createSimulation({
        name, pipelineDescription, userId,
      });
      return { simulationId };
    },
    async createRun(
      _p: EmptyParent,
      arguments_: MutationCreateRunArguments,
      context: AuthenticatedContext,
    ): Promise<Run> {
      const { simulationId, name } = arguments_.run;
      const { sub: userId } = context.user;
      await functions.checkSimulationOwner(simulationId, userId);
      const runId = await functions.createRun(simulationId, name);
      // TODO do something about timeouts and envs
      return { runId };
    },
    async startRun(
      _p: EmptyParent,
      arguments_: MutationStartRunArguments,
      context: AuthenticatedContext,
    ): Promise<Run> {
      const { runId } = arguments_;
      const { sub: userId } = context.user;
      await functions.checkRunOwner(runId, userId);
      await functions.queueRun(runId, userId);
      return { runId };
    },
    async cancelRun(
      _p: EmptyParent,
      arguments_: MutationCancelRunArguments,
      context: AuthenticatedContext,
    ): Promise<Run> {
      const { runId } = arguments_;
      const { sub: userId } = context.user;
      await functions.checkRunOwner(runId, userId);
      await functions.stopRun(runId, userId);
      return { runId };
    },
  } as MutationResolvers<AuthenticatedContext, EmptyParent>,
};

export default resolvers;
