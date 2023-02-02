export type UUID = string;

export type Step = {
  userId: string;
  simulationId: UUID;
  runId: UUID;
  stepId: UUID;
  stepNumber: number;
  name: string;
  image: string;
  env?: Record<string, string>;
  timeout?: number;
};
