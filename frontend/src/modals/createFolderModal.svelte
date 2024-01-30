<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from "svelte";

    // Props - Exposes parent props to this component
    export let parent: SvelteComponent;

    const modalStore = getModalStore();

    // Handle form submission
    function onFormSubmit(): void {
        const textInput = document.getElementById("text-input") as HTMLInputElement;
        const text = textInput.value;

        if (text) {
            if ($modalStore[0].response) {
                $modalStore[0].response(text);
            }
        }
    }

    function transformMetaInput(meta: string[]) {
        let metaString = '';
        meta.forEach(m => {
            metaString += m + '\n';
        });
        return metaString;
    }

    // Base classes
    const cBase = 'card p-4 w-modal shadow-xl space-y-4';
    const cHeader = 'text-2xl font-bold';

    </script>

    {#if $modalStore[0]}
        <div class="modal-upload-files {cBase}">
            <header class={cHeader}>{$modalStore[0].title ?? '(title mising)'}</header>
            <body class="text-sm">{$modalStore[0].body ?? '(body mising)'}</body>
            {#each $modalStore[0].meta.paths as path}
                <div class="text-sm">{path}</div>
            {/each}
            <input class="input" type="text" id="text-input">
            <footer class="modal-footer">
                <button class="btn {parent.buttonNeutral}" on:click={parent.onClose()}>{parent.buttonTextCancel}</button>
                <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Upload</button>
            </footer>
        </div>
    {/if}
