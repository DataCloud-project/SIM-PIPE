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
<h1 class="flex justify-left p-2">Secrets</h1>

<span>
	<div class="flex content-around">
		<div>
			<button type="button" class="btn variant-filled" on:click={() => redirectToAddNewSecretPage()}>
				<span>Add new secret</span>
		</div>
		<div>
			<button type="button" class="btn variant-filled-warning">
				<span>Delete selected secrets</span>
			</button>
		</div>
	</div>
</span>
<table>
{#each secrets as secret}
<tr>
	<td><KubernetesSecret secret={secret} /></td>
</tr>
{/each}
</table>