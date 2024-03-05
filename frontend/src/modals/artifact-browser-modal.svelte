<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

    import { cBase, cForm, cHeader } from '../../styles/styles.js';
    import Artifacts from '../routes/artifacts/artifacts.svelte.js'
    

	// Props - Exposes parent props to this component
	const modalStore = getModalStore();

    // Props - Exposes parent props to this component
    export let parent: SvelteComponent;

</script>

{#if $modalStore[0]}
    <div class="modal-text-input {cBase}">
        <header class={cHeader}>Hello world</header>
        <footer class="modal-footer">
            <Artifacts />
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={() => console.log("create")}>Create</button>
        </footer>
    </div>
{/if}


