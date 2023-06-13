import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  json: { input: string; output: string; }
  uuid: { input: string; output: string; }
};

/**  The input data to create a run  */
export type CreateDryRunInput = {
  /**  An optional list of environment variables to set for the steps of the run container  */
  environmentVariables?: InputMaybe<Array<StepEnvironmentVariable>>;
  /**  The name of the run  */
  name: Scalars['String']['input'];
  /**
   *  The simulation to which this run belongs.
   *
   * The user must own the simulation.
   */
  simulationId: Scalars['uuid']['input'];
  /**  An optional list of timeouts to set for the steps of the run container  */
  timeouts?: InputMaybe<Array<StepTimeout>>;
};

export type CreateProjectInput = {
  /**  The id name of the project (optional)  */
  id?: InputMaybe<Scalars['String']['input']>;
  /**  The name of the project  */
  name: Scalars['String']['input'];
};

export type CreateSimulationInput = {
  /**  The name of the simulation  */
  name: Scalars['String']['input'];
  /**
   *  The description of the simulation pipeline.
   *
   * It is a JSON document but it must be sent as a string,
   * because not all GraphQL clients support sending JSON documents
   * in input variables.
   */
  pipelineDescription: Scalars['json']['input'];
};

export type DockerRegistryCredential = {
  __typename?: 'DockerRegistryCredential';
  /**  The name of the docker registry  */
  name: Scalars['String']['output'];
  /**  The docker registry endpoint  */
  server: Scalars['String']['output'];
  /**  The username to use when authenticating with the docker registry  */
  username: Scalars['String']['output'];
};

export type DockerRegistryCredentialInput = {
  /**  The name of the docker registry  */
  name: Scalars['String']['input'];
  /**  The password to use when authenticating with the docker registry  */
  password: Scalars['String']['input'];
  /**  The docker registry endpoint  */
  server: Scalars['String']['input'];
  /**  The username to use when authenticating with the docker registry  */
  username: Scalars['String']['input'];
};

export type DryRun = {
  __typename?: 'DryRun';
  /**  UUID of the run  */
  runId: Scalars['uuid']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**  Cancel a run, if the run is running it will be stopped  */
  cancelDryRun?: Maybe<DryRun>;
  /**  Create a docker registry credential  */
  createDockerRegistryCredential: DockerRegistryCredential;
  /**  Create a run, but does not start it  */
  createDryRun: DryRun;
  /**  Create a project  */
  createProject: Project;
  /**  Create a simulation  */
  createSimulation: Simulation;
  /**  Delete a docker registry credential  */
  deleteDockerRegistryCredential: Scalars['Boolean']['output'];
  /**  Start a run, if other runs are running this run will wait in the queue  */
  startDryRun?: Maybe<DryRun>;
  /**  Update a docker registry credential  */
  updateDockerRegistryCredential: DockerRegistryCredential;
};


export type MutationCancelDryRunArgs = {
  runId: Scalars['uuid']['input'];
};


export type MutationCreateDockerRegistryCredentialArgs = {
  credential: DockerRegistryCredentialInput;
};


