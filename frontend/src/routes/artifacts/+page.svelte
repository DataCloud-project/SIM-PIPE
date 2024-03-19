<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings } from '@skeletonlabs/skeleton';    
    import { DownloadIcon, Trash2Icon, UploadIcon, XSquareIcon } from 'svelte-feather-icons';
    import Artifacts from './artifacts.svelte';
    import { reactiveBuckets, selectedBucket } from '$stores/stores';
    import type { ArtifactHierarchyType } from '$typesdefinitions';
    import Alert from '$lib/modules/alert.svelte';
	  import { requestGraphQLClient } from '$lib/graphqlUtils';
    import getUploadPresignedUrl from '$queries/get_presigned_url_upload';
    import deleteArtifactsMutation from '$queries/delete_artifacts';


    let alertTitle: string = '';
    let alertMessage: string = '';
    let alertVariant: string = '';
    let alertVisible: boolean = false;

    // Modal store
    const modalStore = getModalStore();

    // Given list of artifacts, find selected artifacts - recursively loop through all subfolders
    function findselectedArtifactsPerBucket(artifacts: ArtifactHierarchyType[]): ArtifactHierarchyType[] {
      const selectedArtifacts: ArtifactHierarchyType[] = [];
      artifacts.forEach(artifact => {
        if (artifact.isSelected) {
          selectedArtifacts.push(artifact);
        }
        if (artifact.subfolders.length > 0) {
          selectedArtifacts.push(...findselectedArtifactsPerBucket(artifact.subfolders));
        }
      });
      return selectedArtifacts;
    }    

    // Get selected artifacts - loop through all buckets
    function getSelectedArtifactsAllBuckets(): ArtifactHierarchyType[] {
      // console.log('Get Selected Artifacts');
      const selectedArtifacts: ArtifactHierarchyType[] = [];
      for (const bucket of $reactiveBuckets) {
        selectedArtifacts.push(...findselectedArtifactsPerBucket(bucket.artifacts));
      }
      return selectedArtifacts;
    }

    // Get all full path for artifacts - recursively loop through all subfolders
    function getAllArtifactPaths(artifacts: ArtifactHierarchyType[]): string[] {
      const paths: string[] = [];

      const traverse = (artifact: ArtifactHierarchyType) => {
          paths.push(artifact.path);
          if (artifact.subfolders) {
              artifact.subfolders.forEach(child => traverse(child));
          }
      };

      artifacts.forEach(artifact => traverse(artifact));
      return paths;
    }
    
    // Upload artifacts to a given path and a given bucket
    async function uploadArtifactsToPath(bucket: string, artifactsToUpload: FileList, uploadPath: string): Promise<void> {
        let artifactUploadPath: string = '';
        console.log(uploadPath);
        console.log(artifactsToUpload);
        for (const artifact of artifactsToUpload) {
            // eslint did not like the tenary operator here, so sticking with if else
            // eslint-disable-next-line unicorn/prefer-ternary
            if (uploadPath === '') {
                artifactUploadPath = artifact.name;
            } else {
                artifactUploadPath = `${uploadPath}/${artifact.name}`;
            }
            console.log(`Uploading ${artifact.name} to ${artifactUploadPath}`);
            const url: {computeUploadPresignedUrl: string} = await requestGraphQLClient(getUploadPresignedUrl, { bucketName: bucket, key: artifactUploadPath });
            uploadFile(artifact, url.computeUploadPresignedUrl);
        }
    }

    // On upload artifacts
    async function onUploadArtifact(): Promise<void> {
      // only one bucket can be selected upon upload
      if (selectedBucket === undefined) {
            alertTitle = '👎 Error';
            alertMessage = 'Select a bucket to upload artifacts to.';
            alertVariant = 'variant-filled-error';
            alertVisible = true;
            return;
      }
      const bucket = $reactiveBuckets.find(b => b.bucket === $selectedBucket);
      const bucketsList: string[] = $reactiveBuckets.map(b => b.bucket);
      console.log("bucketsList: %d", bucketsList.map(b => b));
      // TODO: is there a better way to get paths for selected artifacts?
      const selectedPaths: ArtifactHierarchyType[] = bucket ? getSelectedArtifactsAllBuckets().filter(f => (f.isSelected && !f.name.includes('.'))) : [];
      if (selectedPaths.length === 0) {
            alertVisible = false;
            selectedPaths.push({id: '', bucket: '', name: '', path: '', isSelected: true, isExpanded: true, subfolders: []});
      }
      if (selectedPaths.length === 1) {
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

    //TODO: Delete bucket
    /*
    async function deleteBucket() {}
    */

    // Delete artifacts given a bucket and a list of artifact paths
    // TODO: Rewrite this function to use graphql mutation in stead
    async function deleteArtifacts(bucketName: string, artifactPathsList: string[]): Promise<{message: string, status: number, bucket: string, paths: string[]}> {
      const bucket = bucketName;
      const paths = artifactPathsList;
      console.log(`Request to delete ${paths.join(', ')}, in bucket: ${bucket}`);

      const response = await requestGraphQLClient(deleteArtifactsMutation, { bucketName: bucket, keys: paths });
      if (response) {
        console.log('response:', response);
        return {message: 'Successfully deleted artifacts', status: 200, bucket, paths};
      } else {
        return {message: 'Error deleting artifacts', status: 500, bucket, paths};
      }
    }

    // Delete artifacts per bucket
    async function deleteArtifactsPerBucket(artifacts: ArtifactHierarchyType[]): Promise<{message: string, status: number, bucket: string, paths: string[]}[]> {
      // find buckets for selected artifacts
      const bucketsList: string[] = [];
      for (const artifact of artifacts) {
        if (!bucketsList.includes(artifact.bucket)) {
            bucketsList.push(artifact.bucket);
        }
      }
      console.log(`Buckets: ${bucketsList.join(', ')}`);
      // for each bucket, delete its artifacts
      const responses: {message: string, status: number, bucket: string, paths: string[]}[] = [];
      for (const bucket of bucketsList) {
        console.log(`Deleting artifacts in bucket: ${bucket}`);
        const bucketArtifacts = artifacts.filter(artifact => artifact.bucket === bucket);
        const artifactsPathsList = getAllArtifactPaths(bucketArtifacts); 
        console.log(`Artifacts: ${artifactsPathsList.join(', ')}`)
        // I think we have to await here.
        // eslint-disable-next-line no-await-in-loop
        responses.push(await deleteArtifacts(bucket, artifactsPathsList));
      }
      return responses;
    }
    
    // On delete artifacts
    async function onDeleteArtifacts(): Promise<void> {
      console.log('Delete Artifacts');
      const selected = getSelectedArtifactsAllBuckets();
      console.log('selected:', selected);
      if (selected.length > 0) {
            const responses = await deleteArtifactsPerBucket(selected);
            alertVisible = true; // make the alert visible
            let allSuccess = true;
            let someFailed = false;
            alertMessage = '<div><ul class="list">';
            for (const response of responses) {
              alertMessage += `<li>${response.bucket}</li>`;
              alertMessage += `<ul class="list">${(response.paths).map(path => `<li>${path}</li>`).join('')}</ul>`;
              if (response.status !== 200) {
                allSuccess = false;
                alertMessage += `<div><strong>${typeof response.message === 'object' ? JSON.stringify(response.message) : response.message}</strong></div>`;
                if (response.status !== 500) {
                  someFailed = true;
                }
              }
            }
            alertMessage += '</ul></div>';
            if (allSuccess) {
              alertTitle = '👍 Deleted artifacts';
              alertVariant = 'variant-ghost-success';
            } else if (someFailed) {
              // alert("Some artifacts failed to delete");
              alertTitle = '👎 Some artifacts failed to delete';
            } else {
              // alert("All artifacts failed to delete");
              alertTitle = '👎 All artifacts failed to delete';
            }
      }
    }

    // Create a new bucket
    async function createNewBucket(name: string): Promise<void> {
        console.log(`Creating bucket: ${name} ...`)
        await fetch(`/api/minio/buckets/create`, {
                method: 'POST',
                body: JSON.stringify({"bucketName": name}),
            }).then(response => {
                console.log('response:', response.clone().json());
                response.json().then(data => {
                    console.log('response data:', data);
                    const words: string[] = [];
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    data.message.split(' ').forEach((word: string) => {
                        words.push(word);
                    });
                    if (words[0] === 'Successfully') {
                        alertTitle = '👍 Create bucket';
                        alertVariant = 'variant-ghost-success';
                    }
                    else {
                        alertTitle = '👎 Create bucket failed';
                        alertVariant = 'variant-filled-error';
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    alertMessage = `<div>${data.message}</div>`;
                    alertVisible = true;
                }).catch(error => {
                    console.log(' error', error);
                });
            });
        }    

    // On create new bucket
    async function onCreateNewBucket(): Promise<void> {
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
            response: (response: string) => { 
                    createNewBucket(response).catch(error => {
                        console.log(' error', error);
                    });
                }
            }
        modalStore.trigger(modal);
    }


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function unselectArtifacts(artifacts: ArtifactHierarchyType[]) {
        artifacts.forEach(artifact => {
            // this is needed to traverse subfolders. Disable eslint rule for this line.
            // eslint-disable-next-line no-param-reassign
            artifact.isSelected = false;
            if (artifact.subfolders.length > 0) {
                unselectArtifacts(artifact.subfolders);
            }
        }); 
    }

    // unselect all buckets
    function unselectBuckets(): void {
        $reactiveBuckets.forEach(bucket => {
            // eslint-disable-next-line no-param-reassign
            bucket.isSelected = false;
        });
    }

    // unselect all buckets and all artifacts
    function unselectAll(): void{
      console.log('Unselect All');
      unselectBuckets();
      for (const bucket of $reactiveBuckets) {
        unselectArtifacts(bucket.artifacts);
      }
      $reactiveBuckets = [...$reactiveBuckets]; // Trigger a re-render
    }

    // Upload file using presigned url
    function uploadFile(file: File, url: string) {
      console.log('url:', url);
      fetch(url, {
            method: 'PUT',
            body: file
        }).then(response => 
          response.text()).then(data => {
            console.log('response:', data);
            alertTitle = '👍 Success';
            alertMessage = `Successfully uploaded file: ${file.name}`;
            alertVariant = 'variant-ghost-success';
            alertVisible = true;
        }).catch((error) => {
            console.error('error', error);
            alertTitle = '👎 Error'
            alertMessage = `Error uploading file: ${file.name}`;;
            alertVariant = 'variant-filled-error';
            alertVisible = true;
        });
    }

  </script>



<main>
    <div class="flex w-full content-center p-10">
      <div class="table-container">
        <h1>Artifact Browser</h1>
            <br>
            <div class="grid grid-cols-2">
                <div class="header flex space-x-2 place-self-start">
                    <div>
                        <button 
                        on:click={() => onDeleteArtifacts()}
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
                            on:click={() => onUploadArtifact()}
                            title="Upload Artifact"
                            >
                            <UploadIcon size="1.5x"/>
                        </button>
                    </div>
                    <div>
                        <button 
                            on:click={() => console.log('Download Artifacts ... not implemented yet!')}
                            title="Download Artifacts ... not implemented yet!"
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
        <div>
          <Artifacts />
<!--           {#await data}
              <ProgressBar />
          {:then loaded_data}
              <Artifacts data={loaded_data} />
          {:catch error}
              <p>error loading data: {error.message}</p>
          {/await} -->
        </div>
    </div>
</main>

<Alert 
  visibleAlert={alertVisible} 
  alertTitle={alertTitle} 
  alertMessage={alertMessage} 
  alertVariant={alertVariant}
/>
