<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let width = 500; // width of the plot
	export let height = 300; // height of the plot
	export let xData = [0, 1, 2, 3]; // default x data
	export let yData = [0, 900, 2100, 3000]; // default y data
	export let labels = ['Point 1', 'Point 2', 'Point 3', 'Point 4']; // default labels for data points
	export let coeffs = [0, 1000]; // coefficients for the regression line
	export let regressionMethod = 'linear'; // 'linear' or 'power'
	export let numberOfPoints = 10; // number of points for the regression line

	let svgElement: SVGSVGElement;

	const data = xData.map((x, i) => ({ x, y: yData[i], label: labels[i] })); // combine x, y, and labels into an array of objects

	onMount(() => {
		// D3 code to create scatter plot

		const svg = d3.select(svgElement);

		const margin = { top: 20, right: 20, bottom: 30, left: 40 };
		const plotWidth = width - margin.left - margin.right;
		const plotHeight = height - margin.top - margin.bottom;

		const x = d3
			.scaleLinear()
			.range([0, plotWidth])
			.domain(d3.extent(data, (d) => d.x) as [number, number]);

		const y = d3
			.scaleLinear()
			.range([plotHeight, 0])
			.domain(d3.extent(data, (d) => d.y) as [number, number]);

		const xAxis = d3.axisBottom(x).ticks(5);
		const yAxis = d3.axisLeft(y).ticks(5);

		svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${plotHeight + margin.top})`)
			.call(xAxis);

		svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`).call(yAxis);

		// Create a tooltip element
		const tooltip = d3
			.select('body')
			.append('div')
			.attr('class', 'tooltip')
			.style('position', 'absolute')
			.style('background', 'lightgray')
			.style('padding', '5px')
			.style('border-radius', '5px')
			.style('pointer-events', 'none')
			.style('opacity', 0);

		svg
			.selectAll('.dot')
			.data(data)
			.enter()
			.append('circle')
			.attr('class', 'dot')
			.attr('cx', (d) => x(d.x))
			.attr('cy', (d) => y(d.y))
			.attr('r', 5)
			.attr('fill', 'white')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)
			.on('mouseover', (event, d) => {
				tooltip.transition().duration(200).style('opacity', 0.9);
				tooltip
					.html(d.label)
					.style('left', `${event.pageX + 5}px`)
					.style('top', `${event.pageY - 28}px`);
			})
			.on('mouseout', () => {
				tooltip.transition().duration(500).style('opacity', 0);
			});

		// Define the line function
		let line: d3.Line<{ x: number; y: number }>;
		let lineData: { x: number; y: number }[];
		if (regressionMethod === 'power') {
			line = d3
				.line<{ x: number; y: number }>()
				.x((d) => x(d.x))
				.y((d) => y(coeffs[0] * d.x ** coeffs[1]));

			// Create the first point (min x, min y)
			lineData = [
				{
					x: d3.min(data, (d) => d.x) ?? 0,
					y: coeffs[0] * (d3.min(data, (d) => d.x) ?? 0) ** coeffs[1]
				}
			];

			// Generate n points between the min and max
			const maxX = d3.max(data, (d) => d.x);
			const minX = d3.min(data, (d) => d.x);
			const diff = (maxX ?? 0) - (minX ?? 0);
			const step = (diff ?? 0) / (numberOfPoints - 1);
			for (let i = 0; i < numberOfPoints; i += 1) {
				const minX = d3.min(data, (d) => d.x) ?? 0;
				const xValue = minX + i * step;
				const yValue =
					regressionMethod === 'power'
						? coeffs[0] * xValue ** coeffs[1]
						: coeffs[0] * xValue + coeffs[1];
				lineData.push({ x: xValue, y: yValue });
			}

			// generate the last point (max x, max y)
			const maxX2 = d3.max(data, (d) => d.x) ?? 0;
			const maxX3 = d3.max(data, (d) => d.x) ?? 0;
			lineData.push({
				x: maxX2,
				y: coeffs[0] * maxX3 ** coeffs[1]
			});
		} else {
			line = d3
				.line<{ x: number; y: number }>()
				.x((d) => x(d.x))
				.y((d) => y(coeffs[1] * d.x + coeffs[0]));

			// Generate the line data
			lineData = [
				{
					x: d3.min(data, (d) => d.x) ?? 0,
					y: coeffs[1] * (d3.min(data, (d) => d.x) ?? 0) + coeffs[0]
				},
				{
					x: d3.max(data, (d) => d.x) ?? 0,
					y: coeffs[1] * (d3.max(data, (d) => d.x) ?? 0) + coeffs[0]
				}
			];
		}

		// Append the line to the SVG
		svg
			.append('path')
			.datum(lineData)
			.attr('class', 'line')
			.attr('d', line)
			.attr('fill', 'none')
			.attr('stroke', 'white')
			.attr('stroke-width', 2)
			.attr('stroke-dasharray', '1,5')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);
	});
</script>

<svg bind:this={svgElement} {width} {height}></svg>
