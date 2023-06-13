<script lang="ts">
	import KubernetesSecretAddNew from '$lib/KubernetesSecretAddNew.svelte';
	import secrets from '../../stores/secrets.json';
</script>




<div>
    <KubernetesSecretAddNew secrets={secrets}/>
</div>