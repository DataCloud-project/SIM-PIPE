// import logger from '../logger.js';
// import { DSLParsingError , NotFoundError } from './apollo-errors.js';
import DSL from './dsl.js';
import type { /* DSLType, */ StepDSLType as StepDSL } from './dsl.js';
import type { CreateSimulationInput } from './schema.js';

/**
 * function to read dsl parameter in simulation table
 *
 * */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function parseDSL(pipelineDescription: string): Promise<StepDSL[]> {
  const dslInstance = DSL.parse(pipelineDescription);
  const { steps } = dslInstance;
  return steps;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createRun(simulationId: string, name: string): Promise<string> {
  // // read dsl, validate and use it to create steps in the run
  // const steps: Array<StepDSL> = await parseDSL(simulationId);
  // const result: CreateRunMutation = await sdk.createRun({
  //   simulationId,
  //   name,
  // });
  // const runId = result.insertRunsOne?.runId;
  // if (!runId) {
  //   throw new Error('🎌 Undefined results from sdk.createRun function');
  // }
  // // create all steps in the database
  // logger.info(`Run created with id ${runId}`);
  // for await (const step of steps) {
  //   await createStep(runId, step.name, step.image, step.step_number);
  // }
  // return runId;
  return 'todo';
}

/**
 * function to check if a run belongs to the logged in user
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkRunOwner(runId: string, userId: string): Promise<void> {
  // const result = await sdk.getUserIdFromRun({ runId });
  // if (result.run?.simulation.userId !== userId) {
  //  throw new NotFoundError('Run not found');
  // }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkSimulationOwner(simulationId: string, userId: string): Promise<void> {
  // const result = await sdk.getUserIdFromSimulation({ simulationId });
  // if (result.simulation?.userId !== userId) {
  //   throw new NotFoundError('Simulation not found');
  // }
}

/*
export async function createSimulation({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  name, userId, pipelineDescription,
}: CreateSimulationInput & { userId: string }): Promise<string> {
  // Parse the DSL to make sure it is valid before saving broken data
  // let parsedPipelineDescription: DSLType;
  // try {
  //   parsedPipelineDescription = DSL.parse(JSON.parse(pipelineDescription));
  // } catch (error) {
  //   throw new DSLParsingError(error as Error);
  // }

  // Save the simulation in the database
  // const result = await sdk.createSimulation({
  //   name,
  //   pipelineDescription: parsedPipelineDescription,
  //   userId,
  // });

  // Return the simulation id
  // const simulationId = result.insertSimulationsOne?.simulationId;
  // if (!simulationId) {
  //   throw new Error('🎌 Undefined results from sdk.createSimulation function');
  // }
  // // create simulation in the database
  // return simulationId;
  return 'todo';
}
*/
