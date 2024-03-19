import { writable } from 'svelte/store';
import type { GraphQLClient } from 'graphql-request';
import type {
	Project,
	DockerRegistryCredential,
	DryRun,
	SampleFile,
	DryRunMetrics,
	BucketHierarchyType,
	ArtifactHierarchyType
} from '../types.js';

export const graphQLClient = writable<GraphQLClient>();
export const filesList = writable<SampleFile[] | undefined>();
export const stepsList = writable<DryRunMetrics[] | undefined>();
export const projectsList = writable<Project[] | undefined>();
export const selectedProject = writable<Project | undefined>();
export const selectedProjectName = writable<string | undefined>();
export const selectedDryRunName = writable<string | undefined>();
export const selectedMetricsType = writable<string>('');
export const clickedProjectId = writable<string>('');
export const dryRunsList = writable<DryRun[] | undefined>();
export const credentialsList = writable<DockerRegistryCredential[] | undefined>();
export const selectedCredential = writable<DockerRegistryCredential>();
// need separate list in frontend as argo stores suspended runs in state 'Running'
export const pausedDryRuns = writable<string[]>([]);

export const username = writable<string | undefined>(undefined);
export const usertoken = writable<string | undefined>(undefined);

// selected bucket
export const selectedBucket = writable<string | undefined>(undefined);

// raw buckets
import type { Bucket } from '$lib/folders_types'; // TODO: consolidate types to types.d.ts
export const buckets = writable<Bucket[]>([]);

// reactive buckets 
export const reactiveBuckets = writable<BucketHierarchyType[]>([]);

// selected Artifact
export const selectedArtifact = writable<ArtifactHierarchyType | undefined>(undefined);
