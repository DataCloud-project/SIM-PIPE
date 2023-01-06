<script lang="ts">
  import dayjs from 'dayjs';
  import Modal from 'svelte-simple-modal';
  import {
    clickedRun,
    clickedSimulation,
    clickedStep,
    showStepsList,
    showUsages,
    stepsList,
  } from '../stores/stores.js';
  import refreshActiveRuns from '../utils/refresh-runs.js';
  import CreateRunButton from './create-run-button.svelte';
  import DeleteRunButton from './delete-run-button.svelte';
  import Scroll from './scroll.svelte';
  import StartRunButton from './start-run-button.svelte';
  import StopRunButton from './stop-run-button.svelte';
  import type { Run } from 'src/types';

  let data: Run[] = [];
  $clickedRun = undefined;

  function displayRunMessage(run: Run): string {
    switch (run.status) {
      case 'completed': {
        return `Completed ${dayjs(run.ended).from(run.started)}`;
      }
      case 'active': {
        return `Running since ${dayjs(run.started).fromNow()}`;
      }
      case 'failed': {
        return `Failed ${dayjs(run.started).fromNow()}`;
      }
      case 'cancelled': {
        return `Cancelled ${dayjs(run.started).fromNow()}`;
      }
      case 'waiting': {
        return `Waiting since ${dayjs(run.created).fromNow()}`;
      }
      default: {
        throw new Error(`Unknown run status: ${run.status}`);
      }
    }
  }

  function runOnClick(run: Run): void {
    // reset selected step when a different run is clicked
    if ($clickedRun !== run) $clickedStep = undefined;
    $clickedRun = run;
    $showStepsList = true;
    // if simulation widget is clicked again then remove resource usages table
    if ($stepsList !== run.steps) {
      $showUsages = false;
    }
    $stepsList = run.steps ?? [];
  }

  function runOnEnter(run: Run, event: KeyboardEvent): void {
    if (event.key === 'Enter') runOnClick(run);
  }

  refreshActiveRuns();
  $: data = $clickedSimulation?.runs ?? [];
</script>

{#if data.length === 0}
  <br />
  <h3>
    <span style="font-size: 30px;">🐧</span> No runs for this simulation, start testing by creating a
    new run!
  </h3>
  <Modal><CreateRunButton /></Modal>
{:else}
  <main class="scrollable_main">
    <h2 class="table_heading_h2">
      Runs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      <Modal><CreateRunButton /></Modal>
      <Modal><StartRunButton /></Modal>
      <Modal><StopRunButton /></Modal>
      {#if $clickedRun && $clickedRun.status !== 'active' && $clickedRun.status !== 'queued'}
        <Modal><DeleteRunButton /></Modal>
      {/if}
    </h2>
    <ul class="scrollable_ul">
      <li class="table-header-runs">
        <div class="col-1">NAME</div>
        <div class="col-2">STATUS</div>
        <div class="col-3">REMARK</div>
      </li>
      {#each data as item (item)}
        <li
          class="pointer"
          class:active="{item === $clickedRun}"
          class:scrollable_li="{item !== $clickedRun}"
          on:click="{runOnClick.bind(undefined, item)}"
          on:keydown="{runOnEnter.bind(undefined, item)}"
        >
          <div class="col-1">{item.name}</div>
          <div class="col-2">{item.status}</div>
          <div class="col-3">{displayRunMessage(item)}</div>
        </li>
      {/each}
      <Scroll threshold="{100}" />
    </ul>
  </main>
{/if}

<style>
  .col-1 {
    flex-basis: 25%;
  }
  .col-2 {
    flex-basis: 25%;
  }
  .col-3 {
    flex-basis: 50%;
  }
</style>
