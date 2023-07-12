export type _Project = {
  project_id: string;
  name: string;
  created: string;
  // TODO:change when argo storage format is ready
  dry_run_count?: number;
  simulations_count?: number;
  // dry_runs?: DryRun[];
  // pipeline_description?: PipelineDescription;
};

// WIP argo data types

export type Project = {
  name: string;
  id: string;
  createdAt: string;
  dryRuns: [DryRun];
  workflowTemplates: [WorkflowTemplate];
}

export type WorkflowTemplate = {
  name: string;
  project: Project;
  argoWorkflowTemplate: ArgoWorkflowTemplate;
}

export type DryRun = {
  id: string;
  createdAt: string;
  argoWorkflow: ArgoWorkflow;
  status: DryRunStatus;
  project: Project;
  log: [string];
  // TODO: change if needed; original type definition in graphql is
  // log(maxLines: number, grep: string): [string];
}

export type DryRunMetrics = {
  displayName: string;
  startedAt: string;
  duration: number;
  metrics: {
    cpuUsageSecondsTotal: Array<{
      timestamp: number;
      value: number;
    }>;
    memoryUsageBytes: Array<{
      timestamp: number;
      value: number;
    }>;
    networkReceiveBytesTotal: Array<{
      timestamp: number;
      value: number;
    }>;
    networkTransmitBytesTotal: Array<{
      timestamp: number;
      value: number;
    }>;
  };
};

export type ArgoWorkflow = {
  input: unknown;
  output: unknown;
}

export type DryRunStatus = {
  phase: DryRunPhase;
  startedAt: string;
  finishedAt: string;
  progress: string;
  message: string;
  estimatedDuration: number;
}

enum DryRunPhase {
  Unknown,
  Pending,
  Running,
  Succeeded,
  Failed,
  Error,
}

export type DockerRegistryCredential = {
  name: string;
  server: string;
  username: string;
};

export type DockerRegistryCredentialInput = {
  name: string
  username: string
  password: string
  server: string
}