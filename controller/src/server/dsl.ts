import { z } from 'zod';

const StepDSL = z.object({
  name: z.string().min(1),
  step_number: z.number().min(0),
  image: z.string().min(1),
  env: z.array(z.string().regex(/^[A-Z_]+=.+$/)),
  prerequisite: z.array(z.number().min(0)).optional(),
  type: z.string(),
});

const DSL = z.object({
  steps: z.array(StepDSL),
});

export type DSLType = z.infer<typeof DSL>;
export type StepDSLType = z.infer<typeof StepDSL>;

export default DSL;
