<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/projects');
	});
</script>

<div class="flex justify-center p-5">
	<div class="card variant-glass-tertiary p-4">
		<header class="card-header">
			<div class="flex justify-center">
				<h1 class="text-blue-500">SIM</h1>
				<h1>PIPE</h1>
			</div>
		</header>
		<section class="p-4">
			<div class="columns-2">
				<div class="flex justify-left">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa voluptas exercitationem quae
					eius hic consequatur reprehenderit sunt repellendus, eum dolor dolore nemo sint sit magni
					quis earum tempora nobis fugiat!
				</div>
				<div class="flex justify-left">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa voluptas exercitationem quae
					eius hic consequatur reprehenderit sunt repellendus, eum dolor dolore nemo sint sit magni
					quis earum tempora nobis fugiat!
				</div>
			</div>
		</section>
		<footer class="card-footer">
			<div class="flex justify-left">
				SINTEF Sustainable Communications Technologies - Smart Data
			</div>
		</footer>
	</div>
</div>
