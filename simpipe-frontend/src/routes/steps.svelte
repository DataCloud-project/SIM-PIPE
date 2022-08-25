<script>
	import {
		show_usages,
		selected_resource_usage,
		clicked_step,
		selected_logs,
		steps_list
	} from '../stores/stores';

	// export let steps

	function stepOnClick(step) {
		$clicked_step = step;
		if (clicked_step.status != 'waiting') {
			$show_usages = true;
			$selected_resource_usage = step.resource_usages;
			$selected_logs = step.log?.text;
		}
	}
</script>

<div class="table_container">
	<h2 class="table_heading_h2">Steps</h2>
	<ul class="responsive-table">
		<li class="table-header">
			<div class="col-1">STEP_NUMBER</div>
			<div class="col-2">NAME</div>
			<div class="col-3">STATUS</div>
		</li>
		{#each $steps_list as step, index (step)}
			<li
				class="pointer"
				class:active={step === $clicked_step}
				{index}
				on:click={() => stepOnClick(step)}
			>
				<div class="col-1">{step.pipeline_step_number}</div>
				<div class="col-2">{step.name}</div>
				<div class="col-3">{step.status}</div>
			</li>
		{/each}
	</ul>
</div>

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
