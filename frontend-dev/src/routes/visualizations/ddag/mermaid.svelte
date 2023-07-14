<script lang='ts'>
    import mermaid from 'mermaid';
    import { onMount } from "svelte";

    export let theme = 'default';

    onMount(() => {
        mermaid.initialize({
            startOnLoad:true,
            theme
        });
    })

</script>

<div class="mermaid">
    <slot></slot>
</div>