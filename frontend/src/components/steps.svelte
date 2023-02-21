<script lang="ts">
  import dayjs from 'dayjs';
  import {
    clickedStep,
    selectedLogs,
    selectedResourceUsage,
    showUsages,
    stepsList,
  } from '../stores/stores.js';
  import Scroll from './scroll.svelte';
  import type { Step } from '../types';

  let data: Step[] = [];
  $clickedStep = undefined;

  function stepOnClick(step: Step): void {
    $clickedStep = step;
    if (
      $clickedStep.status !== 'waiting' &&
      $clickedStep.status !== 'cancelled' &&
      $clickedStep.status !== 'active'
    ) {
      $showUsages = true;
      $selectedResourceUsage = step.resource_usages ?? [];
      $selectedLogs = step.log?.text ?? '';
    } else {
      $showUsages = false;
    }
  }
  function displayStatusMessage(step: Step): string {
    if (step.status === 'completed') {
      return `Completed in ${Math.round(dayjs(step.ended).diff(step.started) / 1000).toFixed(
        2,
      )} seconds`;
    }
    return step.status;
  }

  function stepOnEnter(step: Step, event: KeyboardEvent): void {
    if (event.key === 'Enter') stepOnClick(step);
  }

  $: data = $stepsList;
</script>

<br />
<main class="scrollable_main">
  <h2 class="table_heading_h2">Steps</h2>
  <ul class="scrollable_ul">
    <li class="table-header-runs">
      <div class="col-1">STEP_NUMBER</div>
      <div class="col-2">NAME</div>
      <div class="col-3">STATUS</div>
    </li>
    {#each data as step (step)}
      <li
        class="pointer"
        class:active="{step.step_id === $clickedStep?.step_id}"
        class:scrollable_li="{step.step_id !== $clickedStep?.step_id}"
        on:click="{stepOnClick.bind(undefined, step)}"
        on:keydown="{stepOnEnter.bind(undefined, step)}"
      >
        <div class="col-1">{step.pipeline_step_number}</div>
        <div class="col-2">{step.name}</div>
        <div class="col-3">{displayStatusMessage(step)}</div>
      </li>
    {/each}
    <Scroll threshold="{100}" />
  </ul>
</main>

<style>
  .col-1 {
    flex-basis: 30%;
  }
  .col-2 {
    flex-basis: 30%;
  }
  .col-3 {
    flex-basis: 40%;
  }
</style>
