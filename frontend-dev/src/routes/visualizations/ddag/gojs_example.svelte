<script lang="ts">
    // NB! This example uses gojs, which is not open source!
    // check out https://codesandbox.io/s/05uro?file=/src/Diagram.svelte
    //import go from 'gojs/release/go-debug'; // TODO: replace 'go-debug.js' with 'go.js' for production
    import go from 'gojs/release/go';
    import { onMount } from 'svelte';

    const jquery = go.GraphObject.make;

    onMount(async () => {
        const appEl = document.getElementById('app');
        appEl.innerHTML = '';

        const containerEl = document.createElement('div');
        appEl.appendChild(containerEl);

        const diagramEl = document.createElement('div');
        diagramEl.style.width = '100vw';
        diagramEl.style.height = '100vh';
        //diagramEl.style.backgroundColor = 'white';
        containerEl.appendChild(diagramEl);

        const diagram = new go.Diagram(diagramEl);
        diagram.model = new go.GraphLinksModel(
            [ // a JavaScript Array of JavaScript objects, one per node;
            // the "color" property is added specifically for this app
            { key: "Alpha", color: "lightblue" },
            { key: "Beta", color: "orange" },
            { key: "Gamma", color: "lightgreen" },
            { key: "Delta", color: "pink" }
            ],
            [ // a JavaScript Array of JavaScript objects, one per link
            { from: "Alpha", to: "Beta" },
            { from: "Alpha", to: "Gamma" },
            { from: "Beta", to: "Beta" },
            { from: "Gamma", to: "Delta" },
            { from: "Delta", to: "Alpha" }
            ]);
        diagram.initialAutoScale = go.Diagram.Uniform;

    }
    )

    

</script>

<!-- Page Header -->
<div id="app" class="container p-5">
</div>
