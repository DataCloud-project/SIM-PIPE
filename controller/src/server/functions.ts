import sdk from '../db/sdk.js';
import logger from '../logger.js';
import { DSLParsingError, FeatureDisabledError, NotFoundError } from './apollo-errors.js';
import DSL from './dsl.js';
import type {
  CreateRunMutation, CreateStepMutation,
  GetSimulationDslQuery,
} from '../db/database.js';
import type { UUID } from '../types.js';
import type { DSLType, StepDSLType as StepDSL } from './dsl.js';
import type { CreateRunInput, CreateSimulationInput } from './schema.js';

async function createStep(runId: UUID, name: string, image: string,
  pipelineStepNumber: number): Promise<UUID> {
  const result: CreateStepMutation = await sdk.createStep({
    runId,
    name,
    image,
    pipelineStepNumber,
  });
  const stepId = result.insertStepsOne?.stepId;
  if (!stepId) {
    throw new Error('🎌 Undefined results from sdk.createStep');
  }
  logger.info(`Step created with id ${stepId}`);
  return stepId;
}

/**
 * function to read dsl parameter in simulation table
 *
 * */
async function parseDSL(simulationId: string): Promise<StepDSL[]> {
  // get dsl from simulation table using simulationId
  const result: GetSimulationDslQuery = await sdk.getSimulationDSL({ simulationId });
  const pipelineDescription = result.simulation?.pipelineDescription;
  if (!pipelineDescription) {
    throw new Error('🎌 Undefined results from sdk.getSimulationDSL');
  }
  const dslInstance = DSL.parse(pipelineDescription);
  const { steps } = dslInstance;
  return steps;
}

export async function createRun(simulationId: string, name: string): Promise<string> {
  // read dsl, validate and use it to create steps in the run
  const steps: Array<StepDSL> = await parseDSL(simulationId);
  const result: CreateRunMutation = await sdk.createRun({
    simulationId,
    name,
  });
  const runId = result.insertRunsOne?.runId;
  if (!runId) {
    throw new Error('🎌 Undefined results from sdk.createRun function');
  }
  // create all steps in the database
  logger.info(`Run created with id ${runId}`);
  for await (const step of steps) {
    await createStep(runId, step.name, step.image, step.step_number);
  }
  return runId;
}

/**
 * function to check if a run belongs to the logged in user
 */
export async function checkRunOwner(runId: string, userId: string): Promise<void> {
  const result = await sdk.getUserIdFromRun({ runId });
  if (result.run?.simulation.userId !== userId) {
    throw new NotFoundError('Run not found');
  }
}

export async function checkSimulationOwner(simulationId: string, userId: string): Promise<void> {
  const result = await sdk.getUserIdFromSimulation({ simulationId });
  if (result.simulation?.userId !== userId) {
    throw new NotFoundError('Simulation not found');
  }
}

export async function stopRun(runId: string, userId: string): Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(runId, userId);
  throw new FeatureDisabledError('Run cancellation is disabled');
}

export async function queueRun(runId: string, userId: string): Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(runId, userId);
  throw new FeatureDisabledError('Run queue is disabled');
}

export async function createSimulation({
  name, userId, pipelineDescription,
}: CreateSimulationInput & { userId: string }): Promise<string> {
  // Parse the DSL to make sure it is valid before saving broken data
  let parsedPipelineDescription: DSLType;
  try {
    parsedPipelineDescription = DSL.parse(JSON.parse(pipelineDescription));
  } catch (error) {
    throw new DSLParsingError(error as Error);
  }

  // Save the simulation in the database
  const result = await sdk.createSimulation({
    name,
    pipelineDescription: parsedPipelineDescription,
    userId,
  });

  // Return the simulation id
  const simulationId = result.insertSimulationsOne?.simulationId;
  if (!simulationId) {
    throw new Error('🎌 Undefined results from sdk.createSimulation function');
  }
  // create simulation in the database
  return simulationId;
}
