<script>
    import { getContext } from 'svelte';
    import {clicked_simulation} from '../../stores/stores';
</script>

<button class="action_button start_run">  <a href="/">Back</a> </button>
<button class="action_button start_run">  <a href={`/${clicked_simulation.simulation_id}`}>Refresh</a> </button>