export type MutationCreateDryRunArgs = {
  run: CreateDryRunInput;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationCreateSimulationArgs = {
  simulation: CreateSimulationInput;
};


export type MutationDeleteDockerRegistryCredentialArgs = {
  name: Scalars['String']['input'];
};


export type MutationStartDryRunArgs = {
  runId: Scalars['uuid']['input'];
};


export type MutationUpdateDockerRegistryCredentialArgs = {
  credential: DockerRegistryCredentialInput;
};

export type Project = {
  __typename?: 'Project';
  /**  Date of creation  */
  createdAt: Scalars['String']['output'];
  /**  The dry runs in the project  */
  dryRuns: Array<DryRun>;
  /**  The identifier of the project  */
  id: Scalars['uuid']['output'];
  /**  The name of the project  */
  name: Scalars['String']['output'];
  /**  Date of last update  */
  updatedAt: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /**  Compute a presigned URL for uploading a file using a HTTP PUT.  */
  computeUploadPresignedUrl: Scalars['String']['output'];
  /**  List of docker registry credentials.  */
  dockerRegistryCredentials: Array<DockerRegistryCredential>;
  /**  Returns pong if the server is up and running.  */
  ping: Scalars['String']['output'];
  /**  List of projects  */
  projects: Array<Project>;
  /**  Fetch the current username.  */
  username: Scalars['String']['output'];
};

export type Simulation = {
  __typename?: 'Simulation';
  /**  UUID of the simulation  */
  simulationId: Scalars['uuid']['output'];
};

export type StepEnvironmentVariable = {
  /**  The name of the environment variable  */
  name: Scalars['String']['input'];
  /**  The name of the step to set the environment variable for  */
  stepName: Scalars['String']['input'];
  /**  The value of the environment variable  */
  value: Scalars['String']['input'];
};

export type StepTimeout = {
  /**  The name of the step to set the timeout for  */
  stepName: Scalars['String']['input'];
  /**  The timeout in seconds, must be greater than 0 and less than 86400 (24 hours)  */
  timeout: Scalars['Int']['input'];
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateDryRunInput: CreateDryRunInput;
  CreateProjectInput: CreateProjectInput;
  CreateSimulationInput: CreateSimulationInput;
  DockerRegistryCredential: ResolverTypeWrapper<DockerRegistryCredential>;
  DockerRegistryCredentialInput: DockerRegistryCredentialInput;
  DryRun: ResolverTypeWrapper<DryRun>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Project: ResolverTypeWrapper<Project>;
  Query: ResolverTypeWrapper<{}>;
  Simulation: ResolverTypeWrapper<Simulation>;
  StepEnvironmentVariable: StepEnvironmentVariable;
  StepTimeout: StepTimeout;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  json: ResolverTypeWrapper<Scalars['json']['output']>;
  uuid: ResolverTypeWrapper<Scalars['uuid']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateDryRunInput: CreateDryRunInput;
  CreateProjectInput: CreateProjectInput;
  CreateSimulationInput: CreateSimulationInput;
  DockerRegistryCredential: DockerRegistryCredential;
  DockerRegistryCredentialInput: DockerRegistryCredentialInput;
  DryRun: DryRun;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Project: Project;
  Query: {};
  Simulation: Simulation;
  StepEnvironmentVariable: StepEnvironmentVariable;
  StepTimeout: StepTimeout;
  String: Scalars['String']['output'];
  json: Scalars['json']['output'];
  uuid: Scalars['uuid']['output'];
};

export type DockerRegistryCredentialResolvers<ContextType = any, ParentType extends ResolversParentTypes['DockerRegistryCredential'] = ResolversParentTypes['DockerRegistryCredential']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  server?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DryRunResolvers<ContextType = any, ParentType extends ResolversParentTypes['DryRun'] = ResolversParentTypes['DryRun']> = {
  runId?: Resolver<ResolversTypes['uuid'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  cancelDryRun?: Resolver<Maybe<ResolversTypes['DryRun']>, ParentType, ContextType, RequireFields<MutationCancelDryRunArgs, 'runId'>>;
  createDockerRegistryCredential?: Resolver<ResolversTypes['DockerRegistryCredential'], ParentType, ContextType, RequireFields<MutationCreateDockerRegistryCredentialArgs, 'credential'>>;
  createDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationCreateDryRunArgs, 'run'>>;
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'project'>>;
  createSimulation?: Resolver<ResolversTypes['Simulation'], ParentType, ContextType, RequireFields<MutationCreateSimulationArgs, 'simulation'>>;
  deleteDockerRegistryCredential?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDockerRegistryCredentialArgs, 'name'>>;
  startDryRun?: Resolver<Maybe<ResolversTypes['DryRun']>, ParentType, ContextType, RequireFields<MutationStartDryRunArgs, 'runId'>>;
  updateDockerRegistryCredential?: Resolver<ResolversTypes['DockerRegistryCredential'], ParentType, ContextType, RequireFields<MutationUpdateDockerRegistryCredentialArgs, 'credential'>>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dryRuns?: Resolver<Array<ResolversTypes['DryRun']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['uuid'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  computeUploadPresignedUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dockerRegistryCredentials?: Resolver<Array<ResolversTypes['DockerRegistryCredential']>, ParentType, ContextType>;
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  DockerRegistryCredential?: DockerRegistryCredentialResolvers<ContextType>;
  DryRun?: DryRunResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Simulation?: SimulationResolvers<ContextType>;
  json?: GraphQLScalarType;
  uuid?: GraphQLScalarType;
};

