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
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ArgoWorkflow: { input: unknown; output: unknown; }
};

/**  The input data to create a run  */
export type CreateDryRunInput = {
  /**
   *  The raw Argo workflow document.
   *
   * It's project id and and name will be overwritten if provided.
   */
  argoWorkflow: Scalars['ArgoWorkflow']['input'];
  /**  The id of the run (optional), will be generated if not provided  */
  dryRunId?: InputMaybe<Scalars['String']['input']>;
  /**
   *  The project to which this run belongs (optional).
   *
   * The user must own the simulation.
   */
  projectId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProjectInput = {
  /**  The id name of the project (optional)  */
  id?: InputMaybe<Scalars['String']['input']>;
  /**  The name of the project  */
  name: Scalars['String']['input'];
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
  /**  The raw Argo workflow document */
  argoWorkflow: Scalars['ArgoWorkflow']['output'];
  /**  Date of creation  */
  createdAt: Scalars['String']['output'];
  /**  The identifier of the run  */
  id: Scalars['String']['output'];
  /**  The logs of the run  */
  log?: Maybe<Array<Scalars['String']['output']>>;
  /**  The project to which the run belongs  */
  project?: Maybe<Project>;
  /**  Status of the run  */
  status: DryRunStatus;
};


export type DryRunLogArgs = {
  grep?: InputMaybe<Scalars['String']['input']>;
  maxLines?: InputMaybe<Scalars['Int']['input']>;
};

export enum DryRunPhase {
  Error = 'Error',
  Failed = 'Failed',
  Pending = 'Pending',
  Running = 'Running',
  Succeeded = 'Succeeded',
  Unknown = 'Unknown'
}

export type DryRunStatus = {
  __typename?: 'DryRunStatus';
  /**  Estimated duration in seconds  */
  estimatedDuration?: Maybe<Scalars['Int']['output']>;
  /**  Time at which this workflow completed  */
  finishedAt?: Maybe<Scalars['String']['output']>;
  /**  Human readable message indicating details about why the workflow is in this condition  */
  message?: Maybe<Scalars['String']['output']>;
  /**
   *  Phase a simple, high-level summary of where the workflow is in its lifecycle.
   * Will be "Unknown, "Pending", or "Running" before the workflow is completed,
   * and "Succeeded", "Failed" or "Error" once the workflow has completed.
   */
  phase: DryRunPhase;
  /**  Progress to completion  */
  progress?: Maybe<Scalars['String']['output']>;
  /**  The current status of the run  */
  startedAt?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /**  Assign a dry run to a project  */
  assignDryRunToProject: DryRun;
  /**  Create a docker registry credential  */
  createDockerRegistryCredential: DockerRegistryCredential;
  /**
   *  Create a run.
   *
   * projectId and id are optional and will be generated.
   * If provided in the createDryRun arguments, they will overwrite the
   * values in the argoWorkflow document.
   */
  createDryRun: DryRun;
  /**  Create a project  */
  createProject: Project;
  /**  Delete a docker registry credential  */
  deleteDockerRegistryCredential: Scalars['Boolean']['output'];
  /**  Delete a run.  */
  deleteDryRun: Scalars['Boolean']['output'];
  /**  Delete a project  */
  deleteProject: Scalars['Boolean']['output'];
  /**  Rename a project  */
  renameProject: Project;
  /**  Resubmit a run.  */
  resubmitDryRun: DryRun;
  /**  Resume a run.  */
  resumeDryRun: DryRun;
  /**  Retry a run.  */
  retryDryRun: DryRun;
  /**  Stop a run.  */
  stopDryRun: DryRun;
  /**  Suspend a run.  */
  suspendDryRun: DryRun;
  /**  Update a docker registry credential  */
  updateDockerRegistryCredential: DockerRegistryCredential;
};


export type MutationAssignDryRunToProjectArgs = {
  dryRunId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type MutationCreateDockerRegistryCredentialArgs = {
  credential: DockerRegistryCredentialInput;
};


export type MutationCreateDryRunArgs = {
  argoWorkflow: Scalars['ArgoWorkflow']['input'];
  dryRunId?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationDeleteDockerRegistryCredentialArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteDryRunArgs = {
  dryRunId: Scalars['String']['input'];
};


export type MutationDeleteProjectArgs = {
  projectId: Scalars['String']['input'];
};


export type MutationRenameProjectArgs = {
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type MutationResubmitDryRunArgs = {
  dryRunId: Scalars['String']['input'];
};


export type MutationResumeDryRunArgs = {
  dryRunId: Scalars['String']['input'];
};


export type MutationRetryDryRunArgs = {
  dryRunId: Scalars['String']['input'];
};


export type MutationStopDryRunArgs = {
  dryRunId: Scalars['String']['input'];
  terminate?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationSuspendDryRunArgs = {
  dryRunId: Scalars['String']['input'];
};


export type MutationUpdateDockerRegistryCredentialArgs = {
  credential: DockerRegistryCredentialInput;
};

export type Project = {
  __typename?: 'Project';
  /**  Date of creation  */
  createdAt: Scalars['String']['output'];
  /**  The dry runs in the project  */
  dryRuns?: Maybe<Array<DryRun>>;
  /**  The identifier of the project  */
  id: Scalars['String']['output'];
  /**  The name of the project  */
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /**  Compute a presigned URL for uploading a file using a HTTP PUT.  */
  computeUploadPresignedUrl: Scalars['String']['output'];
  /**  List of docker registry credentials.  */
  dockerRegistryCredentials: Array<DockerRegistryCredential>;
  /**  Get a dry run by id  */
  dryRun: DryRun;
  /**  Returns pong if the server is up and running.  */
  ping: Scalars['String']['output'];
  /**  Get a project by id  */
  project: Project;
  /**  List of projects  */
  projects: Array<Project>;
  /**  Fetch the current username.  */
  username: Scalars['String']['output'];
};


export type QueryDryRunArgs = {
  dryRunId: Scalars['String']['input'];
};


export type QueryProjectArgs = {
  projectId: Scalars['String']['input'];
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
  ArgoWorkflow: ResolverTypeWrapper<Scalars['ArgoWorkflow']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateDryRunInput: CreateDryRunInput;
  CreateProjectInput: CreateProjectInput;
  DockerRegistryCredential: ResolverTypeWrapper<DockerRegistryCredential>;
  DockerRegistryCredentialInput: DockerRegistryCredentialInput;
  DryRun: ResolverTypeWrapper<DryRun>;
  DryRunPhase: DryRunPhase;
  DryRunStatus: ResolverTypeWrapper<DryRunStatus>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Project: ResolverTypeWrapper<Project>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ArgoWorkflow: Scalars['ArgoWorkflow']['output'];
  Boolean: Scalars['Boolean']['output'];
  CreateDryRunInput: CreateDryRunInput;
  CreateProjectInput: CreateProjectInput;
  DockerRegistryCredential: DockerRegistryCredential;
  DockerRegistryCredentialInput: DockerRegistryCredentialInput;
  DryRun: DryRun;
  DryRunStatus: DryRunStatus;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Project: Project;
  Query: {};
  String: Scalars['String']['output'];
};

export interface ArgoWorkflowScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ArgoWorkflow'], any> {
  name: 'ArgoWorkflow';
}

export type DockerRegistryCredentialResolvers<ContextType = any, ParentType extends ResolversParentTypes['DockerRegistryCredential'] = ResolversParentTypes['DockerRegistryCredential']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  server?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DryRunResolvers<ContextType = any, ParentType extends ResolversParentTypes['DryRun'] = ResolversParentTypes['DryRun']> = {
  argoWorkflow?: Resolver<ResolversTypes['ArgoWorkflow'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  log?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType, Partial<DryRunLogArgs>>;
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['DryRunStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DryRunStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['DryRunStatus'] = ResolversParentTypes['DryRunStatus']> = {
  estimatedDuration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  finishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phase?: Resolver<ResolversTypes['DryRunPhase'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  assignDryRunToProject?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationAssignDryRunToProjectArgs, 'dryRunId' | 'projectId'>>;
  createDockerRegistryCredential?: Resolver<ResolversTypes['DockerRegistryCredential'], ParentType, ContextType, RequireFields<MutationCreateDockerRegistryCredentialArgs, 'credential'>>;
  createDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationCreateDryRunArgs, 'argoWorkflow'>>;
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'project'>>;
  deleteDockerRegistryCredential?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDockerRegistryCredentialArgs, 'name'>>;
  deleteDryRun?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDryRunArgs, 'dryRunId'>>;
  deleteProject?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'projectId'>>;
  renameProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationRenameProjectArgs, 'name' | 'projectId'>>;
  resubmitDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationResubmitDryRunArgs, 'dryRunId'>>;
  resumeDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationResumeDryRunArgs, 'dryRunId'>>;
  retryDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationRetryDryRunArgs, 'dryRunId'>>;
  stopDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationStopDryRunArgs, 'dryRunId'>>;
  suspendDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationSuspendDryRunArgs, 'dryRunId'>>;
  updateDockerRegistryCredential?: Resolver<ResolversTypes['DockerRegistryCredential'], ParentType, ContextType, RequireFields<MutationUpdateDockerRegistryCredentialArgs, 'credential'>>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dryRuns?: Resolver<Maybe<Array<ResolversTypes['DryRun']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  computeUploadPresignedUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dockerRegistryCredentials?: Resolver<Array<ResolversTypes['DockerRegistryCredential']>, ParentType, ContextType>;
  dryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<QueryDryRunArgs, 'dryRunId'>>;
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<QueryProjectArgs, 'projectId'>>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ArgoWorkflow?: GraphQLScalarType;
  DockerRegistryCredential?: DockerRegistryCredentialResolvers<ContextType>;
  DryRun?: DryRunResolvers<ContextType>;
  DryRunStatus?: DryRunStatusResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

