import { get } from 'svelte/store';

import allDryRunsQuery from '../queries/get-all-dryruns.js';
import { selectedProject } from '../stores/stores.js';
import { DryRunPhase, type Project } from '../types.js';
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
			// eslint-disable-next-line no-await-in-loop
			const responseProjectDetails: { project: Project } = await requestGraphQLClient(
				allDryRunsQuery,
				{ projectId: get(selectedProject)?.id }
			);
			selectedProject.set(responseProjectDetails.project);
			activeDryRuns = get(selectedProject)?.dryRuns.some(
				(run) =>
					run.status.phase === DryRunPhase.Running || run.status.phase === DryRunPhase.Pending
			);

			// eslint-disable-next-line no-await-in-loop
			await new Promise((resolve) => {
				setTimeout(resolve, 4000);
			});

			if (!activeDryRuns) {
				refreshActiveRunsPromise = undefined;
				return;
			}
		} while (activeDryRuns);
	})();
}
