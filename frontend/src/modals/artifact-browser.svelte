<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Artifacts from '$src/routes/artifacts/artifacts.svelte';
	import { selectedArtifact, reactiveBuckets } from '$stores/stores';
	import type { ArtifactHierarchyType } from '$typesdefinitions';

	export let templateTaskName = '';
	export let templateTaskArtifactName = '';
	export let isOpen = false;

	// Button becomes active when an artifact is selected
	let isActiveButton = false;

	export let close = (): void => {
		isOpen = false;
		isActiveButton = false;
	};

	const dispatch = createEventDispatcher();

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	function unselectArtifacts(except_artifact_name: string, artifacts: ArtifactHierarchyType[]) {
		artifacts.forEach((artifact) => {
			// this is needed to traverse subfolders. Disable eslint rule for this line.
			// eslint-disable-next-line no-param-reassign
			if (artifact.name !== except_artifact_name) {
				// eslint-disable-next-line no-param-reassign
				artifact.isSelected = false;
			}
			if (artifact.subfolders.length > 0) {
				unselectArtifacts(except_artifact_name, artifact.subfolders);
			}
		});
	}

	// unselect all buckets and all artifacts
	function unselectOtherArtifacts(except_artifact_name: string): void {
		console.log('Unselect all except latest selected artifact.');
		for (const bucket of $reactiveBuckets) {
			unselectArtifacts(except_artifact_name, bucket.artifacts);
		}
	}

	function cancel(): void {
		console.log('cancel');
		close();
	}

	selectedArtifact.subscribe((value) => {
		const artifactName = value?.name;
		console.log('subscribe selectedArtifact', value);
		if ($selectedArtifact) {
			isActiveButton = true;
			unselectOtherArtifacts(artifactName as string);
		}
	});

	const submit = (): void => {
		const selectedArtifactData = $selectedArtifact;
		dispatch('message', {
			selected_artifact: selectedArtifactData,
			template_task_name: templateTaskName,
			template_task_artifact_name: templateTaskArtifactName
		});
		close();
	};
</script>

<div class="{isOpen ? 'block' : 'hidden'} fixed z-10 inset-0 overflow-y-auto variant-ghost">
	<div
		class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
	>
		<!-- Background overlay, show/hide based on modal state. -->
		<div class="fixed inset-0 transition-opacity" aria-hidden="true">
			<div class="absolute inset-0 opacity-75"></div>
		</div>
		<!-- This element is to trick the browser into centering the modal contents. -->
		<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
			>&#8203;</span
		>
		<!-- Modal Panel -->
		<div
			class="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-4/5 p-4 variant-filled-surface mx-auto"
		>
			<div>
				<h1>Select one artifact as input</h1>
				{#if $selectedArtifact}
					<div class="text-right text-sm text-gray-500 absolute top-0 right-0 mt-2 mr-2">
						<div>
							Bucket: {$selectedArtifact.bucket}
						</div>
						<div>
							Artifact: {$selectedArtifact.name}
						</div>
					</div>
				{/if}
			</div>
			<div></div>
			<div>
				<Artifacts />
			</div>
			<div>
				<div>
					<button type="button" class="btn variant-filled-ghost float-left" on:click={cancel}
						>Cancel</button
					>
				</div>
				<div>
					<button
						type="button"
						class="btn variant-filled float-right {isActiveButton ? 'active' : ''}"
						title="Select one artifact as input"
						disabled={!isActiveButton}
						on:click={submit}
						>Submit selected artifact
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
