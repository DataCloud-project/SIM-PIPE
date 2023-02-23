export type StatSample = {
  time: string,
  cpu: number,
  systemCpu: number,
  memory: number,
  memory_max: number,
  rxValue: number,
  txValue: number
};

export type Step = {
  simId: string;
  runId: string;
  stepNumber?: number;
  image?:string;
  inputPath: string[]; // to handle complex pipelines
  env?: string[];
  stepId?: number;
  prerequisite?:number[]; // to handle complex pipelines
  type?:string;
};
