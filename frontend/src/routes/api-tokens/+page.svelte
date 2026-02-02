<script lang="ts">
	import { browser } from '$app/environment';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import getApiTokensQuery from '../../queries/get_api_tokens';
	import updateApiTokensMutation from '../../queries/update_api_tokens';

	type ApiTokens = {
		mooseApiKey: string;
		openrouterApiKey: string;
		openrouterApiKeyPaid: string;
	};

	let tokens: ApiTokens = {
		mooseApiKey: '',
		openrouterApiKey: '',
		openrouterApiKeyPaid: ''
	};

	let loading = true;
	let saving = false;
	let errorMessage: string | null = null;
	let successMessage: string | null = null;
	let showMoose = false;
	let showOpenrouter = false;
	let showOpenrouterPaid = false;

	async function loadTokens(): Promise<void> {
		loading = true;
		errorMessage = null;
		try {
			const response: { apiTokens: ApiTokens } = await requestGraphQLClient(getApiTokensQuery);
			tokens = response.apiTokens;
		} catch (error) {
			console.error(error);
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			errorMessage = `Error loading API tokens: ${(error as Error).message}`;
		} finally {
			loading = false;
		}
	}

	async function saveTokens(): Promise<void> {
		saving = true;
		errorMessage = null;
		successMessage = null;
		try {
			const variables = {
				mooseApiKey: tokens.mooseApiKey,
				openrouterApiKey: tokens.openrouterApiKey,
				openrouterApiKeyPaid: tokens.openrouterApiKeyPaid
			};
			const response: { updateApiTokens: ApiTokens } = await requestGraphQLClient(
				updateApiTokensMutation,
				variables
			);
			tokens = response.updateApiTokens;
			successMessage = 'API tokens updated successfully.';
		} catch (error) {
			console.error(error);
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			errorMessage = `Error updating API tokens: ${(error as Error).message}`;
		} finally {
			saving = false;
		}
	}

	if (browser) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		loadTokens();
	}
</script>

<div class="flex w-full content-center p-10">
	<div class="table-container max-w-3xl mx-auto">
		<h1>Manage API tokens</h1>
		<p class="mt-2 mb-4 text-sm text-surface-500-300-token">
			Configure the API tokens used by the SIM-PIPE controller.
		</p>

		{#if loading}
			<p style="font-size:20px;">Loading API tokens...</p>
			<ProgressBar />
		{:else}
			{#if errorMessage}
				<p class="text-error-500-300-token mb-4">{errorMessage}</p>
			{/if}
			{#if successMessage}
				<p class="text-success-500-300-token mb-4">{successMessage}</p>
			{/if}

			<div class="space-y-4">
				<label class="label">
					<span>MOOSE_API_KEY</span>
					<div class="flex items-center space-x-2">
						{#if showMoose}
							<input
								class="input flex-1"
								type="text"
								bind:value={tokens.mooseApiKey}
								placeholder="Enter MOOSE API key (optional)"
								autocomplete="off"
							/>
						{:else}
							<input
								class="input flex-1"
								type="password"
								bind:value={tokens.mooseApiKey}
								placeholder="Enter MOOSE API key (optional)"
								autocomplete="off"
							/>
						{/if}
						<button
							class="btn btn-xs variant-soft"
							type="button"
							on:click={() => (showMoose = !showMoose)}
						>
							{showMoose ? 'Hide' : 'Show'}
						</button>
					</div>
				</label>
				<label class="label">
					<span>OPENROUTER_API_KEY</span>
					<div class="flex items-center space-x-2">
						{#if showOpenrouter}
							<input
								class="input flex-1"
								type="text"
								bind:value={tokens.openrouterApiKey}
								placeholder="Enter OpenRouter API key (optional)"
								autocomplete="off"
							/>
						{:else}
							<input
								class="input flex-1"
								type="password"
								bind:value={tokens.openrouterApiKey}
								placeholder="Enter OpenRouter API key (optional)"
								autocomplete="off"
							/>
						{/if}
						<button
							class="btn btn-xs variant-soft"
							type="button"
							on:click={() => (showOpenrouter = !showOpenrouter)}
						>
							{showOpenrouter ? 'Hide' : 'Show'}
						</button>
					</div>
				</label>
				<label class="label">
					<span>OPENROUTER_API_KEY_PAID</span>
					<div class="flex items-center space-x-2">
						{#if showOpenrouterPaid}
							<input
								class="input flex-1"
								type="text"
								bind:value={tokens.openrouterApiKeyPaid}
								placeholder="Enter OpenRouter paid API key (optional)"
								autocomplete="off"
							/>
						{:else}
							<input
								class="input flex-1"
								type="password"
								bind:value={tokens.openrouterApiKeyPaid}
								placeholder="Enter OpenRouter paid API key (optional)"
								autocomplete="off"
							/>
						{/if}
						<button
							class="btn btn-xs variant-soft"
							type="button"
							on:click={() => (showOpenrouterPaid = !showOpenrouterPaid)}
						>
							{showOpenrouterPaid ? 'Hide' : 'Show'}
						</button>
					</div>
				</label>
			</div>

			<div class="flex flex-row justify-end p-5 space-x-1">
				<button
					class="btn btn-sm variant-filled"
					type="button"
					disabled={saving}
					on:click={saveTokens}
				>
					<span>{saving ? 'Saving…' : 'Save changes'}</span>
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.table-container {
		width: 100%;
	}
</style>
