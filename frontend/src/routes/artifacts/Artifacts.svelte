<script lang="ts"> 
    import { getModalStore, ProgressBar } from '@skeletonlabs/skeleton';
	  import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import { reactiveBuckets } from '$lib/folders_types';
    import Alert from '$lib/modules/Alert.svelte';
    import type { ArtifactType, Bucket, BucketType } from '$lib/folders_types';

    import { selectedBucket } from '../../stores/stores';
    import FolderStructure from './ArtifactStructure.svelte';

    const modalStore = getModalStore();

    const buckets = writable<Bucket[]>([]);
    let requestsComplete = false;

    let alertTitle: string = '';
    let alertMessage: string = '';
    let alertVariant: string = '';
    let alertVisible: boolean = false;

    async function getBuckets(): Promise<JSON> {
      try {
        const response = await fetch(`/api/minio/buckets`);
        if (!response.ok) {
          const data = await response.json() as JSON;
          throw new Error(`Request error! Failed to load data! ${response.statusText} ${JSON.stringify(data)}`);
        }
        const data = await response.json() as JSON;
        // console.log('getBuckets:', data);
        return data;
      } catch (error) {
        alertVisible = true;
        alertTitle = 'Request Error';
        alertMessage = `${error as string}`;
        alertVariant = 'variant-filled-error';
        // console.error(error);
        return {} as JSON; 
      }
    }

    async function getArtifacts(bucket: string): Promise<{response: ArtifactType[]}> {
      // console.log("fetching artifacts");
      try {
        const response = await fetch(`/api/minio/buckets/objects?bucketName=${bucket}`);
        if (!response.ok) {
          const data = await response.json() as JSON;
          throw new Error(`Request error! Failed to load data! ${response.statusText} ${JSON.stringify(data)}`);
        }
        const data = await response.json() as JSON;
        // console.log('getArtifacts:', data);
        return data;
      } catch (error) {
        alertVisible = true;
        alertTitle = 'Request Error';
        alertMessage = `${error as string}`;
        alertVariant = 'variant-filled-error';
        // console.error(error);
        return {response: []};
      }
    }

   

    async function loadData(): Promise<void>{
      // fetch all buckets
      requestsComplete = false;
      $reactiveBuckets = []; // clear buckets on refresh
      const bucketsList = await getBuckets();
      const requests = bucketsList.response.map(async (bucket) => {
        const artifacts = await getArtifacts(bucket.name);
        return {bucket, artifacts};
      });
      // Update the buckets store inside the Promise.all().then() callback
      Promise.all(requests).then(results => {
        buckets.set(results.map(result => ({bucket: result.bucket, artifacts: result.artifacts.response})) as { bucket: BucketType; artifacts: ArtifactType[]; }[]);
        requestsComplete = true;
      }).catch(error => {
        // console.error('A promise was rejected:', error);
        alertVisible = true;
        alertTitle = 'Request Error';
        alertMessage = `${error}`;
      });
      // console.log('buckets:', $buckets);
      // $buckets = $buckets;
    }

    // TODO: implement the downloadArtifacts function
    // this requires a new API endpoint to be implemented in the api routes
    
    onMount(async () => {
      await loadData();
    });

    // $: console.log('artifacts', artifacts);
    /* eslint-disable no-console */
    $: console.log('buckets:', $buckets);
    $: console.log('requests completed:', requestsComplete);
    $: console.log('selected bucket:', $selectedBucket);
    /* eslint-enable no-console */

</script>

<style>
  .artifacts {
    padding: 1rem;
  }
</style>

<div class="artifacts">
  <div>
    <h1>Buckets</h1>
    {#if !requestsComplete }
      <ProgressBar />
    {:else}
      <div class="p-2">
        <FolderStructure buckets={$buckets} />
      </div>
    {/if}
  </div>
</div>

<Alert 
  visibleAlert={alertVisible} 
  alertTitle={alertTitle} 
  alertMessage={alertMessage} 
  alertVariant={alertVariant}
/>
