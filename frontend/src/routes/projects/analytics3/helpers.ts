import type { SimulationNodeDatum } from 'd3';
import type { WorkflowTemplate } from '$typesdefinitions';

/*
export type Node = {
	id: number;
	label: string;
};
*/
export type Link = {
	source: string;
	target: string;
};

export interface Node extends SimulationNodeDatum {
	id: string;
	label: string;
}

function getWorkflowStructure(workflow: WorkflowTemplate): { hasDAG: boolean; hasSteps: boolean } {
	let hasDAG = false;
	let hasSteps = false;
	const workflowName = workflow.argoWorkflowTemplate.metadata.name;
	// Iterate over the templates to find DAG or Steps structure
	workflow.argoWorkflowTemplate.spec.templates.forEach((template: any) => {
		if (template.dag) {
			hasDAG = true;
		}
		if (template.steps) {
			hasSteps = true;
		}
	});

	if (hasDAG && hasSteps) {
		console.log(`Both DAG and Steps structures found in workflow "${workflowName}"`);
	} else if (hasDAG) {
		console.log(`DAG structure found in workflow "${workflowName}"`);
	} else if (hasSteps) {
		console.log(`Steps structure found in workflow "${workflowName}"`);
	} else {
		console.log(`Neither DAG nor Steps structure found in workflow "${workflowName}"`);
	}
	return { hasDAG, hasSteps };
}

// Function to extract nodes and links from the workflow template
export function extractNodesAndLinks(workflowTemplate: WorkflowTemplate): {
	nodes: Node[];
	links: Link[];
} {
	const nodes: Node[] = [];
	const links: Link[] = [];

	// Extract nodes from the templates
	workflowTemplate.argoWorkflowTemplate.spec.templates.forEach((template: any) => {
		if (template.dag && template.dag.tasks) {
			template.dag.tasks.forEach((task: any) => {
				nodes.push({ id: task.name, label: task.template });
			});
		} else {
			nodes.push({ id: template.name, label: template.name });
		}
	});

	// Extract links from the tasks in the DAG
	workflowTemplate.argoWorkflowTemplate.spec.templates.forEach((template: any) => {
		if (template.dag && template.dag.tasks) {
			template.dag.tasks.forEach((task: any) => {
				if (task.dependencies) {
					task.dependencies.forEach((dependency: any) => {
						links.push({ source: dependency, target: task.name });
					});
				}
			});
		}
	});

	return { nodes, links };
}

// Function to parse the Argo Workflow YAML and extract nodes and links
export function extractNodesAndLinks2(workflowTemplate: any): { nodes: Node[]; links: Link[] } {
	const nodes: Node[] = [];
	const links: Link[] = [];
	const nodeIds = new Map(); // Map to store node name -> node id
	// Generate nodes from templates
	const templates = workflowTemplate.argoWorkflowTemplate.spec.templates;

	const { hasDAG, hasSteps } = getWorkflowStructure(workflowTemplate);

	if (hasDAG) {
		templates[0].dag.tasks.forEach((task: any, index: number) => {
			if (task.name) {
				const nodeId = index + 1;
				nodes.push({ id: nodeId, label: task.name });
				nodeIds.set(task.name, nodeId);
			}
		});

		// Generate links from templates (using DAG structure)
		templates.forEach((template: any) => {
			if (template.dag && template.dag.tasks) {
				template.dag.tasks.forEach((task: any) => {
					if (task.dependencies) {
						task.dependencies.forEach((dep: any) => {
							links.push({
								source: nodeIds.get(dep),
								target: nodeIds.get(task.name)
							});
						});
					}
				});
			}
		});
	} else if (hasSteps) {
		let nodeIdCounter = 1;
		// Iterate over the templates to find the Steps structure
		templates.forEach((template: any) => {
			if (template.steps) {
				template.steps.forEach((stepGroup: any, groupIndex: number) => {
					stepGroup.forEach((step: any) => {
						nodeIdCounter += 1;
						const nodeId = nodeIdCounter;
						nodes.push({ id: nodeId, label: step.name });
						nodeIds.set(step.name, nodeId);

						// Add edges based on the order of steps
						if (groupIndex > 0) {
							const previousStepGroup = template.steps[groupIndex - 1];
							previousStepGroup.forEach((prevStep: any) => {
								links.push({
									source: nodeIds.get(prevStep.label),
									target: nodeId.toString()
								});
							});
						}
					});
				});
			}
		});
	} else {
		throw new Error(`Neither DAG nor Steps structure found in workflow ${workflowTemplate.label}`);
	}

	return { nodes, links };
}
