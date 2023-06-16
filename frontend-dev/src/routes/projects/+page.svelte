<script lang='ts'>
    import { graphQlClient } from "../../stores/stores";
	import { onMount } from 'svelte';
    import projects from '../../stores/projects.json';
    import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewProject from './modal-submit-new-project.svelte';

	const modalSubmitNewProject: ModalComponent = {
		ref: ModalSubmitNewProject,
	};

	const modal: ModalSettings = {
		type: 'component',
		component: modalSubmitNewProject,
		title: 'Add new project',
		body: 'Enter details of project',
	};
    //let projects: any[] = [];

    function getProjectsList() {
        //projects = graphQlClient.request(all_projects_query)
        // TODO: replace with actual query
        console.log("to be implemented")
    }
    let checkboxes: Record<string, boolean> = {};

	// onMount add dry_run.names to checkboxes
	onMount(() => {
		projects.forEach((element) => {
			checkboxes[element.name] = false;
		});
	});

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


<div class="flex-row ">

    <h1 class="flex justify-left p-5">Projects</h1>

    <div class="flex justify-end">
        <div class="flex-row justify-content-end">	
            <button type="button" class="btn btn-sm variant-filled" on:click={() => (modalStore.trigger(modal))}>
                <span>Create</span>
            </button>			
            <button type="button" class="btn btn-sm variant-filled" on:click={onDeleteSelected}>
                <span>Delete</span>
            </button>
        </div>		
    </div>

    <!-- Responsive Container (recommended) -->
    <div class="p-5 table-container">
        <!-- Native Table Element -->
        <!-- TODO add margin/padding for table elements -->
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
                {#each projects as project}
                    <tr id="clickable_row" class="clickable table-row-checked"  onclick="window.location=`/projects/[project_id]/{project.project_id}`">
                        <td >
                            <input type="checkbox" class="checkbox"  bind:checked={checkboxes[project.name]} on:click={(event) => handleCheckboxClick(event)} />
                        </td>
                        <td>{project.name}</td>
                        <td>{project.created_date}</td>
                        <td>{project.dry_run_count}</td>
                        <td>{project.simulations_count}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<Modal />
