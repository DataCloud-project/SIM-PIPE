<script lang="ts"> 
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import type { ArtifactHierarchyType, BucketHierarchyType } from '$lib/folders_types';
    import FolderStructure from './ArtifactStructure.svelte';
    import { AlertTriangleIcon, FilePlusIcon, Trash2Icon, XSquareIcon, DownloadIcon } from 'svelte-feather-icons';
    import type { ModalSettings } from '@skeletonlabs/skeleton';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { reactiveArtifacts } from '$lib/folders_types';
    import { reactiveBuckets } from '$lib/folders_types';
    import { selectedBucket } from '../../stores/stores';
    import type { ArtifactType, BucketType, Bucket } from '$lib/folders_types';
	  import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
	import { request } from 'http';

    //import { default_bucket_name } from '$lib/folders_types'; // TODO: remove when not needed anymore

    const modalStore = getModalStore();

    const buckets = writable<Bucket[]>([]);
    let requestsComplete = false;
    //let bucketName: string = default_bucket_name; //TODO: default bucket name (for now)

    let requestError: boolean = false;
    let alertVisible: boolean = false;
    let alertTitle: string = 'Alert Title';
    let alertMessage: string = 'Alert Message';
    let alertVariant: string = 'variant-ghost-surface';

    async function getBuckets(): Promise<{response: BucketType[]}> {
      console.log("fetching buckets");
      try {
        const response = await fetch(`/api/minio/buckets`);
        if (!response.ok) {
          const data = await response.json();
          throw Error(`Request error! Failed to load data! ${response.statusText} ${data.data}`);
        }
        const data = await response.json();
        console.log('getBuckets:', data);
        return data;
      } catch (error) {
        requestError = true;
        alertVisible = true;
        alertTitle = 'Request Error';
        alertMessage = `${error}`;
        alertVariant = 'variant-filled-error';
        console.error(error);
        return {response: []}; 
      }
    }

    async function getArtifacts(bucket: string): Promise<{response: ArtifactType[]}> {
      console.log("fetching artifacts");
      try {
        const response = await fetch(`/api/minio/buckets/objects?bucketName=${bucket}`);
        if (!response.ok) {
          const data = await response.json();
          throw Error(`Request error! Failed to load data! ${response.statusText} ${data.data}`);
        }
        const data = await response.json();
        console.log('getArtifacts:', data);
        return data;
      } catch (error) {
        requestError = true;
        alertVisible = true;
        alertTitle = 'Request Error';
        alertMessage = `${error}`;
        alertVariant = 'variant-filled-error';
        console.error(error);
        return {response: []};
      }
    }

    async function onUploadArtifact() {
      // only one bucket can be selected upon upload
      if (selectedBucket === undefined) {
            alertTitle = '👎 Error';
            alertMessage = 'Select a bucket to upload artifacts to.';
            alertVariant = 'variant-filled-error';
            alertVisible = true;
            return;
      }
      let bucket = $reactiveBuckets.find(b => b.bucket === $selectedBucket);
      let bucketsList: string[] = $reactiveBuckets.map(b => b.bucket);
      console.log(bucketsList);
      let selectedPaths: ArtifactHierarchyType[] = bucket ? getSelectedArtifacts(bucket.artifacts).filter(f => (f.isSelected && !f.name.includes('.'))) : []; // TODO: is there a better way?
      if (selectedPaths.length == 0) {
            alertVisible = false;
            selectedPaths.push({id: '', name: '', path: '', isSelected: true, isExpanded: true, subfolders: []});
      }
      if (selectedPaths.length == 1) {
            alertVisible = false;
      }
      else {
            alertTitle = '👎 Error';
            alertMessage = 'Select max one folder to upload artifacts to.';
            alertVariant = 'variant-filled-error';
            alertVisible = true;
            return;        
      }
      const modal: ModalSettings = {
            type: 'component',
            component: 'uploadFileModal',
            title: 'Upload Artifacts',
            meta: {path: selectedPaths[0].path, bucket: $selectedBucket as string, buckets: bucketsList},            
            response: (r: {bucket: string, path: string, files: FileList}) => { 
              uploadArtifactsToPath(r.bucket, r.files, r.path); }
        };
      modalStore.trigger(modal);
    }

    async function uploadArtifactsToPath(bucket: string, artifactsToUpload: FileList, uploadPath: string) {
        let artifactUploadPath: string = '';
        console.log(uploadPath);
        console.log(artifactsToUpload);
        for (const artifact of artifactsToUpload) {
            if (uploadPath === '') {
                artifactUploadPath = artifact.name;
            }
            else {
                artifactUploadPath = `${uploadPath}/${artifact.name}`;
            }
            console.log(`Uploading ${artifact.name} to ${artifactUploadPath}`);
            const formData = new FormData();
            formData.append('bucketName', bucket);
            formData.append('objectPath', artifactUploadPath);
            const fileText = await artifact.text();
            formData.append('objectDataText', fileText);
            formData.append('objectDataSize', artifact.size.toString());            
            await fetch(`/api/minio/buckets/objects/create`, {
                method: 'POST',
                body: formData
            }).then(response => {
                console.log(' response', response);
                console.log(' response', response.clone().json());
                response.json().then(data => {
                    console.log(' response data', data);
                }).catch(err => {
                    console.log(' error', err);
                });
            });
        }
        //loadData();
    }
    

    async function onDeleteArtifacts(artifactsToDelete: ArtifactHierarchyType[]) {
      console.log('Delete Artifacts');
      const selected = getSelectedArtifacts(artifactsToDelete);
      if (selected.length > 0) {
            const response = await deleteArtifacts(selected);
            alertVisible = true;
            if (response.status === 200) {
                alertTitle = '👍 Delete artifacts';
                alertVariant = 'variant-ghost-success';
                const deletedObjectsList = JSON.stringify(response.message.data.objectsList);
                alertMessage = `Deleted ${deletedObjectsList} in bucket ${response.message.data.bucketName}`;
                //artifacts = await getArtifacts(); TODO: refresh artifacts - this is not working atm.
            }
            else {
                alertTitle = '👎 Delete artifacts failed';
                alertVariant = 'variant-filled-error';
                alertMessage = response.message;
            }
      }
    }


    async function deleteArtifacts(artifacts: ArtifactHierarchyType[]): Promise<{message: string, status: number}> {
      const artifactsPathsList = getAllArtifactPaths(artifacts);
      console.log(artifactsPathsList);

      const formData = new FormData();
      formData.append('bucketName', bucketName);
      formData.append('objectsList', JSON.stringify(artifactsPathsList));
      
      try {
        const response = await fetch(`/api/minio/buckets/objects/delete`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log(' response', response);
        console.log(' response data', data);
        return {message: data, status: response.status};
      } catch (err) {
        console.log(' error', err);
        return {message: (err as Error).toString(), status: 500};
      }
    }

    async function onCreateNewBucket() {
      console.log('Trigger Create New Bucket modal');
      const modal: ModalSettings = {
            type: 'component',
            title: 'Create New Bucket',
            component: 'provideTextInputModal',
            body: 'Provide a name for the new bucket',
            meta: {input_name: 'my-bucket-name'},
            // Populates the input value and attributes
            value: 'my-bucket',
            valueAttr: { type: 'text', minlength: 3, maxlength: 33, required: true },
            // Returns the updated response value
            response: (r: string) => { 
                if (!r) {
                    console.log("No name provided. Operation cancelled.");
                    return;
                }
                else {
                    createNewBucket(r);
                }
            }
        };
        modalStore.trigger(modal);
    }

    async function createNewBucket(name: string) {
      console.log(`Creating bucket: ${name} ...`)
      await fetch(`/api/minio/buckets/create`, {
                method: 'POST',
                body: JSON.stringify({"bucketName": name}),
          }).then(response => {
                console.log(' response', response.clone().json());
                response.json().then(data => {
                    console.log(' response data', data);
                    let words: string[] = [];
                    data.message.split(' ').forEach((word: string) => {
                        words.push(word);
                    });
                    if (words[0] === 'Successfully') {
                        alertTitle = '👍 Create bucket';
                        alertMessage = data.message;
                        alertVariant = 'variant-ghost-success';
                        //loadData();
                    }
                    else {
                        alertTitle = '👎 Create bucket failed';
                        alertMessage = data.message;
                        alertVariant = 'variant-filled-error';
                    }
                    alertVisible = true;
                }).catch(err => {
                    console.log(' error', err);
                });
          });
    }

    function unselectArtifacts(artifacts: ArtifactHierarchyType[]) {
        artifacts.forEach(artifact => {
          artifact.isSelected = false;
          if (artifact.subfolders.length > 0) {
            unselectArtifacts(artifact.subfolders);
          }
        });
      }

    function unselectBuckets(buckets: BucketHierarchyType[]) {
        buckets.forEach(bucket => {
          bucket.isSelected = false;
        });
      }

    function unselectAll() {
      console.log('Unselect All');
      unselectBuckets($reactiveBuckets);
      for (let bucket of $reactiveBuckets) {
        unselectArtifacts(bucket.artifacts);
      }
      $reactiveBuckets = [...$reactiveBuckets]; // Trigger a re-render
    }

    function getSelectedArtifacts(artifacts: ArtifactHierarchyType[]): ArtifactHierarchyType[] {
      //console.log('Get Selected Artifacts');
      let selectedArtifacts: ArtifactHierarchyType[] = findselectedArtifacts(artifacts);
      return selectedArtifacts;
    }

    function findselectedArtifacts(artifacts: ArtifactHierarchyType[]): ArtifactHierarchyType[] {
      let selectedArtifacts: ArtifactHierarchyType[] = [];
      artifacts.forEach(artifact => {
        if (artifact.isSelected) {
          selectedArtifacts.push(artifact);
        }
        if (artifact.subfolders.length > 0) {
          selectedArtifacts.push(...findselectedArtifacts(artifact.subfolders));
        }
      });
      return selectedArtifacts;
    }

    function getAllArtifactPaths(artifacts: ArtifactHierarchyType[]): string[] {
      let paths: string[] = [];

      const traverse = (artifact: ArtifactHierarchyType) => {
          paths.push(artifact.path);
          if (artifact.subfolders) {
              artifact.subfolders.forEach(child => traverse(child));
          }
      };

      artifacts.forEach(artifact => traverse(artifact));
      return paths;
    }    

    async function loadData() {
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
        console.error('A promise was rejected:', error);
      });
      //console.log('buckets:', $buckets);
      //$buckets = $buckets;
    }
    
    onMount(async () => {
      loadData();
    });

    //$: console.log('artifacts', artifacts);
    $: console.log('buckets:', $buckets);
    $: console.log('requests completed: ', requestsComplete);
    $: console.log('selected bucket:', $selectedBucket);
    //$: console.log('request error:', requestError);

