<script lang="ts">
	import {cBase, cHeader, cForm} from '../../styles/styles.js';
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	// Form Data
	const formData = {
		name: '',
		username: '',
		host: ''
	};

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

</script>

<!-- @component This example creates a simple form modal. -->
<!-- TODO: Aleena; help users provide correct kubernetes name (pattern on the HTML5 input tag perhaps may be used to only allow valid kubernetes names)-->
<!-- TODO: Aleena; Gøran has come up with suggestion for pattern in inputs for secret name, username and hostname. Check that this works as expected. -->
{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Secret name</span>
				<input class="input" type="text" bind:value={formData.name} 
						placeholder="Enter name..." pattern="^[a-z0-9.,_,-]+$" 
						title="lowercase alpha numeric words separated by .-_"/>
			</label>
			<label class="label">
				<span>Username</span>
				<input class="input" type="text" bind:value={formData.username} 
						placeholder="Enter username..." pattern="^[a-z0-9.,_,-]+$"
						title="lowercase alpha numeric words separated by .-_"/>
			</label>
			<label class="label">
				<span>Hostname</span>
				<input class="input" type="text" bind:value={formData.host} 
						placeholder="Enter hostname..." pattern="^[a-z0-9.,\/,:_,-]+$"
						title="lowercase alpha numeric words separated by .-_:/"/>
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit</button>
    </footer>
	</div>
{/if}
  