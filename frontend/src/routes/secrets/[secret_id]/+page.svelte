<script lang="ts">

    import { selectedCredential, selectedProject } from "../../../stores/stores";
    import { requestGraphQLClient } from "$lib/graphqlUtils";
    import type { Project } from "../../../types";
    import allProjectsQuery from "../../../queries/get_all_projects.js";
    import getWorkflowQuery from "../../../queries/get_workflow_template.js";
    import { ProgressBar } from "@skeletonlabs/skeleton";
	import { error } from "@sveltejs/kit";
	import updateCredentialMutation from "../../../queries/update_workflow_template";
    import { modalStore, type ModalSettings, Modal } from '@skeletonlabs/skeleton';
	import { goto } from "$app/navigation";

    let hideModal = false;
	let alertModal = false;

	const getProjectsList = async (): Promise<Project[]> => {
		const response: { projects: Project[] } = await requestGraphQLClient(allProjectsQuery);
		return response.projects;
	};

    const getDataPromise = getProjectsList();
    const projectsList: Project[] = [];

    getDataPromise.then((data) => {
        projectsList.push(...data)
    });

    let template: JSON;
    let submit_response: any;

    async function onSubmitForm() {
        console.log("submitting form");

        if (!$selectedProject) {
            throw error(404, "Project not found / project undefined");
        }

        const response = requestGraphQLClient(getWorkflowQuery, {name: $selectedProject.name});

        response.then((data) => {
            template = data.workflowTemplate.argoWorkflowTemplate;
            template.spec["imagePullSecrets"] = [{"name": $selectedCredential.name}];
            // update path of template images:
            template.spec.templates.forEach((template) => {
                if (template.container) {
                    let image = template.container.image;
                    image = image.split("/").slice(-1);
                    template.container.image = $selectedCredential.server + "/" + image;
                };
            });

            if (!$selectedProject) {
                throw error(404, "Project not found / project undefined");
            };

            let input = {
                update: {
                        argoWorkflowTemplate: template,
                        name: $selectedProject.name,
                }
            };

            const submit_response = requestGraphQLClient(updateCredentialMutation, input);

        }).catch((error) => {
            console.log(error);
            throw error(500, error);
        }).finally( async () => {
            if (!$selectedProject) {
                throw error(404, "Project not found / project undefined");
            }
            const workflowTemplateUpdatedMessageModal: ModalSettings = {
                type: 'alert',
                title: 'Secret added to project workflow! 🎉',
                body: `<p>Project: ${$selectedProject.name}</p><p>Now uses registry: ${$selectedCredential.server}</p>`
            };
            alertModal = true;
            modalStore.trigger(workflowTemplateUpdatedMessageModal);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            modalStore.close();
            modalStore.clear();
            goto(`/templates/${$selectedProject.name}`);
        })
    };

</script>

<!-- Page Header -->
<div class="flex w-full content-center p-10">
    {#await getDataPromise}
        <p>Loading metrics...</p>
        <ProgressBar />
    {:then}
    <div class="grid grid-cols-1 w-1/2">
        <div class="card p-5">
            <h1 class="text-2xl">Add {$selectedCredential.name} to project:
                <div>
                    <label class="label">
                        <select class="select" bind:value={$selectedProject}>
                            {#each projectsList as project}
                                <option value={project}>{project.name}</option>
                            {/each}
                        </select></label
                    >
                </div>
            </h1>
            <br />
            <button type="button" class="btn btn-sm variant-filled-warning" on:click={() => { onSubmitForm()
            }}>Submit</button>
        </div>
    </div>
    {/await}
</div>

<Modal />
