<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	export let nodes: { id: string; label: string }[];
	export let links: { source: string; target: string }[];
	export let width = 800;
	export let height = 600;

	let svgElement: SVGSVGElement;

	const popupFeatured: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};

	onMount(() => {
		// Create the SVG container
		const svg = d3.select(svgElement).attr('width', width).attr('height', height);

		// Helper function to calculate intersection points
		function getLinkPosition(source, target): { x1: number; y1: number } {
			const dx = target.x - source.x;
			const dy = target.y - source.y;
			const absDx = Math.abs(dx);
			const absDy = Math.abs(dy);
			let x1, y1;

			if (absDx / source.width > absDy / source.height) {
				x1 = source.x + (dx > 0 ? source.width / 2 : -source.width / 2);
				y1 = source.y + (dy * source.width) / (2 * absDx);
			} else {
				x1 = source.x + (dx * source.height) / (2 * absDy);
				y1 = source.y + (dy > 0 ? source.height / 2 : -source.height / 2);
			}

			return { x1, y1 };
		}

		// Drag event handlers
		function dragstarted(event, d): void {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(event, d): void {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(event, d): void {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

		// Double-click event handler
		function nodeDoubleClicked(event, d): void {
			const popup = document.createElement('div');
			popup.className = 'popup';
			popup.style.left = `${event.pageX}px`;
			popup.style.top = `${event.pageY}px`;
			popup.innerHTML = `<p>Node ID: ${d.id}</p><button onclick="this.parentElement.remove()">Close</button>`;
			document.body.append(popup);
		}

		// Create the simulation with nodes and links
		const simulation = d3
			.forceSimulation(nodes)
			.force(
				'link',
				d3
					.forceLink(links)
					.id((d) => d.id)
					.distance(150)
			)
			.force('charge', d3.forceManyBody().strength(-500))
			.force('center', d3.forceCenter(width / 2, height / 2));

		// Define arrow markers for links
		svg
			.append('defs')
			.selectAll('marker')
			.data(['arrow'])
			.enter()
			.append('marker')
			.attr('id', 'arrow')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', 10)
			.attr('refY', 0)
			.attr('markerWidth', 6)
			.attr('markerHeight', 6)
			.attr('orient', 'auto')
			.append('path')
			.attr('d', 'M0,-5L10,0L0,5')
			.attr('fill', 'black');

		// Add links (lines with arrows)
		const link = svg
			.append('g')
			.attr('class', 'links')
			.selectAll('line')
			.data(links)
			.enter()
			.append('line')
			.attr('stroke-width', 2)
			.attr('stroke', 'black')
			.attr('marker-end', 'url(#arrow)');

		// Add nodes (boxes with labels)
		const node = svg
			.append('g')
			.attr('class', 'nodes')
			.selectAll('g')
			.data(nodes)
			.enter()
			.append('g')
			.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
			.on('dblclick', nodeDoubleClicked);

		node
			.append('rect')
			.attr('width', (d) => d.width)
			.attr('height', (d) => d.height || 50)
			.attr('rx', 10)
			.attr('ry', 10)
			.attr('fill', 'lightblue')
			.attr('stroke', 'black')
			.attr('x', (d) => (-d.width || 100) / 2)
			.attr('y', (d) => (-d.height || 50) / 2);

		// Measure text size to set the rect size dynamically
		node
			.append('text')
			.attr('dx', 0)
			.attr('dy', 0)
			.attr('text-anchor', 'middle')
			.text((d) => d.label)
			.each(function (d) {
				const bbox = this.getBBox();
				d.width = bbox.width + 20; // Add padding
				d.height = bbox.height + 20; // Add padding
			})
			.attr('x', 0)
			.attr('y', 5);

		// Update positions during the simulation
		simulation.on('tick', () => {
			link
				.attr('x1', (d) => getLinkPosition(d.source, d.target).x1)
				.attr('y1', (d) => getLinkPosition(d.source, d.target).y1)
				.attr('x2', (d) => getLinkPosition(d.target, d.source).x1)
				.attr('y2', (d) => getLinkPosition(d.target, d.source).y1);

			node.attr('transform', (d) => `translate(${d.x},${d.y})`);
		});
	});
</script>

<svg bind:this={svgElement}></svg>

<style>
	.nodes rect {
		cursor: pointer;
	}
	.nodes text {
		font-family: sans-serif;
		font-size: 14px;
		pointer-events: none; /* Prevent text from capturing drag events */
	}
	.links line {
		stroke: black;
		stroke-width: 2px;
	}
	.popup {
		position: absolute;
		background: white;
		border: 1px solid black;
		padding: 10px;
		z-index: 1000;
	}
</style>
