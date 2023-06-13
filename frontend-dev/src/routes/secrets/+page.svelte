<script lang="ts">
	import KubernetesSecret from '$lib/KubernetesSecret.svelte';
	//const secrets = [{"name": "secret1"}, {"name": "secret2"}]
	import secrets from '$lib/secrets.json';
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



<span>
	<div align="right">
		<button type="button" class="btn variant-filled-warning">
			<span>Delete selected secrets</span>
		</button>
	</div>
</span>
<table>
{#each secrets as secret}
<tr>
	<td><KubernetesSecret secret={secret} /></td>
</tr>
{/each}
</table>