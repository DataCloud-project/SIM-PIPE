export type UUID = string;

export type Step = {
  simulationId: UUID;
  runId: UUID;
  stepId: UUID;
  stepNumber: number;
  name: string;
  image: string;
  env: string[];
};
