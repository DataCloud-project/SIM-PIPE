<script lang="ts">
	//import secrets from '../../stores/secrets.json';
	// import KubernetesSecret from './kubernetes-secret.svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewSecret from './modal-submit-new-secret.svelte';
	import allCredentialsQuery from '../../queries/get_all_credentials.js';
	import deleteCredentialMutation from '../../queries/delete_credential.js';
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
		const response: {dockerRegistryCredentials: DockerRegistryCredential[]} = await get(graphQLClient).request(allCredentialsQuery);
		//console.log(response.dockerRegistryCredentials)
		return response.dockerRegistryCredentials;
	};	

	const credentialsPromise = getCredentialsList();
	let checkboxes: Record<string, boolean> = {};

	// TODO: why do credentials not have an id? That is quite stupid!
	credentialsPromise.then((value) => {
			$credentialsList = value;
			reactiveCredentialsList = value;
            $credentialsList.forEach((element) => {
			    checkboxes[element.name] = false;
			});			
		}).catch(() => {
			$credentialsList = undefined;
		});

	async function onDeleteSelected() {
        console.log('Deleting ', Object.keys(checkboxes).filter((item) => checkboxes[item]));
        Object.keys(checkboxes).filter((item) => checkboxes[item]).forEach(async (element) => {
            const variables = {
			    name: element
		    }
            console.log(element)
		    const response = await get(graphQLClient).request(deleteCredentialMutation, variables);
        });
		const newcredentialsPromise: {dockerRegistryCredentials: DockerRegistryCredential[]} = await get(graphQLClient).request(allCredentialsQuery);
		credentialsList.set(newcredentialsPromise.dockerRegistryCredentials);
		reactiveCredentialsList = $credentialsList;
    }
	
	// to disable onclick propogation for checkbox input
	const handleCheckboxClick = (event:any) => {
        event.stopPropagation(); 
    };

	$: reactiveCredentialsList = $credentialsList;
	
</script>

<!-- Page Header -->
<div class="flex-col p-5">
	<h1>Secrets</h1>

    <div class="flex justify-end">
        <div class="flex-row justify-content-end">
			<button
				type="button"
				class="btn btn-sm variant-filled"
				on:click={() => modalStore.trigger(modal)}>
				<span>Create</span>
			</button>
			<button 
				type="button" 
				class="btn btn-sm variant-filled-warning"
				on:click={() => onDeleteSelected()}>
				<span>Delete</span>
			</button>
		</div>
	</div>

	<div class="p-5 table-container">
		{#await credentialsPromise}
			<p style="font-size:20px;">Loading credentials...</p>
			{:then credentialsList}
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
					{#each reactiveCredentialsList || [] as secret}
						<tr id="clickable_row" class="table-row-checked">
							<td>
								<input 
									type="checkbox" 
									class="checkbox variant-filled" 
									bind:checked={checkboxes[secret.name]} 
									on:click={(event) => handleCheckboxClick(event)}/>
							</td>
							<td>{secret.name}</td>
							<td>{secret.username}</td>
							<td>{secret.server}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/await}
	</div>
</div>

<Modal />
