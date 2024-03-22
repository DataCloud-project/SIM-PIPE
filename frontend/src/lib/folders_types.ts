// Type definitions for this project (folders directory, nor old artifacts directory)
// reactiveFoldersStore.js
// TODO: Join these types into types.d.ts, fix dependencies, and delete this file

// Folder structure is of the form: //TODO: check if this is still used and if name is ok
/*
export type StructureType = {
    path: string,
    children: { [key: string]: StructureType} 
  }
  */

// Minio buckets are of the form:
/*
export type BucketType = {
    name: string,
    creationDate: string
}
*/

// Bucket with artifacts
/*
export type Bucket = {
  bucket: BucketType,
  artifacts: ArtifactType[]
}
*/

// Minio artifacts are of the form:
/*
export type ArtifactType = {
    name: string,
    lastModified: string,
    etag: string,
    size: number
  }
*/

// Default bucket name
// export const default_bucket_name = 'useruploads';
