import { requestGraphQLClient } from '$lib/graphql-utils.js';

import getWorkflowQuery from '../../../queries/get-workflow-template.js';
import type { WorkflowTemplate } from '../../../types.js';

export async function load({ params }): Promise<WorkflowTemplate> {
	const { template } = params as { template?: string };
	if (!template) {
		throw new Error('Template not specified');
	}
	const variables = {
		name: template
	};
	const response = await requestGraphQLClient<WorkflowTemplate>(getWorkflowQuery, variables);
	return response;
}
