import startController from '../controller.js';
import sdk from '../db/sdk.js';
import logger from '../logger.js';
import { DSLParsingError, NotFoundError } from './apollo-errors.js';
import DSL from './dsl.js';
import type {
  CreateRunMutation, CreateStepMutation,
  GetRunDetailsQuery,
  GetSimulationDslQuery,
} from '../db/database.js';
import type { Step, UUID } from '../types.js';
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

async function startRun(runId: UUID): Promise<UUID> {
  // set run as started in the database
  await sdk.setRunAsStarted({ runId });
  // get simulationId and step details of runId
  const result: GetRunDetailsQuery = await sdk.getRunDetails({ runId });
  if (!result.run) {
    throw new Error('GetRunDetailsQuery fetched no run');
  }
  // get steps
  const { steps, simulationId } = result.run;
  for await (const step of steps) {
    const {
      stepId, name, image, pipelineStepNumber,
    } = step;
    // check if there is a stop signal set to true or failed run signal set
    // TODO: don't use process as a global variable
    if ((process.env.CANCEL_RUN_LIST as string).includes(runId)
      || process.env.FAILED_RUN === 'true') {
      // mark all the remaining steps as cancelled
      await sdk.setStepAsCancelled({ stepId });
    } else {
      // testing step type
      const currentStep: Step = {
        stepId,
        runId,
        simulationId,
        stepNumber: pipelineStepNumber,
        name,
        image,
        // env: [],
      };
      /* if (!environmentList || !timeoutValues) {
        throw new Error('Error! List of environment variables/ timeout values for container
        undefined');
      }
      currentStep.env = (environmentList as [[string]])[step.pipeline_step_number - 1]; */
      // set the variable values in env file
      // process.env.STEP_NUMBER = `${step.pipeline_step_number}`;
      // process.env.IMAGE = step.image;
      // process.env.CONTAINER_TIME_LIMIT = `${(timeoutValues as [number])[
      //  step.pipeline_step_number - 1]}`;
      // testing step type
      // adding try catch to handle failed steps
      try {
        // set input path for next step as output path of the previous step returned and start step
        // const nextInput = await startController(client, currentStep);
        await startController(currentStep);
        // currentStep.inputPath = nextInput;
      } catch (error) {
        logger.error(`Run ${runId} execution has failed\n${(error as Error).message}`);
        process.env.FAILED_RUN = 'true';
      }
    }
  }
  // remove sample input files for the run from ./uploaded folder
  // fs.rmSync(`${uploadDirectory}${runId}`, { recursive: true, force: true });
  if ((process.env.CANCEL_RUN_LIST as string).includes(runId)) {
    // mark the run as cancelled
    logger.info(`Run ${runId} execution is cancelled\n`);
    await sdk.setRunAsCancelled({ runId });
    // remove current runid from CANCEL signal
    (process.env.CANCEL_RUN_LIST as string).replace(runId, '');
    return 'cancelled';
  }
  if (process.env.FAILED_RUN === 'true') {
    // mark the run as failed
    await sdk.setRunAsFailed({ runId });
    // set STOP signal to false for the next run
    process.env.FAILED_RUN = 'false';
    return 'failed';
  }
  // set run as completed successully in the database
  await sdk.setRunAsEndedSuccess({ runId });
  return runId;
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
