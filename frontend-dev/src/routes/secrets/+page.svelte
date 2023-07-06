<script lang="ts">
	//import secrets from '../../stores/secrets.json';
	// import KubernetesSecret from './kubernetes-secret.svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewSecret from './modal-submit-new-secret.svelte';
	import allCredentialsQuery from '../../queries/get_all_credentials.js';
	import type { DockerRegistryCredential } from '../../types.js'
	import { get } from 'svelte/store';
	import { graphQLClient } from '../../stores/stores.js';
	import { credentialsList } from '../../stores/stores.js';

	const modalComponent: ModalComponent = {
		ref: ModalSubmitNewSecret
	};

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		title: 'Add new secret',
		body: 'Provide a name and username for the new secret at given host.\nSecret will be automatically generated.',
		//response: (r: string) => console.log('response:', r),
		//response: (r) => updateSecret(r.name, r.username, r.host)
	};

	const getCredentialsList = async (): Promise<DockerRegistryCredential[]> => {
		console.log(get(graphQLClient))
		const response = await get(graphQLClient).request<{
			All_Credentials: {
				dockerRegistryCredentials: DockerRegistryCredential[];
			}
		}>(allCredentialsQuery);
		console.log(response);
		return response.dockerRegistryCredentials;
	};	

	const credentialsPromise = getCredentialsList();

	credentialsPromise
		.then((value) => {
		$credentialsList = value;
        $credentialsList.forEach((element) => {
            console.log(element)
		});
		})
		.catch(() => {
		$credentialsList = undefined;
		});
	
</script>

<!-- Page Header -->
<div class="flex-col p-5">
	<h1>Secrets</h1>
	<div class="flex-col">
		<div class="table-container table-fixed p-5 pr-40">
			{#await credentialsPromise}
            <p style="font-size:20px;">Loading credentials...</p>
            {:then credentialsPromise}
			<!-- Native Table Element -->
			<!-- TODO: add margin/padding for table elements -->
			<table class="w-half table table-interactive">
				<thead>
					<tr>
						<th />
						<th>Name</th>
						<th>Username</th>
						<th>Server</th>
					</tr>
				</thead>
				<tbody>
					{#each credentialsList as secret}
						<tr class="table-row-checked">
							<td><input type="checkbox" class="checkbox variant-filled" /></td>
							<td>{secret.name}</td>
							<td>{secret.username}</td>
							<td>{secret.server}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			{/await}
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
