<script lang='ts'>
    import { graphQlClient } from "../../stores/stores";
    import projects from '../../stores/projects.json';
    //let projects: any[] = [];
    function getProjectsList() {
        //projects = graphQlClient.request(all_projects_query)
        // TODO replace with actual query
        console.log("hello world")
    }
</script>

<h1>My Projects</h1>


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
			{#each projects as project, i}
				<tr>
                    <td>{project.name}</td>
                    <td>{project.created_date}</td>
					<td>{project.dry_run_count}</td>
                    <td>{project.simulations_count}</td>
                </tr>
			{/each}
		</tbody>
	</table>
</div>


