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
  stepNumber: string;
  image:string;
  inputPath: string;
  env?: [string];
};
