<script lang="ts">
	import { onMount } from 'svelte';
	import DAG from './dag.svelte';
	import Plot from './plot.svelte';

	const nodes = [
		{ id: '1', label: 'Node 1' },
		{ id: '2', label: 'Node 2' },
		{ id: '3', label: 'Node 3 hello world' },
		{ id: '4', label: 'Node 4' }
	];

	const links = [
		{ source: '1', target: '2' },
		{ source: '1', target: '3' },
		{ source: '2', target: '4' },
		{ source: '3', target: '4' }
	];

	let container: HTMLDivElement;
	let page_width = 0; // default value to be updated onMount and onResize
	let dag_height = 300;
	let plot_height = 150;
	let number_of_nodes = nodes.length;
	let page_width_updated = false;
	let node_col_width = Math.max(...nodes.map((node) => node.label.length)) * 10;
	let col_width = (page_width - node_col_width) / 3;
	let metrics_height = number_of_nodes * plot_height + 50;

	const updatePageWidth = (): void => {
		if (container) {
			page_width = container.getBoundingClientRect().width;
			col_width = (page_width - node_col_width) / 3;
			page_width_updated = true;
		}
	};

	onMount(() => {
		updatePageWidth();

		updatePageWidth();
		window.addEventListener('resize', updatePageWidth);

		return (): void => {
			window.removeEventListener('resize', updatePageWidth);
		};
	});

	$: if (page_width_updated) {
		// This will trigger reactivity and re-render the DAG component
		page_width_updated = false;
		console.log('page_width_updated', page_width);
	}
</script>

<div bind:this={container} class="container">
	<div class="heading">
		<h1>Page</h1>
		<p>This is a page.</p>
	</div>
	<div class="dag-container" style="height:{dag_height}px">
		{#if page_width > 0}
			<div class="dag-container-container">
				<DAG {nodes} {links} width={page_width} height={dag_height} />
			</div>
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
	<div class="metrics-container" style="height:{metrics_height}px">
		{#if page_width > 0}
			<table style="width: 100%;">
				<thead>
					<tr>
						<th style="width: {node_col_width}px;">Node</th>
						<th style="width: calc((100% - {node_col_width}px) / 3);">Duration</th>
						<th style="width: calc((100% - {node_col_width}px) / 3);">Memory</th>
						<th style="width: calc((100% - {node_col_width}px) / 3);">CPU</th>
					</tr>
				</thead>
				<tbody>
					{#each nodes as node}
						<tr>
							<td style="padding:7px">{node.label}</td>
							<td><Plot height={plot_height} width={col_width}></Plot></td>
							<td><Plot height={plot_height} width={col_width}></Plot></td>
							<td><Plot height={plot_height} width={col_width}></Plot></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		width: 100%;
		flex-direction: column;
		padding: 10px;
	}
	.heading {
		margin-bottom: 10px;
	}
	.dag-container {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid white;
		margin-bottom: 10px;
	}
	.dag-container-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.metrics-container {
		width: 100%;
		border: 1px solid white;
	}
</style>
