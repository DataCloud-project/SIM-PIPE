<script>
	import {
		show_usages,
		selected_resource_usage,
		clicked_step,
		selected_logs,
		steps_list
	} from '../stores/stores';
	import dayjs from 'dayjs';
	import Scroll from "./scroll.svelte";

	let data = [];
	$clicked_step = '';

	function stepOnClick(step) {
		$clicked_step = step;
		if ($clicked_step.status != 'waiting' && $clicked_step.status != 'cancelled') {
			$show_usages = true;
			$selected_resource_usage = step.resource_usages;
			$selected_logs = step.log?.text;
		} else {
			$show_usages = false;
		}
	}
	function display_status_msg(step) {
		if (step.status == 'completed') {
			return `Completed in ${Math.round(dayjs(step.ended).diff(step.started)/1000, 2)} seconds`;
		} 
		return step.status;
	}
	$: data = $steps_list;

</script>

<br/>
<main class="scrollable_main">
	<h2 class="table_heading_h2">Steps
		
	</h2>
	<ul class="scrollable_ul">
		<li class="table-header-runs">
			<div class="col-1">STEP_NUMBER</div>
			<div class="col-2">NAME</div>
			<div class="col-3">STATUS</div>
		</li>
	  {#each data as step, index (step)}
		<li class="pointer"
		class:active={step.step_id === $clicked_step.step_id}
		class:scrollable_li={step.step_id != $clicked_step.step_id}
		{index}
		on:click={() => stepOnClick(step)}>
			<div class="col-1">{step.pipeline_step_number}</div>
			<div class="col-2">{step.name}</div>
			<div class="col-3">{display_status_msg(step)}</div>
		</li>
	  {/each}
	  <Scroll
		threshold={100} />
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
