<script lang="ts">
	import KubernetesSecret from '$lib/KubernetesSecret.svelte';
	//const secrets = [{"name": "secret1"}, {"name": "secret2"}]
	import secrets from '../../stores/secrets.json';

	// function redirect to add new secret page
	function redirectToAddNewSecretPage() {
		window.location.href = "/new_secret"
	}
	//import secret from '$lib/KubernetesAddNewSecret.svelte';

	// function deleteSelectedSecrets
	// function deleteSelectedSecrets() {
	// 	let selectedSecrets = document.querySelectorAll('input[type="checkbox"]:checked')
	// 	console.log(selectedSecrets)
	// 	for (let i = 0; i < selectedSecrets.length; i++) {
	// 		let secretToDelete = selectedSecrets[i].id
	// 		secrets.splice(secretToDelete, 1)
	// 	}
	// 	console.log(secrets)
	// };
</script>

<!-- Page Header -->
<div class="p-2">
	<h1>Secrets</h1>
		<div class="flex-col content-around p-5">
			<div class="p-2">
				<div class=p-2>
					<button type="button" class="btn btn-sm variant-filled" on:click={() => redirectToAddNewSecretPage()}>
						<span>Add new secret</span>
				</div>
				<div class=p-2>
					<button type="button" class="btn btn-sm variant-filled-warning">
						<span>Delete selected secrets</span>
					</button>
				</div>
			</div>
		<table>
		{#each secrets as secret}
		<tr>
			<td><KubernetesSecret secret={secret} /></td>
		</tr>
		{/each}
		</table>
	</div>
</div>