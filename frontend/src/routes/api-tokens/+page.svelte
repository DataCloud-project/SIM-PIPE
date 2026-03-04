<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { browser } from '$app/environment';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import getApiTokensQuery from '../../queries/get_api_tokens';
	import updateApiTokensMutation from '../../queries/update_api_tokens';
	import getK3sClusterSecretQuery from '../../queries/get_k3s_cluster_secret';
	import updateK3sClusterSecretMutation from '../../queries/update_k3s_cluster_secret';

	type ApiTokens = {
		mooseApiKey: string;
		openrouterApiKey: string;
	};

	type K3sClusterSecret = {
		token: string;
		serverIp: string;
	};

	let tokens: ApiTokens = {
		mooseApiKey: '',
		openrouterApiKey: ''
	};

	let k3sSecret: K3sClusterSecret = {
		token: '',
		serverIp: ''
	};

	let loading = true;
	let savingTokens = false;
	let savingK3s = false;
	let errorMessage: string | undefined;
	let successMessage: string | undefined;
	let k3sSuccessMessage: string | undefined;
	let showMoose = false;
	let showOpenrouter = false;
	let showK3sToken = false;

	async function loadData(): Promise<void> {
		loading = true;
		errorMessage = undefined;
		try {
			const [tokensResponse, k3sResponse] = (await Promise.all([
				requestGraphQLClient(getApiTokensQuery),
				requestGraphQLClient(getK3sClusterSecretQuery)
			])) as [{ apiTokens: ApiTokens }, { k3sClusterSecret: K3sClusterSecret }];
			tokens = tokensResponse.apiTokens;
			k3sSecret = k3sResponse.k3sClusterSecret;
		} catch (error) {
			console.error(error);
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			errorMessage = `Error loading secrets: ${(error as Error).message}`;
		} finally {
			loading = false;
		}
	}

	async function saveTokens(): Promise<void> {
		savingTokens = true;
		errorMessage = undefined;
		successMessage = undefined;
		try {
			const variables = {
				mooseApiKey: tokens.mooseApiKey,
				openrouterApiKey: tokens.openrouterApiKey
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
			savingTokens = false;
		}
	}

	async function saveK3sSecret(): Promise<void> {
		savingK3s = true;
		errorMessage = undefined;
		k3sSuccessMessage = undefined;
		try {
			const variables = {
				token: k3sSecret.token,
				serverIp: k3sSecret.serverIp
			};
			const response: { updateK3sClusterSecret: K3sClusterSecret } = await requestGraphQLClient(
				updateK3sClusterSecretMutation,
				variables
			);
			k3sSecret = response.updateK3sClusterSecret;
			k3sSuccessMessage = 'k3s cluster secret updated successfully.';
		} catch (error) {
			console.error(error);
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			errorMessage = `Error updating k3s cluster secret: ${(error as Error).message}`;
		} finally {
			savingK3s = false;
		}
	}

	if (browser) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		loadData();
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
							on:click={() => {
								showMoose = !showMoose;
							}}
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
							on:click={() => {
								showOpenrouter = !showOpenrouter;
							}}
						>
							{showOpenrouter ? 'Hide' : 'Show'}
						</button>
					</div>
				</label>
			</div>

			<div class="flex flex-row justify-end p-5 space-x-1">
				<button
					class="btn btn-sm variant-filled"
					type="button"
					disabled={savingTokens}
					on:click={saveTokens}
				>
					<span>{savingTokens ? 'Saving…' : 'Save changes'}</span>
				</button>
			</div>

			<div class="mt-8 space-y-2">
				<h2>k3s cluster secret (VM helpers)</h2>
				<p class="text-sm text-surface-500-300-token">
					Used by VM/WSL helper scripts so nodes can join the cluster. Leave blank if you will set
					it later.
				</p>
				{#if k3sSuccessMessage}
					<p class="text-success-500-300-token mb-2">{k3sSuccessMessage}</p>
				{/if}
				<label class="label">
					<span>k3s node token</span>
					<div class="flex items-center space-x-2">
						{#if showK3sToken}
							<input
								class="input flex-1"
								type="text"
								bind:value={k3sSecret.token}
								placeholder="Enter k3s node token"
								autocomplete="off"
							/>
						{:else}
							<input
								class="input flex-1"
								type="password"
								bind:value={k3sSecret.token}
								placeholder="Enter k3s node token"
								autocomplete="off"
							/>
						{/if}
						<button
							class="btn btn-xs variant-soft"
							type="button"
							on:click={() => {
								showK3sToken = !showK3sToken;
							}}
						>
							{showK3sToken ? 'Hide' : 'Show'}
						</button>
					</div>
				</label>
				<label class="label">
					<span>k3s server IP</span>
					<input
						class="input flex-1"
						type="text"
						bind:value={k3sSecret.serverIp}
						placeholder="Reachable control-plane IP (e.g. 192.168.1.10)"
						autocomplete="off"
					/>
				</label>

				<div class="flex flex-row justify-end p-5 space-x-1">
					<button
						class="btn btn-sm variant-filled"
						type="button"
						disabled={savingK3s}
						on:click={saveK3sSecret}
					>
						<span>{savingK3s ? 'Saving…' : 'Save k3s secret'}</span>
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.table-container {
		width: 100%;
	}
</style>
