export type Project = {
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

export type _Project = {
  name: string;
  id: string;
  createdAt: string;
  dryRuns: [DryRun];
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