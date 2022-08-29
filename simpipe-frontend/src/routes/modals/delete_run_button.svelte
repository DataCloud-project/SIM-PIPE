<script>
    import { getContext } from 'svelte';
	import AreYouSure from './are_you_sure.svelte';

    const { open } = getContext('simple-modal');   

	function open_are_you_sure() {
		open(AreYouSure);
	}
</script>

<button class="action_button delete_run" on:click="{open_are_you_sure}">Delete run</button>

