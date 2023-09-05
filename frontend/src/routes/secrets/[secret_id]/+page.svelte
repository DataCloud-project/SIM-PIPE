<script lang="ts">

    import { selectedCredential, selectedProject } from "../../../stores/stores";
    import { requestGraphQLClient } from "$lib/graphqlUtils";
    import type { Project } from "../../../types";
    import allProjectsQuery from "../../../queries/get_all_projects.js";

    // TODO: get projects (done!)
    // TODO: select project to add credential to (done!)
    // TODO: get current workflow template
    // TODO: insert credential into workflow template
    // TODO: update workflow template

	const getProjectsList = async (): Promise<Project[]> => {
		const response: { projects: Project[] } = await requestGraphQLClient(allProjectsQuery);
		return response.projects;
	};

    const getDataPromise = getProjectsList();
    const projectsList: Project[] = [];

    getDataPromise.then((data) => {
        projectsList.push(...data)
    });

</script>

<!-- Page Header -->
<div class="flex w-full content-center p-10">
	<div class="table-container">
        {$selectedCredential.name}
        {$selectedCredential.server}
    </div>
    {#await getDataPromise}
        <div>Loading...</div>
    {:then}
    <div class="card p-5">
        <h1 class="text-2xl">Add {$selectedCredential.name} to 
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
        <button type="button" class="btn btn-sm variant-filled-warning" on:click={() => {
            console.log($selectedProject);
            console.log($selectedCredential);
        }}>Submit</button>
    </div>
    {/await}
</div>
