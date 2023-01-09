<script lang="ts">
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import Modal from 'svelte-simple-modal';
  import Back from '../../components/back.svelte';
  import Charts from '../../components/charts.svelte';
  import DeleteSimulationButton from '../../components/delete-simulation-button.svelte';
  import Logs from '../../components/logs.svelte';
  import Runs from '../../components/runs.svelte';
  import Steps from '../../components/steps.svelte';
  import { clickedRun, clickedSimulation, showStepsList, showUsages } from '../../stores/stores.js';
  import type { PageData } from './$types';

  dayjs.extend(relativeTime);

  export let data: PageData;
  const { simulation } = data;

  $clickedSimulation = simulation;
  const time = $clickedSimulation ? dayjs($clickedSimulation.created).fromNow() : '';
  // set show_usages and show_steps_list as false when page loads/reloads
  $showUsages = false;
  $showStepsList = false;
</script>

<Modal><Back /></Modal>
<div class="simulation_header">
  <h3>
    Simulation: <span style="color:darkseagreen">{$clickedSimulation?.name}</span> created {time}
    <Modal><DeleteSimulationButton /></Modal>
  </h3>
</div>

<div class="all_content_box">
  <div class="list_border">
    <Runs />
  </div>

  {#if $showStepsList}
    <div class="list_border">
      <Steps />
    </div>
  {/if}

  {#if $showUsages}
    <div class="log_details">
      <Logs />
    </div>
  {/if}
</div>

{#if $showUsages && $clickedRun && $clickedRun.status !== 'queued' && $clickedRun.status !== 'waiting'}
  <div class="graph_slot">
    <Charts />
  </div>
{/if}

<style>
  .all_content_box {
    display: flex;
  }
  .simulation_header {
    margin-top: 1px;
    padding: 1px;
    padding-left: 10px;
    width: 32%;
    border: 8px solid rgba(255, 255, 255, 0.2);
  }
  .list_border {
    margin-top: 30px;
    padding: 10px;
    border: 3px dashed rgba(255, 255, 255, 0.2);
    flex: 0.32;
    float: left;
  }

  .log_details {
    flex: 0.34;
    margin-top: 40px;
    float: left;
    border: 3px dashed rgba(255, 255, 255, 0.2);
    padding: 10px;
  }
  .graph_slot {
    width: 97%;
    padding: 10px;
    float: left;
    border: 3px dashed rgba(255, 255, 255, 0.2);
    background-color: white;
    margin-top: 40px;
  }
</style>
