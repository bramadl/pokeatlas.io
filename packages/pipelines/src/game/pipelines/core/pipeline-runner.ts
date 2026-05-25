import { classifyError } from "../../error.classifier";
import { fetchGameMasterTimestamp } from "../../extractors/fetchers/game-master.fetcher";
import type { SyncError } from "../../types/error.types";
import type { PipelineEvent } from "../../types/event.types";
import type { EntityRunResult } from "../../types/runner.types";
import type { EntityPipeline } from "../entity.pipeline";
import type { AppContext } from "./app-context";
import type { ExecutionMode, SyncStateManager } from "./sync.state";

// ----- Runner config --------------------------------------------------------

interface RunnerConfig {
	context: AppContext;
	eventHandlers: Array<(event: PipelineEvent) => void>;
	executionMode: ExecutionMode;
	force: boolean;
	stateManager: SyncStateManager;
}

// ----- PipelineRunner -------------------------------------------------------

export class PipelineRunner {
	private readonly config: RunnerConfig;

	public constructor(config: RunnerConfig) {
		this.config = config;
	}

	// ----- Public API ---------------------------------------------------------

	public async run(
		pipelines: EntityPipeline<AppContext>[],
	): Promise<EntityRunResult[]> {
		const { stateManager, executionMode, force } = this.config;
		const wallStart = Date.now();

		// ----- Change detection -----------------------------------------------
		// Skipped entirely when:
		//   - --force flag is set
		//   - executionMode is not "normal" (retry-failed / resume always run)
		if (executionMode === "normal" && !force) {
			this.emit({
				kind: "step",
				phase: "extracting",
				status: "running",
				step: "upstream_check",
			});

			let currentTimestamp: string | null = null;
			try {
				currentTimestamp = await fetchGameMasterTimestamp();
			} catch {
				// Non-fatal — if we can't fetch the timestamp, proceed with full sync
				currentTimestamp = null;
			}

			const lastTimestamp = stateManager.getLastGameMasterTimestamp();

			if (currentTimestamp && currentTimestamp === lastTimestamp) {
				const durationMs = Date.now() - wallStart;
				this.emit({
					count: 0,
					durationMs,
					inserted: 0,
					kind: "step",
					phase: "extracting",
					status: "done",
					step: "upstream_check",
					updated: 0,
				});
				this.emit({
					durationMs,
					kind: "pipeline:up-to-date",
					timestamp: currentTimestamp,
				});
				return [];
			}

			this.emit({
				count: 0,
				durationMs: Date.now() - wallStart,
				inserted: 0,
				kind: "step",
				phase: "extracting",
				status: "done",
				step: "upstream_check",
				updated: 0,
			});

			if (currentTimestamp) {
				stateManager.setLastGameMasterTimestamp(currentTimestamp);
			}
		}

		// ----- Pipeline execution ---------------------------------------------

		const ordered = topoSort(pipelines);
		const allNames = ordered.map((p) => p.name);
		const activeNames = new Set(
			stateManager.filterForMode(allNames, executionMode),
		);

		const results: EntityRunResult[] = [];
		const failed = new Set<string>();

		for (const pipeline of ordered) {
			const { name, dependsOn } = pipeline;

			if (!activeNames.has(name)) {
				const skipReason = "excluded by execution mode";
				this.emit({
					kind: "entity:skipped",
					pipeline: name,
					reason: skipReason,
				});
				results.push({ durationMs: 0, name, skipReason, status: "skipped" });
				stateManager.set(name, "skipped");
				continue;
			}

			const failedDep = dependsOn.find((dep) => failed.has(dep));
			if (failedDep) {
				const skipReason = `dependency failed: ${failedDep}`;
				this.emit({
					kind: "entity:skipped",
					pipeline: name,
					reason: skipReason,
				});
				results.push({ durationMs: 0, name, skipReason, status: "skipped" });
				stateManager.set(name, "skipped");
				failed.add(name);
				continue;
			}

			const entityStart = Date.now();
			this.emit({
				kind: "entity:start",
				lastDurationMs: stateManager.getLastDuration(name),
				pipeline: name,
			});

			try {
				await pipeline.run(this.config.context);
				const durationMs = Date.now() - entityStart;
				this.emit({ durationMs, kind: "entity:done", pipeline: name });
				results.push({ durationMs, name, status: "completed" });
				stateManager.set(name, "completed", durationMs);
			} catch (err) {
				const durationMs = Date.now() - entityStart;
				const syncError = classifyError(err, name);
				this.emit({
					durationMs,
					error: syncError,
					kind: "entity:failed",
					pipeline: name,
				});
				results.push({ durationMs, error: syncError, name, status: "failed" });
				stateManager.set(name, "failed");
				failed.add(name);
			}
		}

		const totalDurationMs = Date.now() - wallStart;
		const anyFailed = results.some((r) => r.status === "failed");

		if (!anyFailed) {
			const typeResult = results.find((r) => r.name === "pokemon-type");
			const speciesResult = results.find((r) => r.name === "pokemon-species");
			const formsResult = results.find((r) => r.name === "pokemon-form");

			this.emit({
				durationMs: totalDurationMs,
				kind: "pipeline:done",
				summary: {
					forms: {
						count: 0,
						durationMs: formsResult?.durationMs ?? 0,
						inserted: 0,
						step: "PokemonForm",
						updated: 0,
					},
					species: {
						count: 0,
						durationMs: speciesResult?.durationMs ?? 0,
						inserted: 0,
						step: "PokemonSpecies",
						updated: 0,
					},
					types: {
						count: 0,
						durationMs: typeResult?.durationMs ?? 0,
						inserted: 0,
						step: "PokemonType",
						updated: 0,
					},
				},
			});
		} else {
			const firstFailed = results.find((r) => r.status === "failed");
			this.emit({
				durationMs: totalDurationMs,
				error:
					(firstFailed?.error as SyncError) ??
					classifyError(new Error("Unknown failure"), firstFailed?.name),
				kind: "pipeline:failed",
			});
		}

		return results;
	}

