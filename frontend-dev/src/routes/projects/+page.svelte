<script lang='ts'>
    import projects from '../../stores/projects.json';
    import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewProject from './modal-submit-new-project.svelte';
	import { projectsList } from '../../stores/stores.js';
	import initKeycloak from '../../lib/keycloak.js';
	import type { Project } from '../../types.js';

	const getProjectsList = async (): Promise<Project[]> => {
		await initKeycloak();
		// const response = await get(graphQLClient).request<{
		// All_Projects: {
		// 	projects: Project[];
		// };
		// }>(all_projects_query);
		// return response.projects;
        // TODO:replace with graphql call
        return projects;
	};
	const projectsPromise = getProjectsList();
    let checkboxes: Record<string, boolean> = {};

    // TODO: move to lib or utils
	projectsPromise
		.then((value) => {
		$projectsList = value;
        $projectsList.forEach((element) => {
			checkboxes[element.name] = false;
		});
		})
		.catch(() => {
		$projectsList = undefined;
		});


	const modalSubmitNewProject: ModalComponent = {
		ref: ModalSubmitNewProject,
	};

	const modal: ModalSettings = {
		type: 'component',
		component: modalSubmitNewProject,
		title: 'Add new project',
		body: 'Enter details of project',
	};

    // TODO: replace with actual api call
    function onDeleteSelected() {
        console.log('Deleting ', Object.keys(checkboxes).filter((item) => checkboxes[item]));
        console.log('To be implemented');
    }
    
    // to disable onclick propogation for checkbox input
    const handleCheckboxClick = (event:any) => {
        event.stopPropagation(); 
    };

</script>


<!-- svelte-ignore missing-declaration -->
<div class="flex-row p-5">
    <h1 >Projects</h1>

    <div class="flex justify-end">
        <div class="flex-row justify-content-end">	
            <button type="button" class="btn btn-sm variant-filled" on:click={() => (modalStore.trigger(modal))}>
                <span>Create</span>
            </button>			
            <button type="button" class="btn btn-sm variant-filled-warning" on:click={onDeleteSelected}>
                <span>Delete</span>
            </button>
        </div>		
    </div>

    <div class="p-5 table-container">
        <!-- TODO add margin/padding for table elements -->
        {#await projectsPromise}
            <p style="font-size:20px;">Loading projects...</p>
            {:then projectsList}
            <table class="table table-interactive">
                <thead>
                    <tr>
                        <th />
                        <th>Name</th>
                        <th>Created date</th>
                        <th>Dry runs</th>
                        <th>Simulation runs</th>
                    </tr>
                </thead>
                <tbody>
                    {#each projectsList as project}
                        <tr id="clickable_row" class="clickable table-row-checked"  onclick="window.location=`/projects/[project_id]/{project.project_id}`">
                            <td >
                                <input type="checkbox" class="checkbox variant-filled"  bind:checked={checkboxes[project.name]} on:click={(event) => handleCheckboxClick(event)} />
                            </td>
                            <td>{project.name}</td>
                            <td>{project.created}</td>
                            <td>{project.dry_run_count}</td> 
                            <td>{project.simulations_count}</td> 
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/await}
    </div>
</div>

<Modal />
