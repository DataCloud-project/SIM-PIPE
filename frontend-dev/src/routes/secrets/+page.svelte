<script lang="ts">
	import secrets from '../../stores/secrets.json';
	import KubernetesSecret from './kubernetes-secret.svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewSecret from './modal-submit-new-secret.svelte';
  import { FSWatcher } from 'vite';

	const modalComponent: ModalComponent = {
		ref: ModalSubmitNewSecret,
	};

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		title: 'Add new secret',
		body: 'Provide a name and username for the new secret at given host.\nSecret will be automatically generated.',
		//response: (r: string) => console.log('response:', r),
		response: (r) => updateSecret(r.name, r.username, r.host),
	};

  	// Create a new secret in the database
    let passwordLength: number = 10;
    
    // write a function that updates the values of the secret object and stores it in a json file
    function updateSecret(newName: string, newUserName: string, newHostName: string) {
        // update the secret object
		const secret = {
			"name": newName, 
			"username": newUserName, 
			"host": newHostName, 
			"password": generateRandomString(passwordLength)
		}
        secrets.concat(secret)
		console.log(secrets)
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
</script>

<!-- Page Header -->
<div class="p-2">
	<h1>Secrets</h1>
		<div class="flex-col content-around p-5">
			<div class="p-2">
				<div class=p-2>
					<!-- <button type="button" class="btn btn-sm variant-filled" on:click={() => redirectToAddNewSecretPage()}> -->
					<button type="button" class="btn btn-sm variant-filled" on:click={() => (modalStore.trigger(modal))}>
						<span>Add new secret</span>
				</div>
				<div class=p-2>
					<button type="button" class="btn btn-sm variant-filled-warning">
						<span>Delete selected secrets</span>
					</button>
				</div>
			</div>
		<table>
		{#each secrets as secret}
		<tr>
			<td><KubernetesSecret secret={secret} /></td>
		</tr>
		{/each}
		</table>
	</div>
</div>

<Modal />
