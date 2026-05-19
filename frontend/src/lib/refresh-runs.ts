import { get } from 'svelte/store';
import allDryRunsQuery from '../queries/get-all-dryruns.js';
import { selectedProject } from '$stores/stores.js';
import type { Project } from '$typesdefinitions';
import { requestGraphQLClient } from './graphql-utils.js';

let refreshActiveRunsPromise: Promise<void> | undefined;

export default async function refreshProjectDetails(): Promise<void> {
	if (refreshActiveRunsPromise !== undefined) {
		// already refreshing
		return;
	}

	refreshActiveRunsPromise = (async function waitForCompletion(): Promise<void> {
		let activeDryRuns: boolean | undefined = false;
		do {
			try {
				const responseProjectDetails: { project: Project } = await requestGraphQLClient(
					allDryRunsQuery,
					{ projectId: get(selectedProject)?.id }
				);
				selectedProject.set(responseProjectDetails.project);
			} catch (error) {
				console.error('Failed to refresh dry runs:', error);
			}
			// check if updating can be stopped
			activeDryRuns = !get(selectedProject)?.dryRuns.every(
				(run) =>
					run.status.phase.toString() !== 'Running' && run.status.phase.toString() !== 'Pending'
			);
			// eslint-disable-next-line no-promise-executor-return
			await new Promise((resolve) => setTimeout(resolve, 4000));

			if (!activeDryRuns) {
				refreshActiveRunsPromise = undefined;
				return;
			}
		} while (activeDryRuns);
	})();
}
