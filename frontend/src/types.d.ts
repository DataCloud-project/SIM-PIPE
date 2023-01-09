export type Simulation = {
  simulation_id: string;
  name: string;
  created: string;

  runs?: Run[];
  pipeline_description?: PipelineDescription;
};

export type Run = {
  run_id: string;
  name: string;
  steps?: Step[];
  status: 'active' | 'queued' | 'waiting' | 'completed' | 'failed' | 'cancelled';
  created: string;
  started: string;
  ended: string;
};

export type Step = {
  step_id: string;
  name: string;
  status: 'active' | 'queued' | 'waiting' | 'completed' | 'failed' | 'cancelled';
  started: string;
  ended: string;
  resource_usages?: ResourceUsage[];
  log?: StepLog;
  pipeline_step_number: number;
};

export type PipelineDescription = {
  steps: StepDescription[];
};

export type StepDescription = {
  name: string;
  // env are key=value strings
  env: string[];
  type: 'continuous' | undefined;
};

export type ResourceUsage = {
  time: string;
  cpu: number;
  memory: number;
  memory_max: number;
  rx_value: number;
  tx_value: number;
};

export type StepLog = {
  text: string;
};

export interface ModalContext {
  open: ModalOpen;
  close: ModalClose;
}

export type ModalOpen = (
  component: typeof SvelteComponent,
  properties?: Record<string, unknown>,
) => void;

export type ModalClose = () => void;
