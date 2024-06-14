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
  /**  ArgoWorkflow is the definition of an executable pipeline in Argo. This definition includes all the details about the specific workflow instance you want to run, including the sequence of steps, inputs, outputs, and other configuration parameters. This is required to create and start dry runs in SIM-PIPE.  */
  ArgoWorkflow: { input: unknown; output: unknown; }
  /**  Workflow Templates in Argo that are reusable and parameterized workflow definitions. They allow you to define a generic workflow structure that can be instantiated multiple times with different input parameters  */
  ArgoWorkflowTemplate: { input: unknown; output: unknown; }
  /**
   * Prometheus represents number as strings in JSON, because
   * the numbers in JSON are not accurate enough and doesn't support very large numbers.
   * This is because they are represented as  IEE 754 floating point numbers,
   * which are not accurate and do not represents numbers above 2^53 accurately.
   * The overhead is minimal as the numbers are represented as strings in JSON anyway.
   * You will need to parse the string to a number in your application.
   */
  PrometheusStringNumber: { input: string; output: string; }
  /**  A value that represents a specific point in time, includes information such as the date and time, and time zone offset  */
  TimeStamp: { input: number; output: number; }
};

export type AggregatedNodeMetrics = {
  __typename?: 'AggregatedNodeMetrics';
  cpu: Array<Scalars['Float']['output']>;
  duration: Array<Scalars['Float']['output']>;
  fileSize: Array<Scalars['Float']['output']>;
  mem: Array<Scalars['Float']['output']>;
  nodeId: Array<Scalars['String']['output']>;
};

/**  Contains information about files produced during a dry run execution  */
export type Artifact = {
  __typename?: 'Artifact';
  /**  The name of the bucket that holds the artifact  */
  bucketName?: Maybe<Scalars['String']['output']>;
  /**  The artifact path  */
  key?: Maybe<Scalars['String']['output']>;
  /**  The artifact name  */
  name: Scalars['String']['output'];
  /**  The artifact size  */
  size?: Maybe<Scalars['Int']['output']>;
  /**  URL to download the artifact using an HTTP GET. */
  url?: Maybe<Scalars['String']['output']>;
};

/**  Artifact metadata  */
export type ArtifactMetadata = {
  __typename?: 'ArtifactMetadata';
  /**  Unique identifier of the artifact  */
  etag?: Maybe<Scalars['String']['output']>;
  /**  Last modified date  */
  lastModified?: Maybe<Scalars['String']['output']>;
  /**  Artifact metadata  */
  metaData?: Maybe<Scalars['String']['output']>;
  /**  The artifact size  */
  size?: Maybe<Scalars['Int']['output']>;
};

export type Bucket = {
  __typename?: 'Bucket';
  /**  The bucket name  */
  name: Scalars['String']['output'];
};

/**  The input data to create a new dry run  */
export type CreateDryRunInput = {
  /**
   *  The raw Argo workflow document.
   *
   * It's project id and and name will be overwritten if provided.
   */
  argoWorkflow: Scalars['ArgoWorkflow']['input'];
  /**  The id of the dry run (optional), will be generated if not provided  */
  dryRunId?: InputMaybe<Scalars['String']['input']>;
  /**
   *  The project to which this dry run belongs (optional).
   *
   * The user must own the simulation.
   */
  projectId?: InputMaybe<Scalars['String']['input']>;
};

/**  The input data to create a new project.  */
export type CreateProjectInput = {
  /**  The id name of the project (optional)  */
  id?: InputMaybe<Scalars['String']['input']>;
  /**  The name of the project  */
  name: Scalars['String']['input'];
};

/**  The input data to create a workflow template  */
export type CreateWorkflowTemplateInput = {
  /**  The raw Argo workflow document  */
  argoWorkflowTemplate: Scalars['ArgoWorkflowTemplate']['input'];
  /**  The name of the workflow template, will be generated if not provided  */
  name?: InputMaybe<Scalars['String']['input']>;
  /**  The project to which this workflow template belongs  */
  projectId?: InputMaybe<Scalars['String']['input']>;
};

/**  Contains details of a docker registry  */
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

/**  Dry runs are created under a project which represents an executable instance of the pipeline.  */
export type DryRun = {
  __typename?: 'DryRun';
  /**  The raw Argo workflow document */
  argoWorkflow: Scalars['ArgoWorkflow']['output'];
  /**  Date of creation  */
  createdAt: Scalars['String']['output'];
  /**  The identifier of the dry run  */
  id: Scalars['String']['output'];
  /**  A node of the dry run, by id  */
  node?: Maybe<DryRunNode>;
  /**  The nodes of the dry run  */
  nodes?: Maybe<Array<DryRunNode>>;
  /**  The project to which the dry run belongs  */
  project?: Maybe<Project>;
  /**  Status of the dry run  */
  status: DryRunStatus;
};


/**  Dry runs are created under a project which represents an executable instance of the pipeline.  */
export type DryRunNodeArgs = {
  id: Scalars['String']['input'];
};

