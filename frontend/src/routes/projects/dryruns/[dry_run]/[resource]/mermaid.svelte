<script lang="ts">
	import mermaid from 'mermaid';
	import { onMount } from 'svelte';

	export let diagram: string;

	let container: Element;

	const mermaidConfig = {
		securityLevel: 'loose',
		theme: 'neutral',
		startOnLoad: true,
		logLevel: 4,
		fontFamily: 'sans-serif',
		fontSize: 20,
		flowchart: {
			useMaxWidth: false,
			htmlLabels: true,
			curve: 'basis'
		}
	};
	mermaid.initialize(mermaidConfig);

	async function renderDiagram(): Promise<string> {
		const { svg } = await mermaid.render('mermaid', diagram, container);
		container.innerHTML = svg;
		// eslint-disable-next-line prefer-arrow-callback, func-names
		container.addEventListener('click', function (e: any) {
			if (e.target.attributes.getNamedItem('class').value === 'nodeLabel') {
				// buildDiagram();
				// console.log(diagram);
			}
		});
		return svg;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-expressions, unicorn/prefer-top-level-await
	$: diagram;

	onMount(async () => {
		await renderDiagram();
	});
</script>

<div class="mermaid-wrapper">
	<div class="mermaid" bind:this={container} />
</div>

<style>
	.mermaid-wrapper {
		width: 100%;
		overflow-x: auto;
		overflow-y: visible;
		padding: 20px;
	}
	
	.mermaid {
		width: max-content;
		min-width: 100%;
		height: auto;
	}

	/* Force larger SVG size */
	:global(.mermaid svg) {
		min-width: 800px !important;
		width: auto !important;
		height: auto !important;
		max-width: none !important;
	}
</style>
