// Type definitions for this project (folders directory, nor old artifacts directory)
// reactiveFoldersStore.js
import { writable } from 'svelte/store';

// Folder structure is of the form: //TODO: check if this is still used and if name is ok
export type StructureType = {
    path: string,
    children: { [key: string]: StructureType} 
  }

// Minio artifacts are of the form:
export type ArtifactType = {
    name: string,
    lastModified: string,
    etag: string,
    size: number
  }

// Define a type for the artifact hierarchy object
export type ArtifactHierarchyType = {
    name: string;
    subfolders: ArtifactHierarchyType[];
    isExpanded: boolean;
    isSelected: boolean;
    path: string;
  };
  
// Use the FolderType for the reactiveFolders store
export const reactiveArtifacts = writable<ArtifactHierarchyType[]>([]);

// Default bucket name
export const default_bucket_name: string = 'useruploads';
