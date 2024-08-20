import { requestGraphQLClient } from '$lib/graphqlUtils';
import getWorkflowQuery from '$queries/get_workflow_template';
import getWorkflowFromDryRunQuery from '$queries/get_workflow_template_from_dry_run';
import type { WorkflowTemplate, WorkflowTemplateFromDryRun } from '$typesdefinitions';

export async function getWorkflowTemplate(
	template_name: string
): Promise<{ workflowTemplate: WorkflowTemplate }> {
	const variables = {
		name: template_name
	};
	const response = await requestGraphQLClient<{ workflowTemplate: WorkflowTemplate }>(
		getWorkflowQuery,
		variables
	);
	// console.log(response);
	return response;
}

export async function getWorkflowTemplateFromDryRun(
	template_name: string
): Promise<{ workflowTemplate: WorkflowTemplateFromDryRun }> {
	const variables = {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		dryRunId: template_name
	};
	const response = await requestGraphQLClient<{ workflowTemplate: WorkflowTemplateFromDryRun }>(
		getWorkflowFromDryRunQuery,
		variables
	);
	// console.log(response);
	return response;
}
