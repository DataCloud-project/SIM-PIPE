<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '@fontsource/ibm-plex-sans/400.css';
	import '@fontsource/ibm-plex-sans/600.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	// More stuff
	import { AppShell, AppBar, AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';

	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { LockIcon, BookOpenIcon, BarChart2Icon, Share2Icon } from 'svelte-feather-icons';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css'; // highlight.js theme
	import { storeHighlightJs } from '@skeletonlabs/skeleton';

	storeHighlightJs.set(hljs);
	const selected = derived(page, ($page) => $page.url.pathname);
</script>

<AppShell>
	<!-- (header) -->
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="flex justify-start">
					<h1 class="text-blue-500">SIM</h1>
					<h1>PIPE</h1>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- (sidebarLeft) -->
	<svelte:fragment slot="sidebarLeft">
		<AppRail>
			<AppRailTile label="Projects" href="/projects"><BookOpenIcon size="1.5x" /></AppRailTile>
			<AppRailTile label="Registry Key Vault" href="/secrets"><LockIcon size="1.5x" /></AppRailTile>
			<!-- <AppRailTile label="dDAG" href="/visualizations/ddag"><Share2Icon size="1.5x" /></AppRailTile> -->
		</AppRail>
	</svelte:fragment>

	<!-- Router Slot -->
	<slot />

	<!-- (pageFooter) -->
	<svelte:fragment slot="footer"></svelte:fragment>
</AppShell>
