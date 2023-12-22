export type SampleFile = {
	id: string;
	name: string;
	created: string;
	size: number;
};

// WIP argo data types

export type Project = {
	name: string;
	id: string;
	createdAt: string;
	dryRuns: [DryRun];
	workflowTemplates: [WorkflowTemplate];
};

export type WorkflowTemplate = {
	name: string;
	project: Project;
	argoWorkflowTemplate: ArgoWorkflowTemplate;
};

export type ArgoWorkflowTemplate = {
	spec: {
		entrypoint: string;
		templates: ArgoWorkflowTemplateInSpec[];
	};
};

export type DryRun = {
	id: string;
	createdAt: string;
	argoWorkflow: ArgoWorkflow;
	status: DryRunStatus;
	project: Project;
	log: [string];
	// TODO: change if needed; original type definition in graphql is
	// log(maxLines: number, grep: string): [string];
	nodes: [DryRunMetrics];
	// nodes: [DryRunNode];
};

export type DryRunNode = {
	id: string;
	name: string;
	type: unknown;
	displayName?: string;
	templateName?: string;
	phase: unknown;
	startedAt?: string;
	finishedAt?: string;
	duration?: number;
	progress?: string;
	children?: [DryRunNode];
}

export type DryRunMetrics = {
	phase: string;
	displayName: string;
	startedAt: string;
	finishedAt: string;
	duration: number;
	dryRun: DryRun;
	log: string[]?;
	type: string;
	metrics: {
		[metricSource: string]: { timestamp: string; value: string }[];
	};
	outputArtifacts: {
		key: string;
		name: string;
		url: string;
	}[];
};

export type ArgoWorkflow = {
	input: unknown;
	output: unknown;
};

export type DryRunStatus = {
	phase: DryRunPhase;
	startedAt: string;
	finishedAt: string;
	progress: string;
	message: string;
	estimatedDuration: number;
};

enum DryRunPhase {
	Unknown,
	Pending,
	Running,
	Succeeded,
	Failed,
	Error,
	Skipped,
	Omitted
}

export type DockerRegistryCredential = {
	name: string;
	server: string;
	username: string;
};

export type DockerRegistryCredentialInput = {
	name: string;
	username: string;
	password: string;
	server: string;
};

// start: argo workflow template types
type Parameters = {
	name: string;
	value: string;
}[];

type Task = {
	name: string;
	template: string;
	arguments: { parameters: Parameters };
	dependencies?: string[];
	depends?: string;
};

interface ArgoWorkflowTemplateInSpec {
	dag?: ArgoWorkflowDag;
	steps?: ArgoWorkflowStep[][];
}

interface ArgoWorkflowDag {
	tasks: Task[];
	targets?: string[];
}

interface ArgoWorkflowStep {
	name: string;
}

// end: argo workflow template types
interface SimPipeModal {
	regionFooter: string;
	buttonNeutral: string;
	buttonTextCancel: string;
	buttonPositive: string;
	onClose: () => void;
}