export type DryRunNode = {
  /**  The children of the node  */
  children?: Maybe<Array<DryRunNode>>;
  /**  Display name of the node  */
  displayName?: Maybe<Scalars['String']['output']>;
  /**  The duration of the node in seconds  */
  duration?: Maybe<Scalars['Int']['output']>;
  /**  The time at which the node finished  */
  finishedAt?: Maybe<Scalars['String']['output']>;
  /**  ID of the node  */
  id: Scalars['String']['output'];
  /**  The name of the node  */
  name: Scalars['String']['output'];
  /**  The phase of the node  */
  phase: DryRunNodePhase;
  /**  The progress of the node  */
  progress?: Maybe<Scalars['String']['output']>;
  /**  The time at which the node started  */
  startedAt?: Maybe<Scalars['String']['output']>;
  /**  The template name of the node  */
  templateName?: Maybe<Scalars['String']['output']>;
  /**  The type of the node  */
  type: DryRunNodeType;
};

/**  Prometheus metrics for the node.  */
export type DryRunNodeMetrics = {
  __typename?: 'DryRunNodeMetrics';
  cpuSystemSecondsTotal?: Maybe<Array<PrometheusSample>>;
  cpuUsageSecondsTotal?: Maybe<Array<PrometheusSample>>;
  cpuUserSecondsTotal?: Maybe<Array<PrometheusSample>>;
  fileDescriptors?: Maybe<Array<PrometheusSample>>;
  fsInodesFree?: Maybe<Array<PrometheusSample>>;
  fsInodesTotal?: Maybe<Array<PrometheusSample>>;
  fsIoCurrent?: Maybe<Array<PrometheusSample>>;
  fsIoTimeSecondsTotal?: Maybe<Array<PrometheusSample>>;
  fsIoTimeWeightedSecondsTotal?: Maybe<Array<PrometheusSample>>;
  fsLimitBytes?: Maybe<Array<PrometheusSample>>;
  fsReadSecondsTotal?: Maybe<Array<PrometheusSample>>;
  fsReadsMergedTotal?: Maybe<Array<PrometheusSample>>;
  fsReadsTotal?: Maybe<Array<PrometheusSample>>;
  fsSectorReadsTotal?: Maybe<Array<PrometheusSample>>;
  fsSectorWritesTotal?: Maybe<Array<PrometheusSample>>;
  fsUsageBytes?: Maybe<Array<PrometheusSample>>;
  fsWriteSecondsTotal?: Maybe<Array<PrometheusSample>>;
  fsWritesMergedTotal?: Maybe<Array<PrometheusSample>>;
  fsWritesTotal?: Maybe<Array<PrometheusSample>>;
  memoryCache?: Maybe<Array<PrometheusSample>>;
  memoryFailcnt?: Maybe<Array<PrometheusSample>>;
  memoryFailuresTotal?: Maybe<Array<PrometheusSample>>;
  memoryMappedFile?: Maybe<Array<PrometheusSample>>;
  memoryMaxUsageBytes?: Maybe<Array<PrometheusSample>>;
  memoryRss?: Maybe<Array<PrometheusSample>>;
  memorySwap?: Maybe<Array<PrometheusSample>>;
  memoryUsageBytes?: Maybe<Array<PrometheusSample>>;
  memoryWorkingSetBytes?: Maybe<Array<PrometheusSample>>;
  networkReceiveBytesTotal?: Maybe<Array<PrometheusSample>>;
  networkReceiveErrorsTotal?: Maybe<Array<PrometheusSample>>;
  networkReceivePacketsDroppedTotal?: Maybe<Array<PrometheusSample>>;
  networkReceivePacketsTotal?: Maybe<Array<PrometheusSample>>;
  networkTransmitBytesTotal?: Maybe<Array<PrometheusSample>>;
  networkTransmitErrorsTotal?: Maybe<Array<PrometheusSample>>;
  networkTransmitPacketsDroppedTotal?: Maybe<Array<PrometheusSample>>;
  networkTransmitPacketsTotal?: Maybe<Array<PrometheusSample>>;
  processes?: Maybe<Array<PrometheusSample>>;
  sockets?: Maybe<Array<PrometheusSample>>;
  threads?: Maybe<Array<PrometheusSample>>;
  threadsMax?: Maybe<Array<PrometheusSample>>;
  ulimitsSoft?: Maybe<Array<PrometheusSample>>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsCpuSystemSecondsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsCpuUsageSecondsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsCpuUserSecondsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFileDescriptorsArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsInodesFreeArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsInodesTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsIoCurrentArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsIoTimeSecondsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsIoTimeWeightedSecondsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsLimitBytesArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsReadSecondsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsReadsMergedTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsReadsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsSectorReadsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsSectorWritesTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsUsageBytesArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsWriteSecondsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsWritesMergedTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsFsWritesTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsMemoryCacheArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsMemoryFailcntArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsMemoryFailuresTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsMemoryMappedFileArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsMemoryMaxUsageBytesArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsMemoryRssArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsMemorySwapArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsMemoryUsageBytesArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsMemoryWorkingSetBytesArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsNetworkReceiveBytesTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsNetworkReceiveErrorsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsNetworkReceivePacketsDroppedTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsNetworkReceivePacketsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsNetworkTransmitBytesTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsNetworkTransmitErrorsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsNetworkTransmitPacketsDroppedTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsNetworkTransmitPacketsTotalArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsProcessesArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsSocketsArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsThreadsArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsThreadsMaxArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};


