<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

	// Props - Exposes parent props to this component
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Handle form submission
	function onFormSubmit(): void {
		const textInput = document.getElementById('text-input') as HTMLInputElement;
		console.log(textInput);
		const text = textInput.value;

		if (text && text.length > 0) {
			if ($modalStore[0].response) {
				$modalStore[0].response(text);
			}
		}

		modalStore.close();
	}

	// Base classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-text-input {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title mising)'}</header>
		<footer class="modal-footer">
			<div>
				<input
					id="text-input"
					class="input"
					type="text"
					placeholder={$modalStore[0].meta.input_name}
				/>
			</div>
			<br />
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose()}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Create</button>
		</footer>
	</div>
{/if}
