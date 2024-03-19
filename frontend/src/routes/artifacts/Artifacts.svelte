<script lang="ts"> 
    import { ProgressBar } from '@skeletonlabs/skeleton';
	  import { onMount } from 'svelte';

    import { requestGraphQLClient } from '$lib/graphqlUtils';
    import allBucketsQuery from '$queries/get_all_buckets';
    import allArtifactsQuery from '$queries/get_all_artifacts';

    import { selectedBucket, reactiveBuckets, buckets } from '$stores/stores';
    import Alert from '$lib/modules/alert.svelte';
    
    // TODO: consolidate types in the types.d.ts file
    //import type { ArtifactType, BucketType } from '$lib/folders_types';
    import type { Bucket, Artifact, BucketWithArtifacts } from '$typesdefinitions';

    import FolderStructure from './artifact-structure.svelte';


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

    async function getArtifacts(bucket: string): Promise<JSON> {
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
        return {} as JSON;
      }
    }

  
    async function loadData2(): Promise<void>{

      const buckets_response: { buckets: Bucket[] } = await requestGraphQLClient(allBucketsQuery);
      const requests = buckets_response.buckets.map(async (bucket) => {
        const artifacts: {artifacts: Artifact[]} = await requestGraphQLClient(allArtifactsQuery, { bucketName: bucket.name });
        return {bucket, artifacts};
      });
      Promise.all(requests).then(results => {
        buckets.set(results.map(result => ({bucket: result.bucket, artifacts: result.artifacts.artifacts})) as BucketWithArtifacts[]);
        requestsComplete = true;
      }).catch(error => {
        // console.error('A promise was rejected:', error);
        alertVisible = true;
        alertTitle = 'Request Error';
        alertMessage = `${error}`;
      });
    }

    // TODO: implement the downloadArtifacts function
    // this requires a new API endpoint to be implemented in the api routes
    
    onMount(async () => {
      // await loadData();
      await loadData2();
      console.log("artifacts mounted");
    });

    /* eslint-disable no-console */
    $: console.log('buckets:', buckets);
    $: console.log('requests completed:', requestsComplete);
    $: console.log('selected bucket:', selectedBucket);
    // $: console.log('data', data);
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
