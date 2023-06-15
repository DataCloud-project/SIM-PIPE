<script lang='ts'>
    import { graphQlClient } from "../../stores/stores";
    import projects from '../../stores/projects.json';
    //let projects: any[] = [];
    function getProjectsList() {
        //projects = graphQlClient.request(all_projects_query)
        // TODO replace with actual query
        console.log("hello world")
    }
    let project_id = '10';
</script>


<!-- Page Header -->
<h1 class="flex justify-left p-2">Projects</h1>


<!-- Responsive Container (recommended) -->
<div class="p-5 table-container">
	<!-- Native Table Element -->
    <!-- TODO add margin/padding for table elements -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Name</th>
				<th>Created date</th>
				<th>Dry runs</th>
                <th>Simulation runs</th>
            </tr>
		</thead>
		<tbody>
			{#each projects as project}
<<<<<<< HEAD
                <!-- TODO: fix routing per row in table -->
                <a href="/projects/[project_id]/dry-run/{project.project_id}">
                    <tr>
=======
                <tr class="clickable"  onclick="window.location=`/projects/[project_id]/{project.project_id}`">
>>>>>>> c35c82d33a9b1f41947d78823c90673e067f9a06
                        <td>{project.name}</td>
                        <td>{project.created_date}</td>
                        <td>{project.dry_run_count}</td>
                        <td>{project.simulations_count}</td>
                </tr>
			{/each}
		</tbody>
	</table>
</div>
