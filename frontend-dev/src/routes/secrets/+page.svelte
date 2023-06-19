<script lang="ts">
	import secrets from '../../stores/secrets.json';
	// import KubernetesSecret from './kubernetes-secret.svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewSecret from './modal-submit-new-secret.svelte';

	let password_values = new Array(secrets.length).fill('show');

	const modalComponent: ModalComponent = {
		ref: ModalSubmitNewSecret
	};

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		title: 'Add new secret',
		body: 'Provide a name and username for the new secret at given host.\nSecret will be automatically generated.',
		//response: (r: string) => console.log('response:', r),
		response: (r) => updateSecret(r.name, r.username, r.host)
	};

	// Create a new secret in the database
	let passwordLength: number = 10;
	// write a function that updates the values of the secret object and stores it in a json file
	function updateSecret(newName: string, newUserName: string, newHostName: string) {
		// update the secret object
		const secret = {
			name: newName,
			username: newUserName,
			host: newHostName,
			password: generateRandomString(passwordLength)
		};
		secrets.concat(secret);
		console.log(secrets);
		// TODO: write the secret object to json file or database
	}

	function generateRandomString(length: number) {
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	// // function redirect to add new secret page
	// function redirectToAddNewSecretPage() {
	// 	window.location.href = "/new_secret"
	// }
	function onmousedown(password: string, i: number) {
		password_values[i] = password;
	}
	function onmouseup(i: number) {
		password_values[i] = 'show';
	}
</script>

<!-- Page Header -->
<div class="flex-col p-5">
	<h1>Secrets</h1>
	<div class="flex-col">
		<div class="table-container table-fixed p-5 pr-40">
			<!-- Native Table Element -->
			<!-- TODO: add margin/padding for table elements -->
			<table class="w-half table table-interactive">
				<thead>
					<tr>
						<th />
						<th>Name</th>
						<th>Username</th>
						<th>Host</th>
						<!-- to keep column width same when password is shown, TODO: make it proper -->
						<th width="20%">Password</th>
					</tr>
				</thead>
				<tbody>
					{#each secrets as secret, i}
						<tr class="table-row-checked">
							<td><input type="checkbox" class="checkbox variant-filled" /></td>
							<td>{secret.name}</td>
							<td>{secret.username}</td>
							<td>{secret.host}</td>
							<td
								on:mousedown={() => onmousedown(secret.password, i)}
								on:mouseup={() => onmouseup(i)}><i>{password_values[i]}</i></td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="p-2">
			<div class="p-2">
				<!-- <button type="button" class="btn btn-sm variant-filled" on:click={() => redirectToAddNewSecretPage()}> -->
				<button
					type="button"
					class="btn btn-sm variant-filled"
					on:click={() => modalStore.trigger(modal)}
				>
					<span>Add new secret</span>
				</button>
			</div>
			<div class="p-2">
				<button type="button" class="btn btn-sm variant-filled-warning">
					<span>Delete selected secrets</span>
				</button>
			</div>
		</div>
		<!-- {#each secrets as secret}
		<tr>
			<td><KubernetesSecret secret={secret} /></td>
		</tr>
		{/each} -->
		
	</div>
</div>

<Modal />
