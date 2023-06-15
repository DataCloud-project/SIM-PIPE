<script lang="ts">
    import { onMount } from "svelte";
    //import { setContext } from "svelte";

    export let secret: { [key: string]: string} = {
        name: 'kube-secret',
        username: 'kube-username',
        password: 'kube-password',
        host: 'kube-host',
    };

    function returnDots(input_text: string) {
        let star = "*";
        return star.repeat(input_text.length)
    }
</script>

<!-- Visual part of component -->
<div class="table-container">
    <header class="card-header container-fluid">
        <div class="flex justify-between">
            <div>{ secret.name }</div>
            <div><input type="checkbox"></div>
        </div>
    <table class="table table-hover">
        {#each Object.keys(secret) as key}
            <tr>
                {#if secret.name === 'password'}
                    <td>{key}: {returnDots(secret[key])}</td>
                {:else}
                    <td>{key}: {secret[key]}</td>
                {/if}
            </tr>
        {/each}
    </table>
</div>
