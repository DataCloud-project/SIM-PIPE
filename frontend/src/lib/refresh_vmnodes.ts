import type { Resource } from '$typesdefinitions';
import { requestGraphQLClient } from './graphqlUtils.js';
import allResourcesQuery from '$queries/get_all_resources.js';

let refreshProvisioningVMsPromise: Promise<void> | undefined;

export default async function refreshVMNodesDetails(): Promise<void> {
	if (refreshProvisioningVMsPromise !== undefined) {
		// already refreshing
		return;
	}

	refreshProvisioningVMsPromise = (async function waitForCompletion(): Promise<void> {
		let provisioningVMs: boolean | undefined = false;
		do {
			try {
			const response: { resources: Resource[] } = await requestGraphQLClient(allResourcesQuery);
			for (const item of response.resources || []) {
				if (item.status.toString() === 'provisioning') {
					provisioningVMs = true;
					break;
				}
			}
			// Check if all resources are either failed or running
			provisioningVMs = !response.resources?.every(
				(item) =>
					item.status.toString() !== 'failed' && item.status.toString() !== 'running'
			);
			// eslint-disable-next-line no-promise-executor-return
			await new Promise((resolve) => setTimeout(resolve, 4000));

			if (!provisioningVMs) {
				refreshProvisioningVMsPromise = undefined;
				return;
			}
		} catch (error) {
			console.error('Error updating VM nodes:', error);
		}
		} while (provisioningVMs);
	})();
}
