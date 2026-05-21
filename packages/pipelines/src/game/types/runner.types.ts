export interface RunOptions {
	dryRun?: boolean;
}

export interface RunSummary {
	forms: StepResult;
	species: StepResult;
	types: StepResult;
}

export interface StepResult {
	count: number;
	durationMs: number;
	inserted: number;
	step: string;
	updated: number;
}

export type EntityRunStatus = "completed" | "failed" | "skipped";

export interface EntityRunResult {
	durationMs: number;
	error?: unknown;
	name: string;
	skipReason?: string;
	status: EntityRunStatus;
}
