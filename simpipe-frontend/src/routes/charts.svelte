<!-- using highcharts -->
<script>
	import { afterUpdate } from 'svelte';
	import Highcharts from 'highcharts';

	import { selected_resource_usage } from '../stores/stores';
	// import {dayjs} from 'svelte-time';
  import dayjs from 'dayjs';

  let timestamps = [];
  function render_graph (container, title_text, y_title_text, series) {
    afterUpdate(() => {
      Highcharts.chart(container, {
        chart: {
          type: 'line'
        },
        title: {
          text: title_text
        },
        tooltip: {
          split:true
        },
        xAxis: {
          name: 'Timestamps',
          categories: timestamps,
          labels: {
            style: {
              color: 'black',
              fontSize: 18
            }
          },
          title: {
            style: {
              color: 'black',
              fontSize: 18
            }
          }
          // plotLines: [{
          //   color: 'red', // Color value
          //   dashStyle: 'longdashdot', // Style of the plot line. Default to solid
          //   value: Math.max(...series_data), // Value of where the line will appear
          //   width: 2 // Width of the line    
          // }]
        },
        yAxis: {
          labels: {
            style: {
              color: 'black',
              fontSize: 18
            }
          },
          title: {
            text: y_title_text,
            style: {
              color: 'black',
              fontSize: 18
            }
          }
        },
        series: series
		  });
    });
  }

	function get_data() {  
    let usages = $selected_resource_usage;
		let cpu = [];
		let memory = [];
		let memory_max = [];
		let network_rx = [];
		let network_tx = [];
    timestamps = [];
		usages.forEach((usage) => {
			cpu.push(usage.cpu * 100);
			memory.push(usage.memory);
			memory_max.push(usage.memory_max);
			network_rx.push(usage.rx_value);
			network_tx.push(usage.tx_value);
			timestamps.push((dayjs(usage.time).diff(usages[0].time))/1000); // timestamps in seconds from the first timestamp
		});		
        
    render_graph('cpu_container', 'CPU', 'CPU usage in percentage', [
          {		
            name: 'CPU usage',
            data: cpu,
            color: 'orange'
          }
        ] );
    render_graph('memory_container', '', 'Memory usage', [
      {		
        name: 'Memory used',
        data: memory,
        color: 'orange'
      },
      {		
        name: 'Memory max',
        data: memory_max,
        color: 'green'
      },

    ]);
    render_graph('network_container', '', 'Network usage', [
      {		
        name: 'Received bytes',
        data: network_rx,
        color: 'green'
      },
      {		
        name: 'Transferred bytes',
        data: network_tx,
        color: 'orange'
      },

    ]);      
	}

  $: $selected_resource_usage, get_data();
</script>



<div class="graphs">
  <div id="cpu_container" style=" height:500px;" />
</div>

<div class="graphs">
  <div id="memory_container" style=" height:500px;" />
</div>

<div class="graphs">
  <div id="network_container" style=" height:500px;" />
</div>

<!-- <div class="graphs">
	<Chart
		height="380"
		title="Memory"
		data={get_data($selected_resource_usage, 'memory')}
		type="line"
		colors={['light-green', 'light-blue']}
	/>
</div>
<div class="graphs">
	<Chart
		height="380"
		title="Network"
		data={get_data($selected_resource_usage, 'network')}
		type="line"
		colors={['light-green', 'light-blue']}
	/>
</div> -->
<style>
	.graphs {
		float: left;
		width: 33%;
	}
</style>
