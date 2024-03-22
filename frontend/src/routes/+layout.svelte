<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	// import '@skeletonlabs/skeleton/themes/theme-skeleton.css'; -- removed ref: https://github.com/skeletonlabs/skeleton/discussions/1947
	// import '@skeletonlabs/skeleton/styles/skeleton.css'; -- removed ref: https://github.com/skeletonlabs/skeleton/discussions/1947
	import '@fontsource/ibm-plex-sans/400.css';
	import '@fontsource/ibm-plex-sans/600.css';
	import '../app.postcss';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css'; // highlight.js theme
	import { LockIcon, BookOpenIcon, FileIcon, FolderIcon, StarIcon } from 'svelte-feather-icons';
	import {
		AppShell,
		AppBar,
		AppRail,
		AppRailAnchor,
		LightSwitch,
		storeHighlightJs,
		Modal,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import * as config from '../lib/config';
	import { browser } from '$app/environment';

	initializeStores();

	import UploadFileModal from '../modals/upload-file-modal.svelte';
	import ProvideTextInputModal from '../modals/text-input-modal.svelte';
	import SubmitNewProjectModal from '../modals/submit-new-project-modal.svelte';
	import SubmitNewDryRunModal from '../modals/submit-new-dry-run-modal.svelte';
	import SubmitNewSecretModal from '../modals/submit-new-secret-modal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		uploadFileModal: { ref: UploadFileModal },
		provideTextInputModal: { ref: ProvideTextInputModal },
		createNewProjectModal: { ref: SubmitNewProjectModal },
		submitNewDryRunModal: { ref: SubmitNewDryRunModal },
		submitNewSecretModal: { ref: SubmitNewSecretModal }
	};

	storeHighlightJs.set(hljs);

	function generateServiceUrl(): string {
		if (!browser) {
			return '';
		}

		const serviceUrlFromConfig = config.SFTPGO_URL;

		// Case 1: If the URL is specified in the config, use it.
		if (serviceUrlFromConfig !== undefined) {
			return serviceUrlFromConfig;
		}

		// Case 2: If it's localhost
		const localhostMatch = window.location.host.match(/^(localhost|127\.0\.0\.\d+|::1)(:\d+)?$/);
		if (localhostMatch) {
			return 'http://localhost:8083';
		}

		// Case 3: If the URL is a dns and uses the default port (443)
		const url = new URL(window.location.href);
		if (url.port === '' || url.port === '443') {
			const domainParts = url.hostname.split('.');
			const deepestSubdomain = domainParts[0];
			return `https://${deepestSubdomain}-sftpgo.${domainParts.slice(1).join('.')}`;
		}

		// Case 4: Otherwise, current url /sftgo
		return `${window.location.origin}/sftgo`;
	}
</script>

<Modal components={modalRegistry} />

<AppShell>
	<!-- (header) -->
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="flex justify-start">
					<h1 class="text-blue-500"><a href="/">SIM</a></h1>
					<h1><a href="/">PIPE</a></h1>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- (sidebarLeft) -->
	<svelte:fragment slot="sidebarLeft">
		<AppRail>
			<AppRailAnchor
				label="Projects"
				href="/projects"
				selected={$page.url.pathname === '/projects'}
			>
				<div class="flex flex-col items-center justify-center">
					<div>
						<BookOpenIcon size="1.5x" />
					</div>
					<div>Projects</div>
				</div>
			</AppRailAnchor>
			<AppRailAnchor
				label="Artifacts"
				href="/artifacts"
				selected={$page.url.pathname === '/artifacts'}
			>
				<div class="flex flex-col items-center justify-center">
					<div>
						<FolderIcon size="1.5x" />
					</div>
					<div>Artifacts</div>
				</div>
			</AppRailAnchor>
			<AppRailAnchor
				label="Registry Key Vault"
				href="/secrets"
				selected={$page.url.pathname === '/secrets'}
			>
				<div class="flex flex-col items-center justify-center">
					<div>
						<LockIcon size="1.5x" />
					</div>
					<div>Registry</div>
				</div>
			</AppRailAnchor>
			<!-- TO DO: temporary redirect to sftp go web interface; will be replaced by files manager when api is ready -->
			<AppRailAnchor label="Sample Files" href={generateServiceUrl()} external={true}>
				<div class="flex flex-col items-center justify-center">
					<div>
						<FileIcon size="1.5x" />
					</div>
					<div>Files</div>
				</div>
			</AppRailAnchor>
			<!-- 			<AppRailAnchor label="Ideas" href="/ideas" selected={$page.url.pathname === '/ideas'} >
				<div class="flex flex-col items-center justify-center">
					<div>
						<StarIcon size="1.5x" />
					</div>
					<div>
						Ideas
					</div>
				</div>
			</AppRailAnchor>			 -->
		</AppRail>
	</svelte:fragment>

	<!-- Router Slot -->
	<slot />

	<!-- (pageFooter) -->
	<svelte:fragment slot="footer" />
</AppShell>
