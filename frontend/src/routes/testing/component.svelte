<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function sendDataToParent() {
        dispatch("message", {
            text: "Hello from the child component"
        });
    }

</script>

<style>
    .test-component {
        padding: 20px;
        border-radius: 5px;
        margin-top: 20px;
    }
</style>

<div class="test-component">
    <h2>Test Component</h2>
    <button on:click={sendDataToParent}>Send Data to Parent</button>
</div>