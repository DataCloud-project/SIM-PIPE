<script lang="ts">
    import Component from './component.svelte';


    let dataFromChild = '';

    function handleMessage(event: Event): void {
        const detail = (event as CustomEvent).detail;
        dataFromChild = detail.text;
    }

    $: console.log(dataFromChild);

</script>

<main>
    <div>
        <h1>Testing my component</h1>
        <Component on:message={handleMessage} />
    </div>
    <div>
        <h2>Data from child: {dataFromChild}</h2>
    </div>
</main>