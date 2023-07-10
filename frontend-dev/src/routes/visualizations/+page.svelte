<svelte:head>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</svelte:head>


<script lang="ts">
    import { afterUpdate, onMount } from 'svelte';
    import { modeCurrent } from '@skeletonlabs/skeleton';


    var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter',
        name: "Name 1"
    };

    var trace2 = {
        x: [1, 2, 3, 4],
        y: [16, 5, 11, 9],
        type: 'scatter',
        name: "Name 2"
    };

    var data = [trace1, trace2];
    
    $: textcolor = $modeCurrent === true ? '#000000' : '#ffffff';

    $: layout = {
        font: {size: 10, color:textcolor},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {title: 'xaxis title'},
        yaxis: {title: 'yaxis title'},
    };

    var config = {
        responsive: true,
        scrollZoom: true,
    }

    const drawPlot1 = () => {
        let plot1 = document.getElementById('plot1');
        layout.xaxis = {title: 'time (s)'};
        layout.yaxis = {title: 'CPU'};
		let p1 = new Plotly.newPlot(plot1, {"data": data, "layout": layout, "config": config});
        console.log(plot1.id)
    };

    const drawPlot2 = () => {
        let plot2 = document.getElementById('plot2');
        layout.xaxis = {title: 'time (s)'};
        layout.yaxis = {title: 'Memory'};
		let p2 = new Plotly.newPlot(plot2, {"data": [trace2], "layout": layout, "config": config});
        console.log(plot2.id)
    };    

    onMount(() => {
        drawPlot1();
        drawPlot2();
    });

    afterUpdate(() => {
        drawPlot1();
        drawPlot2();
        console.log(`changed plot textcolor to ${textcolor}`)
    });

</script>

<!-- Page Header -->
<div class="container">
	<h1>Visualizations</h1>
    <div class="placeholder">
        <p> Here we can place the DAG </p>
    </div>
    <div class="flex flex-row">
        <div class="card p-4 basis-1/2">
            <div id="plot1"></div>
        </div>
        <div class="card p-4 basis-1/2">
            <div id="plot2"></div>
        </div>
    </div>
</div>