<script lang="ts">
  import { getContext } from 'svelte';
  import createRunMutation from '../queries/create-run.js';
  import getSimulationQuery from '../queries/get-simulation.js';
  import { clickedSimulation, graphQLClient } from '../stores/stores.js';
  import Alert from './alert-modal.svelte';
  import type { ModalContext, Simulation, StepDescription } from 'src/types';

  const { close, open } = getContext<ModalContext>('simple-modal');

  if (!$clickedSimulation) {
    throw new Error('No simulation selected');
  }

  const simulationId = $clickedSimulation.simulation_id;
  let name = '';
  let files: FileList;
  const environmentListEntries: { [key: string]: string }[] = [];
  const environmentList: string[][] = [];
  let pipelineSteps = $clickedSimulation.pipeline_description?.steps;

  if (!pipelineSteps) {
    // TODO weird JSON as string there???
    pipelineSteps = (
      JSON.parse($clickedSimulation.pipeline_description as unknown as string) as {
        steps: StepDescription[];
      }
    ).steps;
  }

  if (!pipelineSteps) {
    throw new Error('No pipeline steps found');
  }

  const timeoutValues: string[] = [];
  const showEnvironmentList: boolean[] = [];
  for (const [index, step] of pipelineSteps.entries()) {
    showEnvironmentList[index] = false;
    environmentListEntries[index] = {};
    for (const environment of step.env) {
      const [key, value] = environment.split('=');
      environmentListEntries[index][key] = value;
    }
  }
  function toggleEnvironementList(index: number): void {
    showEnvironmentList[index] = !showEnvironmentList[index];
  }
  async function executeCreateRun(): Promise<void> {
    for (const [index, environmentEntry] of environmentListEntries.entries()) {
      // formatting env list entries in the correct format
      environmentList[index] = [];
      for (const key of Object.keys(environmentEntry)) {
        environmentList[index].push([key, environmentEntry[key]].join('='));
      }
      // checking timeout_values and resetting to 0 for undefined
      timeoutValues[index] = Number.parseInt(timeoutValues[index], 10).toFixed(0);
    }
    // get sample input files for the run
    const sampleInput: string[][] = [];
    for (const [index, file] of [...files].entries()) {
      sampleInput[index] = [];
      sampleInput[index].push(file.name);
      // eslint-disable-next-line no-await-in-loop
      const text = await file.text();
      sampleInput[index].push(text);
    }
    // call create run with the entered details
    const variables = {
      simulation_id: simulationId,
      name,
      sampleInput,
      env_list: environmentList,
      timeout_values: timeoutValues,
    };
    let result;
    result = await $graphQLClient.request<{
      Create_Run_WithInput: string;
    }>(createRunMutation, variables);
    // Perhaps we shouldn't use JSON there
    const output = JSON.parse(result.Create_Run_WithInput) as {
      code: number;
      message: string;
    };
    if (output.code >= 200 && output.code < 300) {
      open(Alert, { message: `🎐 Success! ${name} is created` });
      setTimeout(() => {
        close();
      }, 1000);
      // refresh run list when new run is created
      const refreshVariables = { simulation_id: simulationId };
      result = await $graphQLClient.request<{
        Get_Simulation: {
          simulations: Simulation[];
        };
      }>(getSimulationQuery, refreshVariables);
      // eslint-disable-next-line prefer-destructuring
      $clickedSimulation = result.Get_Simulation.simulations[0];
    } else {
      open(Alert, { message: '🎌 Failed! Error creating run' });
      setTimeout(() => {
        close();
      }, 1000);
    }
  }
</script>

<div class="create_run_class">
  <h1 style="font-size:30px;">Enter details of run</h1>
  <div class="modal_box">
    <p style="font-size:18px;">
      <strong>Name of run: </strong><input bind:value="{name}" placeholder="Enter name" />
    </p>

    <p style="font-size:18px;"><strong>Upload sample input files for the run</strong></p>

    <input multiple type="file" bind:files="{files}" />
    <br />
    {#each files || [] as file}
      <p><strong>{file.name}</strong>({file.size} bytes)</p>
    {/each}
    <br />
    <p style="font-size:18px;"><strong>Run configuration</strong></p>

    {#if pipelineSteps}
      {#each pipelineSteps as step, index}
        <p style="margin-left:30px;">
          Enter <strong><span style="color:black;">{step.name}</span></strong> configuration
          <button class="toggle pointer" on:click="{toggleEnvironementList.bind(undefined, index)}"
            >{showEnvironmentList[index] ? '↑' : '↓'}</button
          >
        </p>
        {#if showEnvironmentList[index]}
          {#each step.env as environment}
            <p class="left-margin">
              {environment.split('=')[0]}:
              <input bind:value="{environmentListEntries[index][environment.split('=')[0]]}" />
            </p>
          {/each}
          <!-- <br /> -->
          <!-- timeout values for both types of steps   -->
          <p class="left-margin">
            {#if step.type === 'continuous'}
              Process timeout value for the step
            {:else}
              Process timeout value for the step (optional)
            {/if}
            <input bind:value="{timeoutValues[index]}" placeholder="Enter timeout in seconds" />
          </p>
        {/if}
        <br />
      {/each}
    {/if}
  </div>

  <br />
  <p>
    <button class="cancel_button" on:click="{close}"> Cancel </button>
    <button class="confirm_button" on:click="{executeCreateRun}"> Create new run</button>
  </p>
  <br /><br />
</div>

<style>
  .toggle {
    background-color: rgb(218, 245, 254);
    font-size: 20px;
  }
  .create_run_class {
    background-color: white;
  }
  .left-margin {
    margin-left: 50px;
  }
  input,
  p,
  button {
    font-size: 16px;
    color: black;
    margin-left: 10px;
  }
  h1 {
    color: black;
  }
</style>
