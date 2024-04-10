import { get } from 'svelte/store';
import allDryRunsQuery from '../queries/get_all_dryruns.js';
import { selectedProject } from '$stores/stores.js';
import type { Project } from '$typesdefinitions';
import { requestGraphQLClient } from './graphqlUtils.js';

let refreshActiveRunsPromise: Promise<void> | undefined;

export default async function refreshProjectDetails(): Promise<void> {
	if (refreshActiveRunsPromise !== undefined) {
		// already refreshing
		return;
	}

	refreshActiveRunsPromise = (async function waitForCompletion(): Promise<void> {
		let activeDryRuns: boolean | undefined = false;
		do {
			const responseProjectDetails: { project: Project } = await requestGraphQLClient(
				allDryRunsQuery,
				{ projectId: get(selectedProject)?.id }
			);
			selectedProject.set(responseProjectDetails.project);
			// check if updating can be stopped
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			get(selectedProject)?.dryRuns.forEach((item) => {
				if (item.status.phase.toString() === 'Running') {
					activeDryRuns = true;
				}
			});
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
