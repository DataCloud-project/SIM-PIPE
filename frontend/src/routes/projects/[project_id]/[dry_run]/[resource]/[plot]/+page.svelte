<script lang='ts'>
    import { selectedProjectName, selectedDryRunName, selectedMetricsType } from '../../../../../../stores/stores';
    import { goto } from '$app/navigation'

    selectedMetricsType.set('cpu')

</script>

<div class="container p-5">
	<h1>
		<a href="/projects">Projects</a>
		<span STYLE="font-size:14px">/ </span>
		<button on:click={() => goto(`/projects/[project_id]/${$selectedProjectName}`)}
			>{$selectedProjectName}
		</button>
		<span STYLE="font-size:14px">/ </span>
		<button on:click={() => goto(`/projects/[project_id]/${$selectedProjectName}/${$selectedDryRunName}`)} 
            >{$selectedDryRunName}
        </button>
        <span STYLE="font-size:14px">/ {$selectedMetricsType}</span>
	</h1>
</div>