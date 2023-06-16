<script lang="ts">
	import {cBase, cHeader, cForm} from '../../../../styles/styles.js';
	export let parent: any;

	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	// Form Data
	const formData = {
		name: '',		
	};

	// TODO: replace with actual api call
	function onCreateDryRunSubmit(): void {
		console.log('to be implemented');
		modalStore.close();
	}	

</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Dry run name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
		</form>
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onCreateDryRunSubmit}>Submit</button>
    </footer>
	</div>
{/if}
  