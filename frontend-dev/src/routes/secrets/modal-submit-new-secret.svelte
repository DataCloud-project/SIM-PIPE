<script lang="ts">
	import { get } from 'svelte/store';
	import {cBase, cHeader, cForm} from '../../styles/styles.js';
	import { graphQLClient } from '../../stores/stores.js';
	import createCredentialMutation from '../../queries/create_credential.js';
	import { credentialsList } from '../../stores/stores.js';
	import allCredentialsQuery from '../../queries/get_all_credentials.js';
	import type { DockerRegistryCredential } from '../../types.js'

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	// Form Data
	const formData = {
		name: '',
		server: '',
		username: '',
		password: ''
	};

	let checkedAutoGeneratePassword = false;
	$: passwordInputText = checkedAutoGeneratePassword ? 'auto generate strong password' : 'Enter password...';

	// write a function that generates a random password
	let detfault_password_length = 30;
	function generateRandomPassword(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}
	// We've created a custom submit function to pass the response and close the modal.
	async function onFormSubmit(): Promise<void> {
		const password = checkedAutoGeneratePassword ? generateRandomPassword(detfault_password_length) : formData.password;
		const variables = {
			credential: {
				name: formData.name,
				server: formData.server,
				username: formData.username,
				password: password
			}
		};
		const response = await get(graphQLClient).request(createCredentialMutation, variables);	
		modalStore.close();
		// refresh credentials list
		const newcredentialsPromise: {dockerRegistryCredentials: DockerRegistryCredential[]} = await get(graphQLClient).request(allCredentialsQuery);
		$credentialsList = newcredentialsPromise.dockerRegistryCredentials;
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
						placeholder="Enter name..." pattern="[a-z0-9]+" 
						title="lowercase alpha numeric words separated by .-_"/>
			</label>
			<label class="label">
				<span>Username</span>
				<input class="input" type="text" bind:value={formData.username} 
						placeholder="Enter username..." pattern="[a-z0-9.,_,-]+$"
						title="lowercase alpha numeric words separated by .-_"/>
			</label>
			<label class="label">
				<span>Servername</span>
				<input class="input" type="text" bind:value={formData.server} 
						placeholder="Enter hostname for server..." pattern="[a-z0-9.,\/,:_,-]+$"
						title="lowercase alpha numeric words separated by .-_:/"/>
			</label>
			<div class="flex flex-row">
				<div class="flex-initial w-8">
					<input class="checkbox variant-filled" type="checkbox" bind:checked={checkedAutoGeneratePassword}>
				</div>
				<div class="justify-stretch">
				<label class="label">
					<span>Password</span>
					<input class="input" type="text" bind:value={formData.password} 
							placeholder={passwordInputText} pattern="[a-Z0-9.,_,-]+$"
							title="lowercase alpha numeric words separated by .-_"
							disabled={checkedAutoGeneratePassword}
							/>
				</label>
				</div>
			</div>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit</button>
    </footer>
	</div>
{/if}
  