/**  Prometheus metrics for the node.  */
export type DryRunNodeMetricsUlimitsSoftArgs = {
  end?: InputMaybe<Scalars['TimeStamp']['input']>;
  start?: InputMaybe<Scalars['TimeStamp']['input']>;
  step?: InputMaybe<Scalars['Int']['input']>;
};

export type DryRunNodeMisc = DryRunNode & {
  __typename?: 'DryRunNodeMisc';
  children?: Maybe<Array<DryRunNode>>;
  displayName?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  finishedAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phase: DryRunNodePhase;
  progress?: Maybe<Scalars['String']['output']>;
  startedAt?: Maybe<Scalars['String']['output']>;
  templateName?: Maybe<Scalars['String']['output']>;
  type: DryRunNodeType;
};

/**  The phase of a dry run node  */
export enum DryRunNodePhase {
  /**  Node had an error other than a non 0 exit code  */
  Error = 'Error',
  /**  Node or child node exicited with non-0 exit code  */
  Failed = 'Failed',
  /**  Node was omitted because its depends condition was not met  */
  Omitted = 'Omitted',
  /**  Node is waiting to run  */
  Pending = 'Pending',
  /**  Node is running  */
  Running = 'Running',
  /**  Node was skipped  */
  Skipped = 'Skipped',
  /**  Node finished successfully  */
  Succeeded = 'Succeeded',
  /**  Unknown phase. Shouldn't happen.  */
  Unknown = 'Unknown'
}

export type DryRunNodePod = DryRunNode & {
  __typename?: 'DryRunNodePod';
  children?: Maybe<Array<DryRunNode>>;
  displayName?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  /**  The exit code of the node, if exited  */
  exitCode?: Maybe<Scalars['String']['output']>;
  finishedAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  /**  Input artifacts of the node.  */
  inputArtifacts?: Maybe<Array<Artifact>>;
  /**  The logs of the node.  */
  log?: Maybe<Array<Scalars['String']['output']>>;
  /**  The name of the pod.  */
  metrics: DryRunNodeMetrics;
  name: Scalars['String']['output'];
  /**  Output artifacts of the node.  */
  outputArtifacts?: Maybe<Array<Artifact>>;
  phase: DryRunNodePhase;
  /**  The name of the pod.  */
  podName: Scalars['String']['output'];
  progress?: Maybe<Scalars['String']['output']>;
  /**  Resources durations. Estimation from Argo, usually pretty not accurate  */
  resourcesDuration?: Maybe<DryRunNodeResourceDuration>;
  startedAt?: Maybe<Scalars['String']['output']>;
  templateName?: Maybe<Scalars['String']['output']>;
  type: DryRunNodeType;
};


