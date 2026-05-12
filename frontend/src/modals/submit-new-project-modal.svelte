<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import type { SvelteComponent } from 'svelte';

	import { requestGraphQLClient } from '$lib/graphql-utils.js';

	import createProjectMutation from '$queries/create_project.js';
	import createWorkflowTemplateMutation from '$queries/create_workflow_template.js';
	import { cBase, cForm, cHeader } from '$styles/styles.js';
	import { validateYAML } from '$utils/argo-utils.js';

	// Props - Exposes parent props to this component
	export let parent: SvelteComponent;

	// modalStore is a store that is used to trigger modals
	const modalStore = getModalStore();

	// Keep a reference to the modal response handler before the modal is closed
	let responseHandler: ((response: any) => void) | undefined;

	// Step: 1 = upload, 2 = review/edit YAML
	let step = 1;

	// Step 1 fields
	let projectName: string = '';
	let inputFilesList: FileList;
	let step1Error: string = '';

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

	// Move to step 2: validate inputs and parse the uploaded file into YAML
	async function goToStep2(): Promise<void> {
		step1Error = '';

		if (!projectName.trim()) {
			step1Error = 'Project name is required.';
			return;
		}
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

		<!-- Step indicator -->
		<div
			class="grid grid-cols-2 overflow-hidden rounded-container-token border border-surface-300-600-token"
		>
			<div
				class="flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors"
				class:variant-filled-primary={step === 1}
				class:variant-soft-primary={step > 1}
			>
				<span
					class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0"
					class:bg-primary-100={step === 1}
					class:text-primary-600={step === 1}
					class:bg-primary-500={step > 1}
					class:text-white={step > 1}
				>
					{step > 1 ? '✓' : '1'}
				</span>
				Upload template
			</div>

			<div
				class="flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors border-l border-surface-300-600-token"
				class:variant-filled-primary={step === 2}
				class:variant-soft-primary={step < 2}
			>
				<span
					class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0"
					class:bg-primary-100={step === 2}
					class:text-primary-600={step === 2}
					class:bg-surface-200-700-token={step < 2}
					class:text-surface-600-300-token={step < 2}
				>
					2
				</span>
				Review &amp; create
			</div>
		</div>

		<!-- Step 1: project name + file upload -->
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
				<label class="label">
					<span
						>Upload workflow template <span class="text-xs opacity-60">(YAML or JSON)</span></span
					>
					<input class="input" type="file" accept=".yaml,.yml,.json" bind:files={inputFilesList} />
				</label>
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
