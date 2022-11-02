<script>
    import { getContext } from 'svelte';
    import CreateSimulationModal from './create_simulation_modal.svelte';
    const { open } = getContext('simple-modal');
	function open_create_simulation_modal() {
        open(CreateSimulationModal);
    }
</script>

<button class="action_button" on:click="{open_create_simulation_modal}">Create new simulation</button>