</script>
  
<main>
    <div class="flex w-full content-center p-10">
      <div class="table-container">
        <h1>Artifact Browser</h1>
          <!--<div class="header flex space-x-2 p-5">-->
          <br>
          <div class="grid grid-cols-2">
            <div class="header flex space-x-2 place-self-start">
              <div>
                  <button 
                      on:click={() => onUploadArtifact()}
                      title="Upload Artifact"
                      >
                      <FilePlusIcon size="1.5x"/>
                  </button>
              </div>
              <div>
                  <button 
                  on:click={() => onDeleteArtifacts($reactiveArtifacts)}
                  title="Delete Artifacts"
                  >
                  <Trash2Icon size="1.5x"/>
                  </button>                
              </div>
              <div>
                  <button 
                  on:click={() => unselectAll()}
                  title="Unselect All"
                  >
                  <XSquareIcon size="1.5x"/>
                  </button>                
              </div>
              <div>
                <button 
                on:click={() => console.log('Download Artifacts')}
                title="Download Artifacts"
                >
                <DownloadIcon size="1.5x"/>
                </button>                
            </div>              
            </div>
            <div class="place-self-end">
              <button
                type="button"
                class="btn btn-sm variant-filled"
                on:click={() => onCreateNewBucket()}
              >
                <span>Create new bucket</span>
              </button>
            </div>                   
          </div>
          <div class="p-2">
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
    </div>
</main>

{#if alertVisible}
    <aside class="alert {alertVariant}">
        <!-- Icon -->
        <div class="flex w-full grid grid-cols-2 grid-rows-2 justify-start">
        <div class="col-span-2"><AlertTriangleIcon /></div>
        <!-- Message -->
        <div class="alert-message">
            <h3 class="h3">{alertTitle}</h3>
            <p>{alertMessage}</p>
        </div>
        <!-- Actions -->
        <div class="alert-actions place-self-end">
          <button
            type="button"
            class="btn btn-sm variant-filled"
            on:click={() => alertVisible = false}
            >
            <span>OK</span>
          </button>
        </div>        
    </aside>
{/if}
            

