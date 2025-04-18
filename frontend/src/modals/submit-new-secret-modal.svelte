<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { cBase, cHeader, cForm } from '../styles/styles.js';
	import createCredentialMutation from '../queries/create_credential.js';
	import { credentialsList } from '../stores/stores.js';
	import allCredentialsQuery from '../queries/get_all_credentials.js';
	import type { DockerRegistryCredential } from '../types.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	// Props - Exposes parent props to this component
	export let parent: SvelteComponent;

	// modalStore is a store that is used to trigger modals
	const modalStore = getModalStore();

	// Form Data
	const formData = {
		name: '',
		server: '',
		username: '',
		password: ''
	};

	// Check if the user wants to auto generate a password
	const checkedAutoGeneratePassword = false;

	// Password input text
	$: passwordInputText = checkedAutoGeneratePassword
		? 'auto generate strong password'
		: 'Enter password...';

	// Default pwd length
	const detfaultPasswordLength = 30;

	function generateRandomPassword(length: number): string {
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

	// function validate credentials input fields
	function validateName(input: string): boolean {
		// Define the regular expression pattern for validation
		// let pattern = /^[a-z0-9.,_,-]+$/;
		const pattern = /^[\d,._a-z-]+$/; // optimized pattern by eslint
		return pattern.test(input);
	}
	// vaidate server name
	function validateServerName(input: string): boolean {
		// Define the regular expression pattern for validation
		// const pattern = /^[a-z0-9.,/,:_,-]+$/;
		const pattern = /^[\d,./:_a-z-]+$/; // optimized pattern by eslint
		const test1 = pattern.test(input);
		return test1;
	}
	// validate password
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function validatePassphrase(passphrase: string): boolean {
		// Check if the passphrase is at least 6 characters long
		if (passphrase.length < 6) {
			return false;
		}

		// Check if the passphrase contains at least one lowercase letter
		if (!/[a-z]/.test(passphrase)) {
			return false;
		}

		// Check if the passphrase contains at least one uppercase letter
		if (!/[A-Z]/.test(passphrase)) {
			return false;
		}

		// Check if the passphrase contains at least one digit
		if (!/\d/.test(passphrase)) {
			return false;
		}

		// Check if the passphrase contains at least one special character
		// if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-|=]/.test(passphrase)) {
		//		return false;
		// }

		// If all criteria pass, the passphrase is valid
		return true;
	}

	function validateInputs(secret_name: string, username: string, servername: string): boolean {
		let valid = true;
		// validate secret name
		if (!validateName(secret_name)) {
			valid = false;
			alert(
				`Secret name ${secret_name} is invalid! Must be lowercase alpha numeric words separated by either .-_`
			);
		}
		if (!validateName(username)) {
			valid = false;
			alert(
				`Username ${username} is invalid! Must be lowercase alpha numeric words separated by either .-_`
			);
		}
		if (!validateServerName(servername)) {
			valid = false;
			alert(
				`Servername ${servername} is invalid! Must be lowercase alpha numeric words separated by either /.-_`
			);
		}
		// if (!validatePassphrase(password)) {
		// 	valid = false;
		// 	alert(
		// 		`Password is invalid! Must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit and one special character`
		// 	);
		// }
		return valid;
	}

	// We've created a custom submit function to pass the response and close the modal.
	async function onFormSubmit(): Promise<void> {
		const password = checkedAutoGeneratePassword
			? generateRandomPassword(detfaultPasswordLength)
			: formData.password;
		const variables = {
			credential: {
				name: formData.name,
				server: formData.server,
				username: formData.username,
				password
			}
		};
		if (!validateInputs(formData.name, formData.username, formData.server)) {
			throw new Error('Invalid input');
		}
		if (checkedAutoGeneratePassword) {
			alert(`Auto generated password: ${password}`);
		}
		// TODO: Fix bug where request fails for different reasons (secret name already exists, uppercase, whitespace, underscore)
		try {
			await requestGraphQLClient(createCredentialMutation, variables);
		} catch (error: any) {
			console.log(error);
			alert(`Error: ${error.message}`);
			throw error(500, error);
		}

		modalStore.close();
		// refresh credentials list
		const newcredentialsPromise: { dockerRegistryCredentials: DockerRegistryCredential[] } =
			await requestGraphQLClient(allCredentialsQuery);
		$credentialsList = newcredentialsPromise.dockerRegistryCredentials;
	}
</script>

<!-- @component This example creates a simple form modal. -->
<!-- TO DO: Aleena; help users provide correct kubernetes name (pattern on the HTML5 input tag perhaps may be used to only allow valid kubernetes names)-->
<!-- TO DO: Aleena; Gøran has come up with suggestion for pattern in inputs for secret name, username and hostname. Check that this works as expected. -->
<!-- TODO: validate input username,password pattern="[a-z0-9.,_,-]+$" servername pattern="[a-z0-9.,\/,:_,-]+$"-->
{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Secret name</span>
				<input
					class="input"
					type="text"
					bind:value={formData.name}
					placeholder="image-registry-secret"
					title="lowercase alpha numeric words separated by .-_"
				/>
			</label>
			<label class="label">
				<span>Username</span>
				<input
					class="input"
					type="text"
					bind:value={formData.username}
					placeholder="username..."
					title="lowercase alpha numeric words separated by .-_"
				/>
			</label>
			<label class="label">
				<span>Servername</span>
				<input
					class="input"
					type="text"
					bind:value={formData.server}
					placeholder="https://image-registry.server.com:5000"
					title="lowercase alpha numeric words separated by .-_:/"
				/>
			</label>
			<div class="flex flex-row">
				<div class="justify-stretch">
					<label class="label">
						<span>Password</span>
						<input
							class="input"
							type="text"
							bind:value={formData.password}
							placeholder={passwordInputText}
							title="lowercase alpha numeric words separated by .-_"
							disabled={checkedAutoGeneratePassword}
						/>
					</label>
				</div>
			</div>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
		<!--<button class="btn {parent.buttonPositive}" use:popup={popupPassword}>Show password</button>-->
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit</button>

		<div class="card p-4 w-72 shadow-xl" data-popup="popupPassword">
			<div><p>Demo Content</p></div>
			<div class="arrow bg-surface-100-800-token" />
		</div>

    </footer>
	</div>
{/if}