	// ----- Internal -----------------------------------------------------------

	private emit(event: PipelineEvent): void {
		for (const handler of this.config.eventHandlers) {
			handler(event);
		}
	}
}

// ----- Topological sort -----------------------------------------------------

function topoSort(
	pipelines: EntityPipeline<AppContext>[],
): EntityPipeline<AppContext>[] {
	const byName = new Map(pipelines.map((p) => [p.name, p]));
	const inDegree = new Map<string, number>();
	const dependents = new Map<string, string[]>();

	for (const p of pipelines) {
		if (!inDegree.has(p.name)) inDegree.set(p.name, 0);
		for (const dep of p.dependsOn) {
			inDegree.set(p.name, (inDegree.get(p.name) ?? 0) + 1);
			const list = dependents.get(dep) ?? [];
			list.push(p.name);
			dependents.set(dep, list);
		}
	}

	const queue: string[] = [...inDegree.entries()]
		.filter(([, deg]) => deg === 0)
		.map(([name]) => name);

	const sorted: EntityPipeline<AppContext>[] = [];

	while (queue.length > 0) {
		const name = queue.shift() as string;
		const p = byName.get(name);
		if (p) sorted.push(p);

		for (const dependent of dependents.get(name) ?? []) {
			const newDeg = (inDegree.get(dependent) ?? 1) - 1;
			inDegree.set(dependent, newDeg);
			if (newDeg === 0) queue.push(dependent);
		}
	}

	if (sorted.length !== pipelines.length) {
		const unsorted = pipelines
			.filter((p) => !sorted.includes(p))
			.map((p) => p.name);
		throw new Error(
			`Cycle detected in pipeline dependencies: ${unsorted.join(", ")}`,
		);
	}

	return sorted;
}
