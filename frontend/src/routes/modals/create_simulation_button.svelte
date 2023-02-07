<script>
	import { getContext } from 'svelte';
	import CreateSimulationModal from './create_simulation_modal.svelte';
	import ImportFromDefpipeModal from './import_from_defpipe_modal.svelte';
	import { graphQLClient } from '../../stores/stores';
	import { pipeline_list_from_defpipe_query } from '../../queries/view_pipelines_from_defpipe.svelte';

	const { open } = getContext('simple-modal');
	function open_create_simulation_modal() {
		open(CreateSimulationModal);
	}
	// DEF-PIPE Integration change
	async function open_import_defpipe_modal() {	
		let all_currentuser_pipelines = [];
		const all_pipelines = (await $graphQLClient.request(pipeline_list_from_defpipe_query)).ViewPipelinesFromDEFPIPE;
		all_pipelines.forEach((item) => {
			all_currentuser_pipelines.push(item['name']);
		});
		open(ImportFromDefpipeModal, {all_currentuser_pipelines});
	}
</script>

<button class="action_button" on:click={open_create_simulation_modal}>Import simulation manually</button>
<!-- DEF-PIPE Integration change -->
<br/>
<button class="action_button" on:click={open_import_defpipe_modal}>Import from DEF-PIPE</button>