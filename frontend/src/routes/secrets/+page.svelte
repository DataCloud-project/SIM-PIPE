<script lang="ts">
	import { getModalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import allCredentialsQuery from '../../queries/get_all_credentials.js';
	import deleteCredentialMutation from '../../queries/delete_credential.js';
	import type { DockerRegistryCredential } from '../../types.js';
	import { credentialsList, selectedCredential } from '../../stores/stores.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { goto } from '$app/navigation';

	const modalStore = getModalStore();

	$: reactiveCredentialsList = $credentialsList;

	async function onSubmitNewSecret(): Promise<void> {
		const modal: ModalSettings = {
			type: 'component',
			component: 'submitNewSecretModal',
			title: 'Add new secret',
			body: 'Provide a name and username for the new secret at given host.\nSecret will be automatically generated.'
		};
		modalStore.trigger(modal);
	}

	const getCredentialsList = async (): Promise<DockerRegistryCredential[]> => {
		const response: { dockerRegistryCredentials: DockerRegistryCredential[] } =
			await requestGraphQLClient(allCredentialsQuery);
		return response.dockerRegistryCredentials;
	};

	const credentialsPromise = getCredentialsList();
	const checkboxes: Record<string, boolean> = {};

	// TODO: why do credentials not have an id? That is quite stupid!
	credentialsPromise
		.then((value) => {
			$credentialsList = value;
			reactiveCredentialsList = value;
			$credentialsList.forEach((element) => {
				checkboxes[element.name] = false;
			});
		})
		.catch(() => {
			$credentialsList = undefined;
		});

	async function onDeleteSelected(): Promise<void> {
		const deletePromises = Object.keys(checkboxes)
			.filter((item) => checkboxes[item])
			.map((element) => {
				const variables = {
					name: element
				};
				return requestGraphQLClient(deleteCredentialMutation, variables);
			});

		// wait for all promises to resolve
		await Promise.all(deletePromises);
		// reset checkboxes
		$credentialsList?.forEach((element) => {
			checkboxes[element.name] = false;
		});
		const newcredentialsPromise: { dockerRegistryCredentials: DockerRegistryCredential[] } =
			await requestGraphQLClient(allCredentialsQuery);
		// Update credentialsList
		credentialsList.set(newcredentialsPromise.dockerRegistryCredentials);
		reactiveCredentialsList = $credentialsList;
	}

	// to disable onclick propogation for checkbox input
	const handleCheckboxClick = (event: any): void => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		event.stopPropagation();
	};

	function gotosecret(secret: DockerRegistryCredential): void {
		selectedCredential.set(secret);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		goto(`/secrets/${secret.name}`);
	}
</script>

<!-- Page Header -->
<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#await credentialsPromise}
			<p style="font-size:20px;">Loading credentials...</p>
			<ProgressBar />
		{:then credentialsList}
			<h1>Secrets</h1>
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
					<button
						type="button"
						class="btn btn-sm variant-filled"
						on:click={() => onSubmitNewSecret()}
					>
						<span>Create</span>
					</button>
				</div>
				<div>
					<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
					<button
						type="button"
						class="btn btn-sm variant-filled-warning"
						on:click={() => onDeleteSelected()}
					>
						<span>Delete</span>
					</button>
				</div>
			</div>
			<table class="table table-interactive">
				<caption hidden>Secrets</caption>
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
						<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
						<tr id="clickable_row" on:click={() => gotosecret(secret)}>
							<td style="width:10px">
								<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
								<input
									type="checkbox"
									class="checkbox"
									bind:checked={checkboxes[secret.name]}
									on:click={(event) => handleCheckboxClick(event)}
								/>
							</td>
							<td style="width:60%">{secret.name}</td>
							<td style="width:20%">{secret.username}</td>
							<td style="width:20%">{secret.server}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/await}
	</div>
</div>

<style>
	.table.table {
		max-height: 80vh;
		overflow-y: auto;
		overflow-x: scroll;
		display: block;
		border-collapse: collapse;
		margin-left: auto;
		margin-right: auto;
		table-layout: auto;
		width: 100%;
	}
	thead {
		position: sticky;
		top: 0;
	}
</style>
