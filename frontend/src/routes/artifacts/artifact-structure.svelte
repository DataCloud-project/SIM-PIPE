<script lang="ts">
	import ArtifactModule from './artifact.svelte';
	import SymbolForBucket from './symbol-for-bucket.svelte';
	import { reactiveBuckets } from '$stores/stores';
	import type {
		FolderStructure,
		Artifact,
		ArtifactHierarchyType,
		BucketHierarchyType,
		BucketWithArtifacts
	} from '$typesdefinitions';

	export let buckets: BucketWithArtifacts[];

	function buildFolderStructure(artifacts: Artifact[]): FolderStructure {
		const structure: FolderStructure = { path: '', children: {} };

		artifacts.forEach((entry) => {
			let currentLevel = structure;
			const parts = entry.name.split('/');

			parts.forEach((part) => {
				if (!currentLevel.children[part]) {
					currentLevel.children[part] = { path: `${currentLevel.path}/${part}`, children: {} };
				}
				currentLevel = currentLevel.children[part];
			});
		});
		return structure;
	}

	function renderFolderStructure(
		structure: FolderStructure,
		bucketName: string,
		depth = 0
	): ArtifactHierarchyType[] {
		const folders: ArtifactHierarchyType[] = [];
		let folder: ArtifactHierarchyType;
		// eslint-disable-next-line guard-for-in
		for (const key in structure.children) {
			const subfolders =
				Object.keys(structure.children[key].children).length > 0
					? renderFolderStructure(structure.children[key], bucketName, depth + 1)
					: [];
			folder = {
				id: `${key}-${Math.floor(Math.random() * 10 ** 10).toString()}`,
				name: key,
				bucket: bucketName,
				subfolders,
				isExpanded: false,
				isSelected: false,
				path: structure.children[key].path
			};
			folders.push(folder);
		}
		return folders;
	}

	function toggleOpenBucket(bucket: BucketHierarchyType): void {
		// eslint-disable-next-line no-param-reassign
		bucket.isExpanded = !bucket.isExpanded;
		$reactiveBuckets = [...$reactiveBuckets]; // Trigger a re-render
	}

	for (const bucket of buckets) {
		const { artifacts } = bucket;
		const structure = buildFolderStructure(artifacts);
		const folders = renderFolderStructure(structure, bucket.bucket.name);
		const newBucket = {
			bucket: bucket.bucket.name,
			isExpanded: false,
			isSelected: false,
			artifacts: folders
		};

		// Only add the bucket if it is not already in the reactiveBuckets
		if (!$reactiveBuckets.some((b) => b.bucket === newBucket.bucket)) {
			$reactiveBuckets = [...$reactiveBuckets, newBucket];
		}
	}

	// log changes to reactiveBuckets
	$: console.log('reactiveBuckets:', $reactiveBuckets);
</script>

<div class="flex artifact-structure">
	<div class="grid grid-cols-1 justify-items-start pl-5">
		{#each $reactiveBuckets as bucket (bucket.bucket)}
			<div class="justify-self-start">
				<div>
					<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
					<button on:dblclick={() => toggleOpenBucket(bucket)}>
						<SymbolForBucket {bucket} />
						<span class="bucket-name">{bucket.bucket}</span>
					</button>
				</div>
			</div>
			{#if bucket.isExpanded}
				{#each bucket.artifacts as artifact (artifact.id)}
					<ArtifactModule {artifact} />
				{/each}
			{/if}
		{/each}
	</div>
</div>

<style>
	.artifact-structure {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		overflow-y: auto;
		overflow-x: scroll;
		width: 100%;
	}
	.bucket-name {
		margin-left: 2px;
		font-size: 20px;
	}
</style>
