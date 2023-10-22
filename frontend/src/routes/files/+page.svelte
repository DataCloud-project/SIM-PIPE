<script lang="ts">
	import { Modal, ProgressBar, modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { filesList } from '../../stores/stores.js';
	import type { SampleFile } from '../../types.js';
	import Timestamp from '../projects/project_id/[dry_run]/timestamp.svelte';
	import ModalSubmitNewFile from './modal-submit-new-file.svelte';

	const getProjectsList = async (): Promise<SampleFile[]> => {
		// TODO: change to api query when ready
		const response: { files: SampleFile[] } = {
			files: [{ id: '123', name: 'a.txt', created: '2023-08-08T07:03:39Z', size: 3 }]
		};
		return response.files;
	};

	const filesPromise = getProjectsList();

	let checkboxes: Record<string, boolean> = {};

	filesPromise
		.then((value) => {
			reactiveFilesList = value;
		})
		.catch(() => {
			$filesList = undefined;
		});
	// to disable onclick propogation for checkbox input
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};

	async function onCreateSelected() {
		const modal: ModalSettings = {
			type: 'component',
			component: { ref: ModalSubmitNewFile },
			title: 'Create a sample file',
			body: 'Enter details of new file '
			// valueAttr: { projectId: project.id, projectName: project.name }
		};

		modalStore.trigger(modal);
	}
	async function onDeleteSelected() {
		// get file ids from checkboxes
		Object.keys(checkboxes)
			.filter((item) => checkboxes[item])
			.forEach(async (element) => {
				const variables = {
					fileId: element
				};
				// TODO:change to api call
				console.log('fileid', variables.fileId);
			});
		const fileDeletedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'Sample File deleted🗑️!',
			body: `Deleted files: ${Object.keys(checkboxes).filter((item) => checkboxes[item])}`
		};
		modalStore.trigger(fileDeletedMessageModal);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		modalStore.close();
	}

	$: reactiveFilesList = $filesList;
</script>

<div class="container p-5">
	<h1>Sample Files</h1>
	<div class="table-container p-5">
		{#await filesPromise}
			<p style="font-size:20px;">Loading files...</p>
			<ProgressBar />
		{:then filesList}
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<button type="button" class="btn btn-sm variant-filled" on:click={onCreateSelected}>
						<span>Create</span>
					</button>
				</div>
				<div>
					<button
						type="button"
						class="btn btn-sm variant-filled-warning"
						on:click={onDeleteSelected}
					>
						<span>Delete</span>
					</button>
				</div>
			</div>
			<table class="table table-interactive">
				<caption hidden>Sample Input Files</caption>
				<thead>
					<tr>
						<th />
						<th>Name</th>
						<th>Created</th>
						<th>Size</th>
					</tr>
				</thead>
				<tbody>
					{#each reactiveFilesList || [] as file}
						<tr>
							<td style="width:25px;">
								<input
									type="checkbox"
									class="checkbox"
									bind:checked={checkboxes[file.id]}
									on:click={(event) => handleCheckboxClick(event)}
								/>
							</td>
							<td style="width:35%">{file.name}</td>
							<td style="width:35%">
								<div><Timestamp timestamp={file.created} /></div>
							</td>
							<td style="width:30%">
								{file.size}B
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/await}
	</div>
</div>

{#if $modalStore[0]}
	<Modal />
{/if}

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
