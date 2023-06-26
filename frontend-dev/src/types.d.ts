export type Project = {
    project_id: string;
    name: string;
    created: string;
    // TODO:change when argo storage format is ready
    dry_run_count?: number;
    simulations_count?:number;
    // dry_runs?: DryRun[];
    // pipeline_description?: PipelineDescription;
  };