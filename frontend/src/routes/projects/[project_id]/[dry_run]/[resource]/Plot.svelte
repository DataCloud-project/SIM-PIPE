<script lang="ts">
	import Plot, { type Data } from 'svelte-plotly.js';

	import { modeCurrent } from '@skeletonlabs/skeleton';

	export let data: any;
	export let plot_title = 'Plot title';
	export let xaxis_title = 'xaxis title';
	export let yaxis_title = 'yaxis title';

	$: textcolor = $modeCurrent === true ? '#000000' : '#ffffff';

	$: layout = {
		font: { size: 10, color: textcolor },
		paper_bgcolor: 'rgba(0,0,0,0)',
		plot_bgcolor: 'rgba(0,0,0,0)',
		xaxis: { title: xaxis_title, showgrid: true, gridwidth: 1 },
		yaxis: { title: yaxis_title, showgrid: true, gridwidth: 1 },
		title: plot_title
	};

	$: noDataLayout = {
		font: { size: 10, color: textcolor },
		xaxis: { visible: false },
		yaxis: { visible: false },
		paper_bgcolor: 'rgba(0,0,0,0)',
		plot_bgcolor: 'rgba(0,0,0,0)',
		title: plot_title,
		annotations: [
			{
				text: 'No data',
				xref: 'paper',
				yref: 'paper',
				showarrow: false,
				font: {
					size: 18
				}
			} as any
		]
	};
</script>

{#if data.length === 0}
	<Plot {data} layout={noDataLayout} fillParent="width" debounce={250} />
{:else}
	<Plot {data} {layout} fillParent="width" debounce={250} />
{/if}
