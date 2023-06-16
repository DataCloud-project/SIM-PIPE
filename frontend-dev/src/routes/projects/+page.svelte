<script lang='ts'>
    import { graphQlClient } from "../../stores/stores";
	import { onMount } from 'svelte';
    import projects from '../../stores/projects.json';
    //let projects: any[] = [];
    function getProjectsList() {
        //projects = graphQlClient.request(all_projects_query)
        // TODO: replace with actual query
        console.log("hello world")
    }
    let checkboxes: Record<string, boolean> = {};

	// onMount add dry_run.names to checkboxes
	onMount(() => {
		projects.forEach((element) => {
			checkboxes[element.name] = false;
		});
	});
</script>


<!-- Page Header -->
<h1 class="flex justify-left p-5">Projects</h1>


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
                <tr class="clickable table-row-checked"  onclick="window.location=`/projects/[project_id]/{project.project_id}`">
                    <td><input type="checkbox" bind:checked={checkboxes[project.name]} class="checkbox" /></td>
                    <td>{project.name}</td>
                    <td>{project.created_date}</td>
                    <td>{project.dry_run_count}</td>
                    <td>{project.simulations_count}</td>
                </tr>
			{/each}
		</tbody>
	</table>
</div>
