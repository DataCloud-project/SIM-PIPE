<script lang='ts'>
    import { graphQlClient } from "$stores/stores";
    import dry_runs from '$stores/dry_runs.json';
    //let projects: any[] = [];
    function getDryRunsList() {
        //projects = graphQlClient.request(project_dry_runs_query)
        // TODO replace with actual query
        console.log("hello world")
    }
</script>


<!-- Page Header -->
<h1 class="flex justify-left p-2">Dry runs</h1>


<!-- Responsive Container (recommended) -->
<div class="p-5 table-container">
	<!-- Native Table Element -->
    <!-- TODO add margin/padding for table elements -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Name</th>
				<th>Result</th>
				<th>Run duration</th>
                <th>Action</th>
                <th>Date</th>
            </tr>
		</thead>
		<tbody>
			{#each dry_runs as run, i}
				<tr>
                    <td>{run.name}</td>
                    <td>{run.result}</td>
					<td>{run.run_duration}</td>
                    <td>{run.action}</td>
                    <td>{run.date}</td>
                </tr>
			{/each}
		</tbody>
	</table>
</div>


