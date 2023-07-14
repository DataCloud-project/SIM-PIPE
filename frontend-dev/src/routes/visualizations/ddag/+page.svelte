<script lang="ts">
    // https://mermaid.js.org/intro/
    import mermaid from 'mermaid';

    let graphOrientation = 'LR';
    let servers = {
        "server1": "myserver",
        "server2": "Server02",
        "server3": "Server03",
    }
    let colors = {
        "finished": "#50C878",
        "running": "#00FFFF",
        "failed": "#880808",
    }

    // The default diagram
    let diagram = `
        graph ${graphOrientation}
            A[Client] --> B[Load Balancer]
            B --> C[${servers.server1}]
            B --> D[Server02]
            B --> E[Server03]
            C --> B
            D --> B
            E --> B
            style A fill:${colors.running}
            style B fill:${colors.failed}
            style E fill:${colors.finished}
    `;

    let container;

    mermaid.initialize({
        securityLevel: 'loose',
        theme: 'neutral',
        });

    async function renderDiagram() {
      const {svg} = await mermaid.render('mermaid', diagram)
      container.innerHTML=svg;
    }

    $: diagram && renderDiagram()
</script>

<div class="container p-5">
  <span bind:this={container}>
</div>
