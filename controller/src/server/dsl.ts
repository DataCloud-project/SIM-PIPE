import { z } from 'zod';

export const StepDSL = z.object({
  name: z.string().min(1),
  step_number: z.number().min(0),
  image: z.string().min(1),
  env: z.array(z.string().regex(/^[A-Z_a-z]+=.+$/)),
  prerequisite: z.array(z.number().min(0)).optional(),
  type: z.string().optional(),
  stepId: z.number().min(0).optional(),
  timeout: z.number().min(0).optional(),
});

export const DSL = z.object({
  steps: z.array(StepDSL),
});

export type StepDSLType = z.infer<typeof StepDSL>;
export type DSLType = z.infer<typeof DSL>;

export default DSL;
