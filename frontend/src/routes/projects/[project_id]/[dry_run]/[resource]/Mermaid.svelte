<script lang="ts">
	import mermaid from 'mermaid';

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

	async function renderDiagram() {
		let { svg } = await mermaid.render('mermaid', diagram, container);
		container.innerHTML = svg;
		container.addEventListener('click', function (e: any) {
			if (e.target.attributes.getNamedItem('class').value === 'nodeLabel') {
				//buildDiagram();
				//console.log(diagram);
			}
		});
		return svg;
	}

	$: diagram && renderDiagram();
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