export type DryRunNodePodLogArgs = {
  grep?: InputMaybe<Scalars['String']['input']>;
  maxLines?: InputMaybe<Scalars['Int']['input']>;
  sinceSeconds?: InputMaybe<Scalars['Int']['input']>;
  sinceTime?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Resources durations. Estimation from Argo, usually pretty not accurate.
 * See https://argoproj.github.io/argo-workflows/resource-duration/
 */
export type DryRunNodeResourceDuration = {
  __typename?: 'DryRunNodeResourceDuration';
  cpu?: Maybe<Scalars['String']['output']>;
  gpu?: Maybe<Scalars['String']['output']>;
  memory?: Maybe<Scalars['String']['output']>;
};

/**  The type of a dry run node  */
export enum DryRunNodeType {
  Container = 'Container',
  Dag = 'DAG',
  Http = 'HTTP',
  Plugin = 'Plugin',
  Pod = 'Pod',
  Retry = 'Retry',
  Skipped = 'Skipped',
  StepGroup = 'StepGroup',
  Steps = 'Steps',
  Suspend = 'Suspend',
  TaskGroup = 'TaskGroup'
}

/**  The phase of a dry run  */
export enum DryRunPhase {
  /**  Dry run had an error other than a non 0 exit code  */
  Error = 'Error',
  /**  Dry run was skipped  */
  Failed = 'Failed',
  /**  Dry run is waiting to run  */
  Pending = 'Pending',
  /**  Dry run is running  */
  Running = 'Running',
  /**  Dry run finished successfully  */
  Succeeded = 'Succeeded',
  /**  Dry run is running but suspended  */
  Suspended = 'Suspended',
  /**  Dry run was omitted because its depends condition was not met  */
  Unknown = 'Unknown'
}

/**  Contains information about the status of a dry run  */
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
  /**  The current status of the dry run  */
  startedAt?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /**  Assign a dry run to a project  */
  assignDryRunToProject: DryRun;
  /**  Compute scaling laws for a set of dry runs  */
  computeScalingLawsFromNodesMetrics: Array<Maybe<NodesScalingLaws>>;
  /**  Compute a presigned URL for uploading a file using HTTP PUT. The mutation returns the URL to upload the file.  */
  computeUploadPresignedUrl: Scalars['String']['output'];
  /**  Buckets  */
  createBucket: Scalars['String']['output'];
  /**  Create a new docker registry credential  */
  createDockerRegistryCredential: DockerRegistryCredential;
  /**
   *  Create a new dry run.
   *
   * projectId and id are optional and will be generated.
   * If provided in the createDryRun arguments, they will overwrite the
   * values in the argoWorkflow document.
   */
  createDryRun: DryRun;
  /**  Create a new project  */
  createProject: Project;
  /**  Create a new Argo workflow template  */
  createWorkflowTemplate: WorkflowTemplate;
  deleteArtifacts: Scalars['Boolean']['output'];
  /**  Delete an existing bucket. The mutation returns true if the deletion was successful.  */
  deleteBucket: Scalars['Boolean']['output'];
  /**  Delete an existing docker registry credential. The mutation returns true if the deletion was successful.  */
  deleteDockerRegistryCredential: Scalars['Boolean']['output'];
  /**  Delete an existing dry run. The mutation returns true if the deletion was successful.  */
  deleteDryRun: Scalars['Boolean']['output'];
  /**  Delete an existing project. The mutation returns true if the deletion was successful.  */
  deleteProject: Scalars['Boolean']['output'];
  /**  Delete an existing Argo workflow template. The mutation returns true if the deletion was successful.  */
  deleteWorkflowTemplate: Scalars['Boolean']['output'];
  /**  Compute aggregated resource metrics for a set of dry runs  */
  getAggregatedNodesMetrics: Array<Maybe<NodesAggregatedNodeMetrics>>;
  /**  Rename an existing project  */
  renameProject: Project;
  /**  Resubmit a dry run. Create a copy of the current dry run and starts its execution. */
  resubmitDryRun: DryRun;
  /**  Resume a paused dry run.  */
  resumeDryRun: DryRun;
  /**  Retry a failed dry run. Restart an existing dry run. */
  retryDryRun: DryRun;
  /**  Stop an active dry run.  */
  stopDryRun: DryRun;
  /**  Suspend an active dry run.  */
  suspendDryRun: DryRun;
  /**  Update an existing docker registry credential  */
  updateDockerRegistryCredential: DockerRegistryCredential;
  /**  Update an existing Argo workflow template  */
  updateWorkflowTemplate: WorkflowTemplate;
};


