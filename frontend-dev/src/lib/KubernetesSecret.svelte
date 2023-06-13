<script lang="ts">
    let secret: { [key: string]: string} = {
        name: 'kube-secret',
        username: 'kube-username',
        password: 'kube-password',
        host: 'kube-host',
    };

    let checked: boolean = false;

    function returnDots(input_text: string) {
        let star = "*";
        return star.repeat(input_text.length)
    }
    </script>

<!-- Visual part of component -->
<div class="table-container">
    <header class="card-header container-fluid">
        <div align="left">{ secret.name }</div>
        <div align="right"><input type=checkbox checked={checked}></div>
    <table class="table table-hover">
        {#each Object.keys(secret) as key}
            <tr>
                {#if key === 'password'}
                    <td>{key}: {returnDots(secret[key])}</td>
                {:else}
                    <td>{key}: {secret[key]}</td>
                {/if}
            </tr>
        {/each}
    </table>
</div>
