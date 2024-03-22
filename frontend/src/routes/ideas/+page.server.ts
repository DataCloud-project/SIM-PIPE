import type { PageServerLoad } from './$types';
import { GraphQLClient } from 'graphql-request';
import allArtifactsQuery from '$queries/get_all_artifacts';
import allBucketsQuery from '$queries/get_all_buckets';
import * as config from '$lib/config';

const simpipe_endpoint = config.SIM_PIPE_CONTROLLER_URL as string;

const client = new GraphQLClient(simpipe_endpoint);

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
	const buckets_response: { buckets: Bucket[] } = await client.request(allBucketsQuery);

	let artifacts_list: Artifacts[] = [];
	for (const bucket of buckets_response.buckets) {
		const artifacts: { artifacts: Artifact[] } = await client.request(allArtifactsQuery, {
			bucketName: bucket.name
		});
		artifacts_list.push({ bucketName: bucket.name, artifacts: artifacts.artifacts });
	}

	return {
		buckets: buckets_response,
		artifacts: artifacts_list
	};
};
