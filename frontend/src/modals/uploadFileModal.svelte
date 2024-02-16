<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount, type SvelteComponent } from "svelte";
    import { FileDropzone } from '@skeletonlabs/skeleton';
    import { FilePlusIcon } from 'svelte-feather-icons';
    import { formatBytes } from '$lib/formatBytes';

    // Props - Exposes parent props to this component
    export let parent: SvelteComponent;

    const modalStore = getModalStore();

    // Upload path
    let path: string = $modalStore[0].meta.path; // artifact path
    let selected_bucket: string = $modalStore[0].meta.bucket; // currently selected bucket name
    let bucketsList: string[] = $modalStore[0].meta.buckets; // list of all buckets
    $: path_placeholder = path != '' ? path : '(optional)';
    $: console.log('selected bucket:', selected_bucket);
    $: console.log('path:', path);

    // Files list
    let files: FileList;

    // Handle form submission
    function onFormSubmit(): void {
        filterPath();
        if (files && files.length > 0) {
            if ($modalStore[0].response) {
                $modalStore[0].response({bucket: selected_bucket, path: path, files: files});
            }
        }

		modalStore.close();
    }

    function filterPath(): void {
        path = path.trim();
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        if (path.endsWith('/')) {
            path = path.substring(0, path.length - 1);
        }
        path = path.replace(' ', '');
    }

    /*     on:change={onChangeHandler}
    function onChangeHandler(e: Event): void {
        console.log(path);
    	console.log('file data:', e);
    } */

    onMount(() => {
        filterPath();
    });

    // Base classes
    const cBase = 'card p-4 w-modal shadow-xl space-y-4';
    const cHeader = 'text-2xl font-bold';

</script>

{#if $modalStore[0]}
    <div class="modal-upload-files {cBase}">
        <header class={cHeader}>{$modalStore[0].title ?? '(title mising)'}</header>
        <div>
            <span>Bucket:</span>
            <select class="select">
                {#each bucketsList as bucket}
                    <option value={bucket} selected={bucket === selected_bucket}>{bucket}</option>
                {/each}
            </select>
        </div>
        <div>
            <span>Path:</span>
            <input class="input" type="text" placeholder="Upload path: {path_placeholder}" bind:value={path}>
        </div>
            <!--<input class="input" type="file" id="file-input" multiple>-->
        <FileDropzone name="files" bind:files={files} multiple>
            <div class="flex justify-center items-center" slot="lead">
                <div class="place-self-center"><FilePlusIcon /></div>
            </div>
            <svelte:fragment slot="message">Upload files or drag and drop</svelte:fragment>
            <div class="flex grid grid-cols-1 justify-center" slot="meta">
                {#if files}
                    {#each files as file}
                        <div>
                            <span>{file.name}</span>
                            <span>{formatBytes(file.size)}</span>
                        </div>
                    {/each}
                {/if}
            </div>
        </FileDropzone>
        <footer class="modal-footer">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose()}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Upload</button>
        </footer>
    </div>
{/if}