import type { SyncError } from "./error.types";
import type { RunSummary } from "./runner.types";

export type PipelineEvent =
	| ({ kind: "phase:start" } & { phase: PipelinePhase })
	| ({ kind: "step" } & StepEvent)
	| ({ kind: "step:progress" } & StepProgressEvent)
	| { kind: "pipeline:done"; durationMs: number; summary: RunSummary }
	| { kind: "pipeline:failed"; durationMs: number; error: SyncError }
	| { kind: "pipeline:up-to-date"; timestamp: string; durationMs: number }
	| { kind: "entity:start"; pipeline: string; lastDurationMs?: number }
	| { kind: "entity:done"; durationMs: number; pipeline: string }
	| {
			kind: "entity:failed";
			durationMs: number;
			error: SyncError;
			pipeline: string;
	  }
	| { kind: "entity:skipped"; pipeline: string; reason: string };

export type PipelinePhase = "extracting" | "transforming" | "loading";

export interface StepEvent {
	count?: number;
	durationMs?: number;
	inserted?: number;
	phase: PipelinePhase;
	status: StepStatus;
	step: string;
	updated?: number;
}

export interface StepProgressEvent {
	batchDone: number;
	batchTotal: number;
	elapsedMs: number;
	etaMs: number | null;
	itemsDone: number;
	itemsTotal: number;
	phase: PipelinePhase;
	step: string;
}

export type StepStatus = "running" | "done" | "failed" | "skipped";
