import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  json: string;
  uuid: string;
};

/**  The input data to create a run  */
export type CreateRunInput = {
  /**  An optional list of environment variables to set for the steps of the run container  */
  environmentVariables?: InputMaybe<Array<StepEnvironmentVariable>>;
  /**  The name of the run  */
  name: Scalars['String'];
  /**
   *  The simulation to which this run belongs.
   *
   * The user must own the simulation.
   */
  simulationId: Scalars['uuid'];
  /**  An optional list of timeouts to set for the steps of the run container  */
  timeouts?: InputMaybe<Array<StepTimeout>>;
};

export type CreateSimulationInput = {
  /**  The name of the simulation  */
  name: Scalars['String'];
  /**
   *  The description of the simulation pipeline.
   *
   * It is a JSON document but it must be sent as a string,
   * because not all GraphQL clients support sending JSON documents
   * in input variables.
   */
  pipelineDescription: Scalars['json'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**  Cancel a run, if the run is running it will be stopped  */
  cancelRun?: Maybe<Run>;
  /**  Create a run, but does not start it  */
  createRun: Run;
  /**  Create a simulation  */
  createSimulation: Simulation;
  /**  Start a run, if other runs are running this run will wait in the queue  */
  startRun?: Maybe<Run>;
};


export type MutationCancelRunArgs = {
  runId: Scalars['uuid'];
};


export type MutationCreateRunArgs = {
  run: CreateRunInput;
};


export type MutationCreateSimulationArgs = {
  simulation: CreateSimulationInput;
};


export type MutationStartRunArgs = {
  runId: Scalars['uuid'];
};

export type Query = {
  __typename?: 'Query';
  /**  Compute a presigned URL for uploading a file using a HTTP PUT.  */
  computeUploadPresignedUrl: Scalars['String'];
  /**  Returns pong if the server is up and running.  */
  ping: Scalars['String'];
  /**  Fetch the current username.  */
  username: Scalars['String'];
};

export type Run = {
  __typename?: 'Run';
  /**  UUID of the run  */
  runId: Scalars['uuid'];
};

export type Simulation = {
  __typename?: 'Simulation';
  /**  UUID of the simulation  */
  simulationId: Scalars['uuid'];
};

export type StepEnvironmentVariable = {
  /**  The name of the environment variable  */
  name: Scalars['String'];
  /**  The name of the step to set the environment variable for  */
  stepName: Scalars['String'];
  /**  The value of the environment variable  */
  value: Scalars['String'];
};

export type StepTimeout = {
  /**  The name of the step to set the timeout for  */
  stepName: Scalars['String'];
  /**  The timeout in seconds, must be greater than 0 and less than 86400 (24 hours)  */
  timeout: Scalars['Int'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateRunInput: CreateRunInput;
  CreateSimulationInput: CreateSimulationInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Run: ResolverTypeWrapper<Run>;
  Simulation: ResolverTypeWrapper<Simulation>;
  StepEnvironmentVariable: StepEnvironmentVariable;
  StepTimeout: StepTimeout;
  String: ResolverTypeWrapper<Scalars['String']>;
  json: ResolverTypeWrapper<Scalars['json']>;
  uuid: ResolverTypeWrapper<Scalars['uuid']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateRunInput: CreateRunInput;
  CreateSimulationInput: CreateSimulationInput;
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  Run: Run;
  Simulation: Simulation;
  StepEnvironmentVariable: StepEnvironmentVariable;
  StepTimeout: StepTimeout;
  String: Scalars['String'];
  json: Scalars['json'];
  uuid: Scalars['uuid'];
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  cancelRun?: Resolver<Maybe<ResolversTypes['Run']>, ParentType, ContextType, RequireFields<MutationCancelRunArgs, 'runId'>>;
  createRun?: Resolver<ResolversTypes['Run'], ParentType, ContextType, RequireFields<MutationCreateRunArgs, 'run'>>;
  createSimulation?: Resolver<ResolversTypes['Simulation'], ParentType, ContextType, RequireFields<MutationCreateSimulationArgs, 'simulation'>>;
  startRun?: Resolver<Maybe<ResolversTypes['Run']>, ParentType, ContextType, RequireFields<MutationStartRunArgs, 'runId'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  computeUploadPresignedUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type RunResolvers<ContextType = any, ParentType extends ResolversParentTypes['Run'] = ResolversParentTypes['Run']> = {
  runId?: Resolver<ResolversTypes['uuid'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SimulationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Simulation'] = ResolversParentTypes['Simulation']> = {
  simulationId?: Resolver<ResolversTypes['uuid'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['json'], any> {
  name: 'json';
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['uuid'], any> {
  name: 'uuid';
}

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Run?: RunResolvers<ContextType>;
  Simulation?: SimulationResolvers<ContextType>;
  json?: GraphQLScalarType;
  uuid?: GraphQLScalarType;
};




export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;