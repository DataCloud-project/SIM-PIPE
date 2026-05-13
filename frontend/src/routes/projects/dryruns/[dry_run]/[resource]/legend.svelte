<script lang="ts">
	import { colors } from './Config';

	type Status = keyof typeof colors;

	const statusLabels: Status[] = Object.keys(colors) as Status[];
</script>

<div class="legend">
	{#each statusLabels as status}
		<div class="legend-item">
			<div class="legend-color-box" style="background-color: {colors[status]};" />
			<span>{status}</span>
		</div>
	{/each}
</div>

<style>
	.legend {
		width: 80%;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 16px;
		margin-left: 80px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.legend-color-box {
		width: 16px;
		height: 16px;
		border-radius: 4px;
	}
</style>
