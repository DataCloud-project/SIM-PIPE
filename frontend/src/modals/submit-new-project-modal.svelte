<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import type { SvelteComponent } from 'svelte';

	import { requestGraphQLClient } from '$lib/graphql-utils.js';

	import createProjectMutation from '$queries/create-project.js';
	import createWorkflowTemplateMutation from '$queries/create-workflow-template.js';
	import inlumenPipelinesQuery from '$queries/get-inlumen-pipelines.js';
	import { cBase, cForm, cHeader } from '$styles/styles.js';
	import { validateYAML } from '$utils/argo-utils.js';

	// Props - Exposes parent props to this component
	export let parent: SvelteComponent;

	// modalStore is a store that is used to trigger modals
	const modalStore = getModalStore();

	// Keep a reference to the modal response handler before the modal is closed
	let responseHandler: ((response: any) => void) | undefined;

	// Step: 1 = select source, 2 = review/edit YAML
	let step = 1;

	// Source mode within step 1
	let sourceMode: 'upload' | 'inlumen' = 'upload';

	// Step 1 fields
	let projectName: string = '';
	let inputFilesList: FileList;
	let step1Error: string = '';

	// inLUMEN import state
	type InlumenPipeline = {
		name: string;
		uid: string;
		yaml: string;
		description?: string | null;
		version?: string;
		created_at?: string;
		updated_at?: string;
	};

	function formatDate(iso?: string): string {
		if (!iso) return '—';
		return new Date(iso).toLocaleString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	let inlumenPipelines: InlumenPipeline[] = [];
	let inlumenError = '';
	let selectedVersionUid = '';

	async function fetchInlumenPipelines(): Promise<void> {
		inlumenError = '';
		inlumenPipelines = [];
		selectedVersionUid = '';
		try {
			const response = await requestGraphQLClient<{ inlumenPipelines: string }>(
				inlumenPipelinesQuery
			);
			const parsed = JSON.parse(response.inlumenPipelines) as { versions: InlumenPipeline[] };
			inlumenPipelines = parsed.versions ?? [];
			if (inlumenPipelines.length === 0) {
				inlumenError = 'No pipeline versions found in inLUMEN.';
			}
		} catch (error) {
			console.error('error fetching inLUMEN pipelines', error);
			inlumenError = error instanceof Error ? error.message : 'Failed to fetch from inLUMEN.';
		}
	}

	// Step 2 fields
	let yamlEditorContent: string = '';
	let yamlError: string = '';

	// Line-number gutter
	let textareaEl: HTMLTextAreaElement;
	let gutterEl: HTMLDivElement;
	$: lineNumbers = yamlEditorContent.split('\n').map((_, i) => i + 1);

	function syncScroll(): void {
		if (gutterEl && textareaEl) gutterEl.scrollTop = textareaEl.scrollTop;
	}

	// Derived template name (kebab-case)
	$: templateName = projectName.trim().replaceAll(/\s+/g, '-').toLowerCase();

	// Live YAML validation while editing
	$: {
		if (yamlEditorContent) {
			const result = validateYAML(yamlEditorContent);
			yamlError = result.valid
				? ''
				: result.message instanceof Error
					? result.message.message
					: String(result.message ?? '');
		} else {
			yamlError = '';
		}
	}

	// Move to step 2: validate inputs and produce YAML content from whichever source
	async function goToStep2(): Promise<void> {
		step1Error = '';

		if (!projectName.trim()) {
			step1Error = 'Project name is required.';
			return;
		}

		if (sourceMode === 'upload') {
			if (!inputFilesList || inputFilesList.length === 0) {
				step1Error = 'Please upload a workflow template file.';
				return;
			}
			const fileText = await inputFilesList[0].text();
			if (!fileText.trim()) {
				step1Error = 'The uploaded file is empty.';
				return;
			}
			// Parse as JSON first, then YAML; normalise to YAML for the editor
			try {
				const parsed = JSON.parse(fileText);
				yamlEditorContent = yaml.dump(parsed, { lineWidth: -1 });
			} catch {
				try {
					const parsed = yaml.load(fileText);
					yamlEditorContent = yaml.dump(parsed, { lineWidth: -1 });
				} catch (error) {
					step1Error = `Could not parse file: ${error instanceof Error ? error.message : 'Invalid YAML/JSON'}`;
					return;
				}
			}
		} else {
			// inLUMEN mode
			if (!selectedVersionUid) {
				step1Error = 'Please select a pipeline version from inLUMEN.';
				return;
			}
			const version = inlumenPipelines.find((v) => v.uid === selectedVersionUid);
			if (!version?.yaml) {
				step1Error = 'Selected version has no YAML content.';
				return;
			}
			yamlEditorContent = version.yaml;
		}

		step = 2;
	}

	function goBack(): void {
		step = 1;
		step1Error = '';
	}

	// GraphQL: create project
	async function createProject(): Promise<{
		status: number;
		error: string;
		project: { name: string; id: string };
	}> {
		const variablesCreateProjectRequest = { project: { name: projectName } };
		return requestGraphQLClient<{ createProject: { name: string; id: string } }>(
			createProjectMutation,
			variablesCreateProjectRequest
		)
			.then((data) => ({
				status: 200,
				error: '',
				project: { name: data.createProject.name, id: data.createProject.id }
			}))
			.catch((error) => ({
				status: 500,
				error: error as string,
				project: { name: 'none', id: 'none' }
			}));
	}

	// GraphQL: create workflow template
	async function createWorkflowTemplate(
		projectId: string,
		argoWorkflowTemplate: unknown
	): Promise<{ status: number; error: string; name: string }> {
		const createTemplateVariables = {
			input: {
				argoWorkflowTemplate,
				name: templateName,
				projectId
			}
		};
		return requestGraphQLClient<{ createWorkflowTemplate: { name: string } }>(
			createWorkflowTemplateMutation,
			createTemplateVariables
		)
			.then((data) => ({ status: 200, error: '', name: data.createWorkflowTemplate.name }))
			.catch((error) => ({ status: 500, error: error as string, name: 'none' }));
	}

	async function sendResponse(response: unknown): Promise<void> {
		const responder = responseHandler ?? $modalStore[0]?.response;
		if (typeof responder === 'function') responder(response);
	}

	// Final submission: parse editor content, create project + template
	async function onFinish(): Promise<void> {
		if (yamlError) return; // block if YAML is currently invalid

		let parsedTemplate: unknown;
		try {
			parsedTemplate = yaml.load(yamlEditorContent);
		} catch (error) {
			yamlError = error instanceof Error ? error.message : 'Invalid YAML';
			return;
		}

		responseHandler = $modalStore[0]?.response;
		modalStore.close();

		let createProjectResponse = {
			status: 500,
			error: 'Project creation not attempted',
			project: { name: 'none', id: 'none' }
		};
		let createWorkflowResponse = {
			status: 500,
			error: 'Workflow template creation not attempted',
			name: 'none'
		};

		createProjectResponse = await createProject();
		if (createProjectResponse.status === 200 && createProjectResponse.project.id !== 'none') {
			createWorkflowResponse = await createWorkflowTemplate(
				createProjectResponse.project.id,
				parsedTemplate
			);
		}

		await sendResponse({ createProjectResponse, createWorkflowResponse });
	}
</script>

<!-- Two-step create project modal -->
{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>

		<!-- Step 1: project name + source selection -->
		{#if step === 1}
			<form class="modal-form {cForm}" on:submit|preventDefault={goToStep2}>
				<label class="label">
					<span>Project name</span>
					<input
						class="input"
						type="text"
						bind:value={projectName}
						placeholder="Enter name..."
						autocomplete="off"
					/>
					{#if templateName}
						<p class="text-xs text-surface-400-500-token mt-1">
							Template ID: <code>{templateName}</code>
						</p>
					{/if}
				</label>

				<hr class="!border-surface-300-600-token" />

				<!-- Source mode tabs -->
				<div class="label">
					<span>Template source</span>
					<div
						class="mt-1 grid grid-cols-2 overflow-hidden rounded-container-token border border-surface-300-600-token"
					>
						<button
							type="button"
							class="py-2 px-3 text-sm font-medium transition-colors"
							class:variant-filled-primary={sourceMode === 'upload'}
							on:click={() => {
								sourceMode = 'upload';
							}}
						>
							Upload file
						</button>
						<button
							type="button"
							class="py-2 px-3 text-sm font-medium transition-colors border-l border-surface-300-600-token"
							class:variant-filled-primary={sourceMode === 'inlumen'}
							on:click={() => {
								sourceMode = 'inlumen';
							}}
						>
							Import from inLUMEN
						</button>
					</div>
				</div>

				{#if sourceMode === 'upload'}
					<label class="label">
						<span
							>Upload workflow template <span class="text-xs opacity-60">(YAML or JSON)</span></span
						>
						<input
							class="input"
							type="file"
							accept=".yaml,.yml,.json"
							bind:files={inputFilesList}
						/>
					</label>
				{:else}
					<!-- inLUMEN import panel -->
					<div class="label">
						<span>Available pipeline versions</span>
						<div class="mt-1 flex flex-col gap-2">
							<button
								type="button"
								class="btn variant-soft-primary w-fit"
								on:click={fetchInlumenPipelines}
							>
								Fetch from inLUMEN
							</button>

							{#if inlumenError}
								<p class="text-error-500 text-sm">{inlumenError}</p>
							{/if}

							{#if inlumenPipelines.length > 0}
								<div
									class="border border-surface-300-600-token rounded-container-token overflow-hidden"
								>
									<table class="table table-compact w-full text-sm">
										<thead>
											<tr>
												<th class="w-6"></th>
												<th>Name</th>
												<th>Version</th>
												<th>Updated</th>
											</tr>
										</thead>
										<tbody>
											{#each inlumenPipelines as version (version.uid)}
												<tr
													class="cursor-pointer hover:variant-soft-primary transition-colors"
													class:variant-filled-primary={selectedVersionUid === version.uid}
													on:click={() => {
														selectedVersionUid = version.uid;
													}}
												>
													<td>
														<input
															type="radio"
															class="radio"
															name="inlumen-version"
															value={version.uid}
															bind:group={selectedVersionUid}
														/>
													</td>
													<td class="font-medium">{version.name}</td>
													<td class="text-surface-500-400-token">{version.version ?? '—'}</td>
													<td class="text-surface-500-400-token text-xs"
														>{formatDate(version.updated_at)}</td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				{#if step1Error}
					<p class="text-error-500 text-sm">{step1Error}</p>
				{/if}
			</form>

			<footer class="modal-footer {parent.regionFooter}">
				<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
					{parent.buttonTextCancel}
				</button>
				<button class="btn {parent.buttonPositive}" on:click={goToStep2}>Next →</button>
			</footer>

			<!-- Step 2: review / edit YAML -->
		{:else}
			<div class="modal-form {cForm}">
				<p class="text-sm">
					Review and edit the workflow template for <strong>{projectName}</strong> before creating.
				</p>
				<label class="label">
					<span>Workflow template YAML</span>
					<!-- Line-numbered YAML editor -->
					<div
						class="flex h-96 border border-surface-300-600-token rounded-container-token overflow-hidden font-mono text-xs leading-6"
					>
						<!-- Gutter -->
						<div
							class="w-12 overflow-hidden text-right bg-surface-100-800-token border-r border-surface-300-600-token text-surface-400-300-token select-none shrink-0 py-2"
							bind:this={gutterEl}
						>
							{#each lineNumbers as n}
								<div class="h-6 pr-1.5">{n}</div>
							{/each}
						</div>
						<!-- Editor -->
						<textarea
							class="flex-1 resize-none border-none outline-none py-2 px-2 overflow-auto bg-transparent text-current font-mono text-xs leading-6 whitespace-pre"
							spellcheck="false"
							autocomplete="off"
							bind:value={yamlEditorContent}
							bind:this={textareaEl}
							on:scroll={syncScroll}
						></textarea>
					</div>
				</label>
				{#if yamlError}
					<p class="text-error-500 text-sm">❌ YAML error: {yamlError}</p>
				{/if}
			</div>

			<footer class="modal-footer {parent.regionFooter}">
				<button class="btn {parent.buttonNeutral}" on:click={goBack}>← Back</button>
				<button class="btn {parent.buttonPositive}" disabled={!!yamlError} on:click={onFinish}>
					Create project
				</button>
			</footer>
		{/if}
	</div>
{/if}
