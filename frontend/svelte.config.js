import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */

const config = {
	extensions: ['.svelte'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],

	vitePlugin: {
		inspector: true
	},

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown
			out: 'build',
			precompress: true,
			envPrefix: ''
		}),
		alias: {
			$components: './src/components',
			$stores: './src/stores',
			$styles: './src/styles',
			$utils: './src/utils',
			$queries: './src/queries',
			$typesdefinitions: './src/types.d.ts',
			$src: './src'
		}
	}
};

export default config;
