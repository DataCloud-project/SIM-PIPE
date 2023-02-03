<script>
	import { getContext } from 'svelte';
	import CreateSimulationModal from './create_simulation_modal.svelte';
	import ImportFromDefpipeModal from './import_from_defpipe_modal.svelte';
	const { open } = getContext('simple-modal');
	function open_create_simulation_modal() {
		open(CreateSimulationModal);
	}
	function open_import_defpipe_modal() {
		open(ImportFromDefpipeModal);
	}
</script>

<button class="action_button" on:click={open_create_simulation_modal}>Import simulation manually</button>
<!-- Integration change -->
<br/>
<button class="action_button" on:click={open_import_defpipe_modal}>Import from DEF-PIPE</button>
<!-- Integration change -->