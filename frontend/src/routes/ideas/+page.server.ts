import { GraphQLClient } from 'graphql-request';
import type { PageServerLoad } from './$types';
import allArtifactsQuery from '$queries/get_all_artifacts';
import allBucketsQuery from '$queries/get_all_buckets';
import * as config from '$lib/config';

const simpipeEndpoint = config.SIM_PIPE_CONTROLLER_URL as string;

const client = new GraphQLClient(simpipeEndpoint);

type Bucket = {
	name: string;
};

type Artifact = {
	name: string;
	url: string;
	size: number;
	bucketName: string;
};

type Artifacts = {
	bucketName: string;
	artifacts: Artifact[];
};

export const load: PageServerLoad = async () => {
	const bucketsResponse: { buckets: Bucket[] } = await client.request(allBucketsQuery);

	const artifactsList: Artifacts[] = [];
	for (const bucket of bucketsResponse.buckets) {
		const artifacts: { artifacts: Artifact[] } = await client.request(allArtifactsQuery, {
			bucketName: bucket.name
		});
		artifactsList.push({ bucketName: bucket.name, artifacts: artifacts.artifacts });
	}

	return {
		buckets: bucketsResponse,
		artifacts: artifactsList
	};
};
