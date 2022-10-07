<script>
    import { getContext } from 'svelte';
    import {clicked_simulation} from '../../stores/stores';
	import Alert from './alert.svelte';
    const { open, close } = getContext('simple-modal');

    async function execute_refresh() {
        open(Alert, { message: '🎐 Refreshing' });
        setTimeout(function () {
            close();
        }, 400);
    }
</script>

<div style="padding:5px;">
    <button class="action_button start_run" style="background-image:url({'../../images/backbutton.png'}) ;">  <a href="/">Back</a> </button>
    <button class="action_button start_run" on:click="{execute_refresh}">  <a href={`/${clicked_simulation.simulation_id}`}>Refresh</a> </button>
</div>