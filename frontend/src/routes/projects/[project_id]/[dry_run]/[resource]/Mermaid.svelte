<script lang="ts">
    import mermaid from 'mermaid';
    import { afterUpdate, onMount } from 'svelte';

    export let diagram: string;

    let container: Element;

    const mermaidConfig = {
		securityLevel: 'loose',
		theme: 'neutral',
		startOnLoad: true,
		logLevel: 4,
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
    };
    
    $: diagram && renderDiagram();

</script>

<div class="flex place-content-center">
    <span class="mermaid" bind:this={container}></span>
</div>