export type MutationAssignDryRunToProjectArgs = {
  dryRunId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type MutationComputeScalingLawsFromNodesMetricsArgs = {
  data_x?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  dryRunIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nodesAggregatedNodeMetrics?: InputMaybe<Array<InputMaybe<NodesAggregatedNodeMetrics>>>;
};


export type MutationComputeUploadPresignedUrlArgs = {
  bucketName?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateBucketArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateDockerRegistryCredentialArgs = {
  credential: DockerRegistryCredentialInput;
};


export type MutationCreateDryRunArgs = {
  input: CreateDryRunInput;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationCreateWorkflowTemplateArgs = {
  input: CreateWorkflowTemplateInput;
};


export type MutationDeleteArtifactsArgs = {
  bucketName: Scalars['String']['input'];
  keys: Array<Scalars['String']['input']>;
};


export type MutationDeleteBucketArgs = {
  name: Scalars['String']['input'];
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


export type MutationDeleteWorkflowTemplateArgs = {
  name: Scalars['String']['input'];
};


export type MutationGetAggregatedNodesMetricsArgs = {
  aggregateMethod?: InputMaybe<Scalars['String']['input']>;
  dryRunIds: Array<InputMaybe<Scalars['String']['input']>>;
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


export type MutationUpdateWorkflowTemplateArgs = {
  update: UpdateWorkflowTemplateInput;
};

export type NodesAggregatedNodeMetrics = {
  __typename?: 'NodesAggregatedNodeMetrics';
  data: AggregatedNodeMetrics;
  nodeName: Scalars['String']['output'];
};

export type NodesScalingLaws = {
  __typename?: 'NodesScalingLaws';
  cpu: ScalingLawData;
  duration: ScalingLawData;
  mem: ScalingLawData;
  nodeName: Scalars['String']['output'];
};

/**  Project is the high level concept for a specific pipeline in SIM-PIPE. It contains all the previous dry runs of the pipeline and its results.  */
export type Project = {
  __typename?: 'Project';
  /**  Date of creation  */
  createdAt: Scalars['String']['output'];
  /**  The list of dry runs in the project  */
  dryRuns?: Maybe<Array<DryRun>>;
  /**  The identifier of the project  */
  id: Scalars['String']['output'];
  /**  The name of the project  */
  name: Scalars['String']['output'];
  /**  The list of workflow templates in the project  */
  workflowTemplates?: Maybe<Array<WorkflowTemplate>>;
};

export type PrometheusSample = {
  __typename?: 'PrometheusSample';
  timestamp: Scalars['TimeStamp']['output'];
  value: Scalars['PrometheusStringNumber']['output'];
};

export type Query = {
  __typename?: 'Query';
  /**  Artifact metadata  */
  artifact?: Maybe<ArtifactMetadata>;
  /**  List of all the artifacts  */
  artifacts: Array<Artifact>;
  /**  List of all the buckets  */
  buckets: Array<Bucket>;
  /**  List of all docker registry credentials  */
  dockerRegistryCredentials: Array<DockerRegistryCredential>;
  /**  Get a dry run by ID  */
  dryRun: DryRun;
  /**  Returns pong if the server is up and running.  */
  ping: Scalars['String']['output'];
  /**  Get a project by ID  */
  project: Project;
  /**  List of all projects  */
  projects: Array<Project>;
  /**  Fetches the username of the current user.  */
  username: Scalars['String']['output'];
  /**  Get an Argo  workflow template by name  */
  workflowTemplate?: Maybe<WorkflowTemplate>;
};


export type QueryArtifactArgs = {
  bucketName: Scalars['String']['input'];
  key: Scalars['String']['input'];
};


export type QueryArtifactsArgs = {
  bucketName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDryRunArgs = {
  dryRunId: Scalars['String']['input'];
};


export type QueryProjectArgs = {
  projectId: Scalars['String']['input'];
};


export type QueryWorkflowTemplateArgs = {
  name: Scalars['String']['input'];
};

export type ScalingLawData = {
  __typename?: 'ScalingLawData';
  coeffs: Array<Maybe<Scalars['Float']['output']>>;
  r2: Scalars['Float']['output'];
  type: Scalars['String']['output'];
};

/**  The input data to update a workflow template  */
export type UpdateWorkflowTemplateInput = {
  /**  The raw Argo workflow document  */
  argoWorkflowTemplate: Scalars['ArgoWorkflowTemplate']['input'];
  /**  The name of the workflow template  */
  name: Scalars['String']['input'];
  /**  The project to which this workflow template belongs  */
  projectId?: InputMaybe<Scalars['String']['input']>;
};

/**  WorkflowTemplate in SIM-PIPE associates an ArgoWorkflowTemplate to a project */
export type WorkflowTemplate = {
  __typename?: 'WorkflowTemplate';
  /**  The raw Argo workflow document  */
  argoWorkflowTemplate: Scalars['ArgoWorkflowTemplate']['output'];
  /**  The name of the workflow template  */
  name: Scalars['String']['output'];
  /**  The project to which the workflow template belongs  */
  project?: Maybe<Project>;
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


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  DryRunNode: ( DryRunNodeMisc ) | ( DryRunNodePod );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AggregatedNodeMetrics: ResolverTypeWrapper<AggregatedNodeMetrics>;
  ArgoWorkflow: ResolverTypeWrapper<Scalars['ArgoWorkflow']['output']>;
  ArgoWorkflowTemplate: ResolverTypeWrapper<Scalars['ArgoWorkflowTemplate']['output']>;
  Artifact: ResolverTypeWrapper<Artifact>;
  ArtifactMetadata: ResolverTypeWrapper<ArtifactMetadata>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bucket: ResolverTypeWrapper<Bucket>;
  CreateDryRunInput: CreateDryRunInput;
  CreateProjectInput: CreateProjectInput;
  CreateWorkflowTemplateInput: CreateWorkflowTemplateInput;
  DockerRegistryCredential: ResolverTypeWrapper<DockerRegistryCredential>;
  DockerRegistryCredentialInput: DockerRegistryCredentialInput;
  DryRun: ResolverTypeWrapper<DryRun>;
  DryRunNode: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['DryRunNode']>;
  DryRunNodeMetrics: ResolverTypeWrapper<DryRunNodeMetrics>;
  DryRunNodeMisc: ResolverTypeWrapper<DryRunNodeMisc>;
  DryRunNodePhase: DryRunNodePhase;
  DryRunNodePod: ResolverTypeWrapper<DryRunNodePod>;
  DryRunNodeResourceDuration: ResolverTypeWrapper<DryRunNodeResourceDuration>;
  DryRunNodeType: DryRunNodeType;
  DryRunPhase: DryRunPhase;
  DryRunStatus: ResolverTypeWrapper<DryRunStatus>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NodesAggregatedNodeMetrics: ResolverTypeWrapper<NodesAggregatedNodeMetrics>;
  NodesScalingLaws: ResolverTypeWrapper<NodesScalingLaws>;
  Project: ResolverTypeWrapper<Project>;
  PrometheusSample: ResolverTypeWrapper<PrometheusSample>;
  PrometheusStringNumber: ResolverTypeWrapper<Scalars['PrometheusStringNumber']['output']>;
  Query: ResolverTypeWrapper<{}>;
  ScalingLawData: ResolverTypeWrapper<ScalingLawData>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TimeStamp: ResolverTypeWrapper<Scalars['TimeStamp']['output']>;
  UpdateWorkflowTemplateInput: UpdateWorkflowTemplateInput;
  WorkflowTemplate: ResolverTypeWrapper<WorkflowTemplate>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AggregatedNodeMetrics: AggregatedNodeMetrics;
  ArgoWorkflow: Scalars['ArgoWorkflow']['output'];
  ArgoWorkflowTemplate: Scalars['ArgoWorkflowTemplate']['output'];
  Artifact: Artifact;
  ArtifactMetadata: ArtifactMetadata;
  Boolean: Scalars['Boolean']['output'];
  Bucket: Bucket;
  CreateDryRunInput: CreateDryRunInput;
  CreateProjectInput: CreateProjectInput;
  CreateWorkflowTemplateInput: CreateWorkflowTemplateInput;
  DockerRegistryCredential: DockerRegistryCredential;
  DockerRegistryCredentialInput: DockerRegistryCredentialInput;
  DryRun: DryRun;
  DryRunNode: ResolversInterfaceTypes<ResolversParentTypes>['DryRunNode'];
  DryRunNodeMetrics: DryRunNodeMetrics;
  DryRunNodeMisc: DryRunNodeMisc;
  DryRunNodePod: DryRunNodePod;
  DryRunNodeResourceDuration: DryRunNodeResourceDuration;
  DryRunStatus: DryRunStatus;
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  NodesAggregatedNodeMetrics: NodesAggregatedNodeMetrics;
  NodesScalingLaws: NodesScalingLaws;
  Project: Project;
  PrometheusSample: PrometheusSample;
  PrometheusStringNumber: Scalars['PrometheusStringNumber']['output'];
  Query: {};
  ScalingLawData: ScalingLawData;
  String: Scalars['String']['output'];
  TimeStamp: Scalars['TimeStamp']['output'];
  UpdateWorkflowTemplateInput: UpdateWorkflowTemplateInput;
  WorkflowTemplate: WorkflowTemplate;
};

export type AggregatedNodeMetricsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregatedNodeMetrics'] = ResolversParentTypes['AggregatedNodeMetrics']> = {
  cpu?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  duration?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  fileSize?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  mem?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  nodeId?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface ArgoWorkflowScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ArgoWorkflow'], any> {
  name: 'ArgoWorkflow';
}

export interface ArgoWorkflowTemplateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ArgoWorkflowTemplate'], any> {
  name: 'ArgoWorkflowTemplate';
}

export type ArtifactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Artifact'] = ResolversParentTypes['Artifact']> = {
  bucketName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArtifactMetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArtifactMetadata'] = ResolversParentTypes['ArtifactMetadata']> = {
  etag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastModified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaData?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BucketResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bucket'] = ResolversParentTypes['Bucket']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

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
  node?: Resolver<Maybe<ResolversTypes['DryRunNode']>, ParentType, ContextType, RequireFields<DryRunNodeArgs, 'id'>>;
  nodes?: Resolver<Maybe<Array<ResolversTypes['DryRunNode']>>, ParentType, ContextType>;
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['DryRunStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DryRunNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DryRunNode'] = ResolversParentTypes['DryRunNode']> = {
  __resolveType: TypeResolveFn<'DryRunNodeMisc' | 'DryRunNodePod', ParentType, ContextType>;
  children?: Resolver<Maybe<Array<ResolversTypes['DryRunNode']>>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  finishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phase?: Resolver<ResolversTypes['DryRunNodePhase'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  templateName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DryRunNodeType'], ParentType, ContextType>;
};

export type DryRunNodeMetricsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DryRunNodeMetrics'] = ResolversParentTypes['DryRunNodeMetrics']> = {
  cpuSystemSecondsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsCpuSystemSecondsTotalArgs>>;
  cpuUsageSecondsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsCpuUsageSecondsTotalArgs>>;
  cpuUserSecondsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsCpuUserSecondsTotalArgs>>;
  fileDescriptors?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFileDescriptorsArgs>>;
  fsInodesFree?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsInodesFreeArgs>>;
  fsInodesTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsInodesTotalArgs>>;
  fsIoCurrent?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsIoCurrentArgs>>;
  fsIoTimeSecondsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsIoTimeSecondsTotalArgs>>;
  fsIoTimeWeightedSecondsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsIoTimeWeightedSecondsTotalArgs>>;
  fsLimitBytes?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsLimitBytesArgs>>;
  fsReadSecondsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsReadSecondsTotalArgs>>;
  fsReadsMergedTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsReadsMergedTotalArgs>>;
  fsReadsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsReadsTotalArgs>>;
  fsSectorReadsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsSectorReadsTotalArgs>>;
  fsSectorWritesTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsSectorWritesTotalArgs>>;
  fsUsageBytes?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsUsageBytesArgs>>;
  fsWriteSecondsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsWriteSecondsTotalArgs>>;
  fsWritesMergedTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsWritesMergedTotalArgs>>;
  fsWritesTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsFsWritesTotalArgs>>;
  memoryCache?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsMemoryCacheArgs>>;
  memoryFailcnt?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsMemoryFailcntArgs>>;
  memoryFailuresTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsMemoryFailuresTotalArgs>>;
  memoryMappedFile?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsMemoryMappedFileArgs>>;
  memoryMaxUsageBytes?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsMemoryMaxUsageBytesArgs>>;
  memoryRss?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsMemoryRssArgs>>;
  memorySwap?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsMemorySwapArgs>>;
  memoryUsageBytes?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsMemoryUsageBytesArgs>>;
  memoryWorkingSetBytes?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsMemoryWorkingSetBytesArgs>>;
  networkReceiveBytesTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsNetworkReceiveBytesTotalArgs>>;
  networkReceiveErrorsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsNetworkReceiveErrorsTotalArgs>>;
  networkReceivePacketsDroppedTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsNetworkReceivePacketsDroppedTotalArgs>>;
  networkReceivePacketsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsNetworkReceivePacketsTotalArgs>>;
  networkTransmitBytesTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsNetworkTransmitBytesTotalArgs>>;
  networkTransmitErrorsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsNetworkTransmitErrorsTotalArgs>>;
  networkTransmitPacketsDroppedTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsNetworkTransmitPacketsDroppedTotalArgs>>;
  networkTransmitPacketsTotal?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsNetworkTransmitPacketsTotalArgs>>;
  processes?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsProcessesArgs>>;
  sockets?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsSocketsArgs>>;
  threads?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsThreadsArgs>>;
  threadsMax?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsThreadsMaxArgs>>;
  ulimitsSoft?: Resolver<Maybe<Array<ResolversTypes['PrometheusSample']>>, ParentType, ContextType, Partial<DryRunNodeMetricsUlimitsSoftArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DryRunNodeMiscResolvers<ContextType = any, ParentType extends ResolversParentTypes['DryRunNodeMisc'] = ResolversParentTypes['DryRunNodeMisc']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['DryRunNode']>>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  finishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phase?: Resolver<ResolversTypes['DryRunNodePhase'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  templateName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DryRunNodeType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DryRunNodePodResolvers<ContextType = any, ParentType extends ResolversParentTypes['DryRunNodePod'] = ResolversParentTypes['DryRunNodePod']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['DryRunNode']>>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  exitCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  finishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputArtifacts?: Resolver<Maybe<Array<ResolversTypes['Artifact']>>, ParentType, ContextType>;
  log?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType, Partial<DryRunNodePodLogArgs>>;
  metrics?: Resolver<ResolversTypes['DryRunNodeMetrics'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  outputArtifacts?: Resolver<Maybe<Array<ResolversTypes['Artifact']>>, ParentType, ContextType>;
  phase?: Resolver<ResolversTypes['DryRunNodePhase'], ParentType, ContextType>;
  podName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resourcesDuration?: Resolver<Maybe<ResolversTypes['DryRunNodeResourceDuration']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  templateName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DryRunNodeType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DryRunNodeResourceDurationResolvers<ContextType = any, ParentType extends ResolversParentTypes['DryRunNodeResourceDuration'] = ResolversParentTypes['DryRunNodeResourceDuration']> = {
  cpu?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gpu?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  memory?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  computeScalingLawsFromNodesMetrics?: Resolver<Array<Maybe<ResolversTypes['NodesScalingLaws']>>, ParentType, ContextType, Partial<MutationComputeScalingLawsFromNodesMetricsArgs>>;
  computeUploadPresignedUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType, Partial<MutationComputeUploadPresignedUrlArgs>>;
  createBucket?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateBucketArgs, 'name'>>;
  createDockerRegistryCredential?: Resolver<ResolversTypes['DockerRegistryCredential'], ParentType, ContextType, RequireFields<MutationCreateDockerRegistryCredentialArgs, 'credential'>>;
  createDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationCreateDryRunArgs, 'input'>>;
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'project'>>;
  createWorkflowTemplate?: Resolver<ResolversTypes['WorkflowTemplate'], ParentType, ContextType, RequireFields<MutationCreateWorkflowTemplateArgs, 'input'>>;
  deleteArtifacts?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteArtifactsArgs, 'bucketName' | 'keys'>>;
  deleteBucket?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBucketArgs, 'name'>>;
  deleteDockerRegistryCredential?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDockerRegistryCredentialArgs, 'name'>>;
  deleteDryRun?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDryRunArgs, 'dryRunId'>>;
  deleteProject?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'projectId'>>;
  deleteWorkflowTemplate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteWorkflowTemplateArgs, 'name'>>;
  getAggregatedNodesMetrics?: Resolver<Array<Maybe<ResolversTypes['NodesAggregatedNodeMetrics']>>, ParentType, ContextType, RequireFields<MutationGetAggregatedNodesMetricsArgs, 'dryRunIds'>>;
  renameProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationRenameProjectArgs, 'name' | 'projectId'>>;
  resubmitDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationResubmitDryRunArgs, 'dryRunId'>>;
  resumeDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationResumeDryRunArgs, 'dryRunId'>>;
  retryDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationRetryDryRunArgs, 'dryRunId'>>;
  stopDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationStopDryRunArgs, 'dryRunId'>>;
  suspendDryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<MutationSuspendDryRunArgs, 'dryRunId'>>;
  updateDockerRegistryCredential?: Resolver<ResolversTypes['DockerRegistryCredential'], ParentType, ContextType, RequireFields<MutationUpdateDockerRegistryCredentialArgs, 'credential'>>;
  updateWorkflowTemplate?: Resolver<ResolversTypes['WorkflowTemplate'], ParentType, ContextType, RequireFields<MutationUpdateWorkflowTemplateArgs, 'update'>>;
};

export type NodesAggregatedNodeMetricsResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodesAggregatedNodeMetrics'] = ResolversParentTypes['NodesAggregatedNodeMetrics']> = {
  data?: Resolver<ResolversTypes['AggregatedNodeMetrics'], ParentType, ContextType>;
  nodeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodesScalingLawsResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodesScalingLaws'] = ResolversParentTypes['NodesScalingLaws']> = {
  cpu?: Resolver<ResolversTypes['ScalingLawData'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['ScalingLawData'], ParentType, ContextType>;
  mem?: Resolver<ResolversTypes['ScalingLawData'], ParentType, ContextType>;
  nodeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dryRuns?: Resolver<Maybe<Array<ResolversTypes['DryRun']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workflowTemplates?: Resolver<Maybe<Array<ResolversTypes['WorkflowTemplate']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PrometheusSampleResolvers<ContextType = any, ParentType extends ResolversParentTypes['PrometheusSample'] = ResolversParentTypes['PrometheusSample']> = {
  timestamp?: Resolver<ResolversTypes['TimeStamp'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['PrometheusStringNumber'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface PrometheusStringNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PrometheusStringNumber'], any> {
  name: 'PrometheusStringNumber';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  artifact?: Resolver<Maybe<ResolversTypes['ArtifactMetadata']>, ParentType, ContextType, RequireFields<QueryArtifactArgs, 'bucketName' | 'key'>>;
  artifacts?: Resolver<Array<ResolversTypes['Artifact']>, ParentType, ContextType, Partial<QueryArtifactsArgs>>;
  buckets?: Resolver<Array<ResolversTypes['Bucket']>, ParentType, ContextType>;
  dockerRegistryCredentials?: Resolver<Array<ResolversTypes['DockerRegistryCredential']>, ParentType, ContextType>;
  dryRun?: Resolver<ResolversTypes['DryRun'], ParentType, ContextType, RequireFields<QueryDryRunArgs, 'dryRunId'>>;
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<QueryProjectArgs, 'projectId'>>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workflowTemplate?: Resolver<Maybe<ResolversTypes['WorkflowTemplate']>, ParentType, ContextType, RequireFields<QueryWorkflowTemplateArgs, 'name'>>;
};

export type ScalingLawDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScalingLawData'] = ResolversParentTypes['ScalingLawData']> = {
  coeffs?: Resolver<Array<Maybe<ResolversTypes['Float']>>, ParentType, ContextType>;
  r2?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimeStampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['TimeStamp'], any> {
  name: 'TimeStamp';
}

export type WorkflowTemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkflowTemplate'] = ResolversParentTypes['WorkflowTemplate']> = {
  argoWorkflowTemplate?: Resolver<ResolversTypes['ArgoWorkflowTemplate'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AggregatedNodeMetrics?: AggregatedNodeMetricsResolvers<ContextType>;
  ArgoWorkflow?: GraphQLScalarType;
  ArgoWorkflowTemplate?: GraphQLScalarType;
  Artifact?: ArtifactResolvers<ContextType>;
  ArtifactMetadata?: ArtifactMetadataResolvers<ContextType>;
  Bucket?: BucketResolvers<ContextType>;
  DockerRegistryCredential?: DockerRegistryCredentialResolvers<ContextType>;
  DryRun?: DryRunResolvers<ContextType>;
  DryRunNode?: DryRunNodeResolvers<ContextType>;
  DryRunNodeMetrics?: DryRunNodeMetricsResolvers<ContextType>;
  DryRunNodeMisc?: DryRunNodeMiscResolvers<ContextType>;
  DryRunNodePod?: DryRunNodePodResolvers<ContextType>;
  DryRunNodeResourceDuration?: DryRunNodeResourceDurationResolvers<ContextType>;
  DryRunStatus?: DryRunStatusResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NodesAggregatedNodeMetrics?: NodesAggregatedNodeMetricsResolvers<ContextType>;
  NodesScalingLaws?: NodesScalingLawsResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  PrometheusSample?: PrometheusSampleResolvers<ContextType>;
  PrometheusStringNumber?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  ScalingLawData?: ScalingLawDataResolvers<ContextType>;
  TimeStamp?: GraphQLScalarType;
  WorkflowTemplate?: WorkflowTemplateResolvers<ContextType>;
};

