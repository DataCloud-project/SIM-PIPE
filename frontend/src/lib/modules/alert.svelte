<script lang="ts">
	import { AlertTriangleIcon } from 'svelte-feather-icons';

	export let visibleAlert = false;
	export let alertTitle = 'Alert!';
	export let alertMessage = 'Alert!';
	export let alertVariant: string = 'variant-ghost-surface';
</script>

{#if visibleAlert}
	<div class="flex w-full content-center p-10">
		<aside class="alert {alertVariant} w-full">
			<div class="flex">
				<div class="row-span-2">
					<AlertTriangleIcon />
				</div>
			</div>
			<div class="grid grid-cols-2 grid-rows-2 w-full justify-between">
				<div class="alert-message row-span-2 ml-10">
					<div>
						<h3 class="h3">{alertTitle}</h3>
					</div>
					<div>
						{@html alertMessage}
					</div>
				</div>
				<div class="alert-actions row-span-2 place-content-end">
					<button
						type="button"
						class="btn btn-sm variant-filled"
						on:click={() => {
							visibleAlert = false;
						}}>OK</button
					>
				</div>
			</div>
		</aside>
	</div>
{/if}