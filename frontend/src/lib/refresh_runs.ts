import { get } from 'svelte/store';
import allDryRunsQuery from '../queries/get_all_dryruns.js';
import { clickedProjectId, selectedProject } from '../stores/stores.js';
import type { Project } from '../types.js';
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
				{ projectId: get(clickedProjectId) }
			);
			selectedProject.set(responseProjectDetails.project);
			// check if updating can be stopped
			get(selectedProject)?.dryRuns.forEach((item) => {
				if (item.status.phase.toString() == 'Running') {
					activeDryRuns = true;
				}
			});
			activeDryRuns = !get(selectedProject)?.dryRuns.every(
				(run) =>
					run.status.phase.toString() !== 'Running' && run.status.phase.toString() !== 'Pending'
			);
			await new Promise((resolve) => setTimeout(resolve, 4000));

			if (!activeDryRuns) {
				refreshActiveRunsPromise = undefined;
				return;
			}
		} while (activeDryRuns);
	})();
}
