export interface AllProjectsResponse {
	projects: Project[];
}

export type SampleFile = {
	id: string;
	name: string;
	created: string;
	size: number;
};

export type MetricsWithTimeStamps = { x: string[]; y: number[]; type: string; name: string };

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

export type WorkflowTemplateFromDryRun = {
	dryRun: {
		id: string;
		project: Project;
		argoWorkflow: ArgoWorkflowTemplate;
	};
};

export type DryRun = {
	nodes: [DryRunMetrics];
	id: string;
	createdAt: string;
	argoWorkflow: ArgoWorkflow;
	status: DryRunStatus;
	project: Project;
	log: [string];
	// TODO: change if needed; original type definition in graphql is
	// log(maxLines: number, grep: string): [string];
};

export type DryRunMetrics = {
	phase: string;
	displayName: string;
	id: string;
	startedAt: string;
	finishedAt: string;
	duration: number;
	dryRun: DryRun;
	log: string[]?;
	type: string;
	metrics: {
		cpuUsageSecondsTotal: Array<{
			timestamp: number;
			value: number;
		}>;
		memoryUsageBytes: Array<{
			timestamp: number;
			value: number;
		}>;
		networkReceiveBytesTotal: Array<{
			timestamp: number;
			value: number;
		}>;
		networkTransmitBytesTotal: Array<{
			timestamp: number;
			value: number;
		}>;
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
};

interface Template {
	dag?: any;
}

interface Templates {
	name?: string;
	inputs?: Record<string, any>;
	outputs?: Record<string, any>;
	metadata?: Record<string, any>;
	dag?: {
		tasks?: Partial<Task>[]; // Making tasks and its properties optional
	};
	container?: Partial<{
		name: string;
		image: string;
		command: string[];
		args: string[];
		env: { name: string; value: string }[];
		resources: Record<string, any>;
	}>;
}

// end: argo workflow template types

// graphql returned types and their derivatives

// graphql minio buckets
export type Bucket = {
	name: string;
};

// graphql minio artifacts
export type Artifact = {
	name: string;
	url: string;
	size: number;
	bucketName: string;
};

// Bucket with artifacts
export type BucketWithArtifacts = {
	bucket: Bucket;
	artifacts: Artifact[];
};

// Bucket hierarchy
export type BucketHierarchyType = {
	bucket: string;
	isExpanded: boolean;
	isSelected: boolean;
	artifacts: ArtifactHierarchyType[];
};

// Artifact hierarchy object
export type ArtifactHierarchyType = {
	id: string;
	name: string;
	path: string;
	bucket: string;
	subfolders: ArtifactHierarchyType[];
	isExpanded: boolean;
	isSelected: boolean;
};

// Folder stucture hierarchy object
export type FolderStructure = {
	path: string;
	children: { [key: string]: FolderStructure };
};

type ScalingLawMetric = {
	coeffs: number[];
	type: string;
	r2: number;
};

// Nodes metrics
export type AggregatedNodesMetrics = {
	nodeName: string;
	cpu: ScalingLawMetric;
	mem: ScalingLawMetric;
	duration: ScalingLawMetric;
	data: {
		cpu: number[];
		mem: number[];
		duration: number[];
		fileSize: number[];
		nodeId: string[];
	};
};
