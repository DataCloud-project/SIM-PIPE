import type { Resource } from '$typesdefinitions';
import { requestGraphQLClient } from './graphqlUtils.js';
import allResourcesQuery from '$queries/get_all_resources.js';

let refreshProvisioningVMsPromise: Promise<void> | undefined;

export default async function refreshVMNodesDetails(nodeName: string): Promise<void> {

	if (refreshProvisioningVMsPromise) {
		return refreshProvisioningVMsPromise;
	}

	refreshProvisioningVMsPromise = (async function waitForCompletion(): Promise<void> {
		try {
			let iteration = 0;
			do {
				iteration++;

				try {
					const response: { resources: Resource[] } = await requestGraphQLClient(
						allResourcesQuery
					);
					const matching = response.resources?.find((r) => r.name === nodeName);
					if (matching) {
						const status = matching.status?.toString().toLowerCase();
						if (status === 'running' || status === 'failed') {
							return; 
						}
					} 
				} catch (innerErr) {
					console.error(`[${nodeName}] Error while fetching resources:`, innerErr);
				}

				const waitMs = 4000;
				await new Promise((resolve) => setTimeout(resolve, waitMs));

			} while (true); 
		} finally {
			refreshProvisioningVMsPromise = undefined;
		}
	})();

	return refreshProvisioningVMsPromise;
}
