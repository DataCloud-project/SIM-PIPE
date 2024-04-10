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
			useMaxWidth: true,
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

<div class="mermaid justify-self-center" bind:this={container} />

<style>
	.mermaid {
		max-width: 80%;
		max-height: 80vh;
		width: unset;
		height: unset;
	}
</style>
