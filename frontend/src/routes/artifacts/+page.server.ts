import type { PageServerLoad } from './$types';
import { GraphQLClient } from 'graphql-request'
import allArtifactsQuery from '$queries/get_all_artifacts';
import allBucketsQuery from '$queries/get_all_buckets';
import * as config from '$lib/config';
import type { Bucket, Artifacts, BucketWithArtifacts } from '$typesdefinitions';

const simpipe_endpoint = config.SIM_PIPE_CONTROLLER_URL as string;

const client = new GraphQLClient(simpipe_endpoint)

export const load: PageServerLoad = async () => {	
	const buckets_response: { buckets: Bucket[] } = await client.request(allBucketsQuery);

	let artifacts_list: BucketWithArtifacts[] = [];
	for (const bucket of buckets_response.buckets) {
		const artifacts: {artifacts: Artifacts} = await client.request(allArtifactsQuery, { bucketName: bucket.name });
		artifacts_list.push({ bucket: bucket, artifacts: artifacts.artifacts });
	}

	return { 
		buckets: buckets_response,
		artifacts: artifacts_list,
	};
};

