<script>
	import { getContext } from 'svelte';
	import CreateRunModal from './create_run_modal.svelte';
	const { open } = getContext('simple-modal');
	function open_create_run_modal() {
		open(CreateRunModal);
	}
</script>

<button class="action_button" on:click={open_create_run_modal}>Create new run</button>

<style>
	button {
		margin-left: 40px;
	}
</style>
