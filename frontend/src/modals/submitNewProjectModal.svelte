<script lang="ts">
	import { cBase, cHeader, cForm } from '../styles/styles.js';
	import createProjectMutation from '../queries/create_project.js';
	import createWorkflowTemplateMutation from '../queries/create_workflow_template.js';
	import yaml from 'js-yaml';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';
    import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

    // Props - Exposes parent props to this component
    export let parent: SvelteComponent;

    // modalStore is a store that is used to trigger modals
    const modalStore = getModalStore();

    // variables
    let project_name: string = '';
    let project_id: string;
    let input_files_list: FileList;
    let workflow_template: JSON;
	$: template_name = project_name.replace(/\s+/g, '-').toLowerCase();
    

    // graphql request to create a new project
	async function createProject(): Promise<{status: number, error: string, project: {name: string, id: string}}> {
        let name = project_name;
		const variablesCreateProjectRequest = {
			project: { name }
		};
		return requestGraphQLClient<{createProject: {name: string, id: string}}>(
			createProjectMutation,
			variablesCreateProjectRequest
		).then(data => {
			return { status: 200, error: '', project: { name: data.createProject.name, id: data.createProject.id }};
		}).catch(error => {
			//console.log(`createProject error: ${error}`);
            //throw new Error(`createProject error: ${error}`);
			return { status: 500, error: error, project: { name: 'none', id: 'none' } };
		});
	}

    // graphql request to create a new workflow template
	async function createWorkflowTemplate(): Promise<{status: number, error: string, name: string}> {

        let projectId = project_id;
        let name = template_name;
        let argoWorkflowTemplate = workflow_template;

        const createTemplateVariables = {
                input: {
                    argoWorkflowTemplate: argoWorkflowTemplate,
                    name: name,
                    projectId: projectId
            }
        };

		return requestGraphQLClient<{createWorkflowTemplate: {name: string}}>(
			createWorkflowTemplateMutation,
			createTemplateVariables
		).then(data => {
			console.log("createWorkflowTemplate response:")
			console.log(data)
			return { status: 200, error: '', name: data.createWorkflowTemplate.name} ;
		}).catch(error => {
			//console.log(`createWorkflowTemplate error: ${error}`);
            //throw new Error(`createWorkflowTemplate error: ${error}`);
			return { status: 500, error: error, name: 'none' };
		});
	}

    // handle input file
	async function handleInputFile(): Promise<JSON> {
        let template: JSON = {} as JSON;
		try {
			const file_text = await input_files_list[0].text();
			if (file_text != '') {
				try {
					template = JSON.parse(file_text);
				} catch {
					template = yaml.load(file_text) as JSON;
				}
			}
		} catch (error) {
            console.log(`handleInputFile error: ${error}`)
            //throw new Error(`handleInputFile error: ${error}`);
		}
        return template;
	}

    async function onClose(response: any) {
        if ($modalStore[0] && typeof $modalStore[0].response === 'function') {
                    $modalStore[0].response(response);
        }
    }


    async function onSubmit(): Promise<void> {

        const inputPromise = handleInputFile();

        const createProjectPromise = createProject();

        const [inputResponse, createProjectResponse] = await Promise.all([inputPromise, createProjectPromise]); 

        if (createProjectResponse.status === 200) {
            project_id = createProjectResponse.project.id;
            workflow_template = inputResponse;
            console.log(`project_id: ${project_id} created`)

            if (workflow_template !== {} as JSON) {
                
                const createWorkflowPromise = createWorkflowTemplate();
                const [createWorkflowResponse] = await Promise.all([createWorkflowPromise]);

                onClose({createProjectResponse, createWorkflowResponse});
            } else {
                console.log(`project_id: ${project_id} created without workflow template`)
                const createWorkflowResponse = {status: 204, error: 'no workflow template provided', name: 'none'};
                onClose({createProjectResponse, createWorkflowResponse});
     
            }

        } else {
            console.log(`project ${project_name} creation failed`);
            onClose({createProjectResponse, createWorkflowResponse: {status: 500, error: 'never created workflow template due to previous errors', name: 'none'}});
        }

        // close the modal
        modalStore.close()
    }

</script>


<!-- The modal form to submit a new project -->
{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Project name</span>
				<div class="flex">
					<input
						class="input"
						type="text"
						bind:value={project_name}
						placeholder="Enter name..."
					/>
				</div>
			</label>
			<label class="label">
				Upload project template
				<span>
					<input class="input" type="file" bind:files={input_files_list} />
				</span>
			</label>
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}" on:click={onSubmit}>Submit</button>
		</footer>
	</div>
{/if}