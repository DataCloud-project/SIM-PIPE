<!-- using highstock -->
<script>
	import { afterUpdate } from 'svelte';
	// import Highcharts from 'highcharts';
	import Highcharts from 'highstock-release';

	import { selected_resource_usage } from '../stores/stores';
	// import {dayjs} from 'svelte-time';
	import dayjs from 'dayjs';

	let timestamps = [];
	function render_highchart(container, title_text, y_title_text, series) {
		afterUpdate(() => {
			Highcharts.chart(container, {
				chart: {
					type: 'line',
					zoomtype: 'x'
				},
				title: {
					text: title_text
				},
				// tooltip: {
				// 	// split: true
				// },
				
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

	function render_highstock(container, title_text, y_title_text, series) {
		afterUpdate(() => {
			Highcharts.stockChart(container, {
				rangeSelector: {
					enabled: false
				},
				navigator: {
					xAxis: {
						dateTimeLabelFormats: '%L'
					}
				},
				title: {
					text: title_text
				},
				xAxis: {
					name: 'Timestamps',
					dateTimeLabelFormats: '%L',
					labels: {
						style: {
							color: 'black',
							fontSize: 21
						}
					},
					title: {
						style: {
							color: 'black',
							fontSize: 21
						}
					}
				},
				yAxis: {
					labels: {
						style: {
							color: 'black',
							fontSize: 21
						}
					},
					title: {
						text: y_title_text,
						style: {
							color: 'black',
							fontSize: 21
						}
					}
				},
				series: series
			});
		});
	}

	function get_data_highchart() {
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
			// timestamps.push(Math.round((dayjs(usage.time).diff(usages[0].time))/1000)); // timestamps in seconds from the first timestamp
			timestamps.push(dayjs(usage.time).valueOf()); // timestamps in seconds from the first timestamp
			// timestamps.push(dayjs(usage.time)); // timestamps in seconds from the first timestamp
		});
		console.log(timestamps);
		render_highchart('cpu_container', 'CPU', 'CPU usage in percentage', [
			{
				name: 'CPU usage',
				data: cpu,
				color: 'orange'
			}
		]);
		render_highchart('memory_container', '', 'Memory usage', [
			{
				name: 'Memory used',
				data: memory,
				color: 'orange'
			},
			{
				name: 'Memory max',
				data: memory_max,
				color: 'green'
			}
		]);
		render_highchart('network_container', '', 'Network usage', [
			{
				name: 'Received bytes',
				data: network_rx,
				color: 'green'
			},
			{
				name: 'Transferred bytes',
				data: network_tx,
				color: 'orange'
			}
		]);
	}
	function get_data_highstock() {
		let usages = $selected_resource_usage;
		let cpu = [];
		let memory = [];
		let memory_max = [];
		let network_rx = [];
		let network_tx = [];
		usages.forEach((usage) => {
			let time = dayjs(usage.time).diff(usages[0].time) / 1000;
			// let time = dayjs(usage.time).valueOf();
			cpu.push([time, usage.cpu * 100]);
			memory.push([time, usage.memory]);
			memory_max.push([time, usage.memory_max]);
			network_rx.push([time, usage.rx_value]);
			network_tx.push([time, usage.tx_value]);
		});
		let tooltip = {
			xDateFormat: '%L'
		};
		render_highstock('cpu_container', 'CPU', 'CPU usage in percentage', [
			{
				name: 'CPU usage',
				data: cpu,
				tooltip: {
					xDateFormat: '%L',
					valueDecimals: 2
				}
			}
		]);
		render_highstock('memory_container', '', 'Memory usage', [
			{
				name: 'Memory used',
				data: memory,
				tooltip: tooltip,
				// color: 'orange'
			},
			{
				name: 'Memory max',
				data: memory_max,
				tooltip: tooltip,
				color: 'orange'
			}
		]);
		render_highstock('network_container', '', 'Network usage', [
			{
				name: 'Received bytes',
				data: network_rx,
				// color: 'orange',
				tooltip: tooltip
			},
			{
				name: 'Transferred bytes',
				data: network_tx,
				tooltip: tooltip,
				color: 'orange'
			}
		]);
	}

	$: $selected_resource_usage, get_data_highstock();
</script>

<div class="graphs">
	<div class="graphstyle" id="cpu_container"  />
</div>

<div class="graphs">
	<div class="graphstyle" id="memory_container" />
</div>

<div class="graphs">
	<div class="graphstyle" id="network_container" />
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
		padding: 1px;
	}
	.graphstyle {
		width:720px; height:600px; border-radius:0px; border:1px solid #093a7af5;
	}
</style>
