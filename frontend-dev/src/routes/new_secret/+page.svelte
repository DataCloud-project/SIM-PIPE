<script lang="ts">
	import KubernetesSecretAddNew from '$lib/KubernetesSecretAddNew.svelte';
	import secrets from '$lib/secrets.json';
</script>




<div>
    <KubernetesSecretAddNew secrets={secrets}/>
</div>