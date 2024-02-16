// Type definitions for this project (folders directory, nor old artifacts directory)
// reactiveFoldersStore.js
import { writable } from 'svelte/store';

// Folder structure is of the form: //TODO: check if this is still used and if name is ok
export type StructureType = {
    path: string,
    children: { [key: string]: StructureType} 
  }

// Minio buckets are of the form:
export type BucketType = {
    name: string,
    creationDate: string
}

// Bucket with artifacts
export type Bucket = {
  bucket: BucketType,
  artifacts: ArtifactType[]
}

// Minio artifacts are of the form:
export type ArtifactType = {
    name: string,
    lastModified: string,
    etag: string,
    size: number
  }

// Artifact hierarchy object
export type ArtifactHierarchyType = {
    id: string;
    name: string;
    path: string;
    bucket: string;
    subfolders: ArtifactHierarchyType[];
    isExpanded: boolean;
    isSelected: boolean;
  };

// Bucket hierarchy
export type BucketHierarchyType = {
  bucket: string;
  isExpanded: boolean;
  isSelected: boolean;
  artifacts: ArtifactHierarchyType[]
}

// Use the FolderType for the reactiveFolders store // TODO: remove if not used
export const reactiveArtifacts = writable<ArtifactHierarchyType[]>([]);

// Use the BucketHierarchyType for the reactiveBuckets store
export const reactiveBuckets = writable<BucketHierarchyType[]>([]);

// Default bucket name
export const default_bucket_name = 'useruploads';
