<script lang="ts">
	import Plot from 'svelte-plotly.js';
	// import type { Data } from 'svelte-plotly.js';

	import { modeCurrent } from '@skeletonlabs/skeleton';

	export let data: any;
	export let plotTitle = 'Plot title';
	export let xaxisTitle = 'xaxis title';
	export let yaxisTitle = 'yaxis title';

	$: textcolor = $modeCurrent === true ? '#000000' : '#ffffff';

	$: layout = {
		font: { size: 10, color: textcolor },
		paper_bgcolor: 'rgba(0,0,0,0)',
		plot_bgcolor: 'rgba(0,0,0,0)',
		xaxis: { title: xaxisTitle, showgrid: true, gridwidth: 1 },
		yaxis: { title: yaxisTitle, showgrid: true, gridwidth: 1 },
		title: plotTitle
	};

	$: noDataLayout = {
		font: { size: 10, color: textcolor },
		xaxis: { visible: false },
		yaxis: { visible: false },
		paper_bgcolor: 'rgba(0,0,0,0)',
		plot_bgcolor: 'rgba(0,0,0,0)',
		title: plotTitle,
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

<!-- eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -->
{#if !data || data.length === 0}
	<Plot {data} layout={noDataLayout} fillParent={true} debounce={250} />
{:else}
	<Plot {data} {layout} fillParent={true} debounce={250} />
{/if}
