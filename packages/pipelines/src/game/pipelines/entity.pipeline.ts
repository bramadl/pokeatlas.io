import { extractSources } from "../extractors/source.extractor";
import type { ExtractedSources } from "../types/contract.types";
import type { AppContext } from "./core/app-context";

/**
 * @description
 * Abstract base for every entity-scoped ETL pipeline.
 * Each concrete subclass owns one entity: its transformer + loader + name + deps.
 */
export abstract class EntityPipeline<TContext = unknown> {
	/**
	 * @description
	 * Unique pipeline name — used for dependency resolution, state tracking,
	 * and display in the renderer.
	 */
	public abstract readonly name: string;

	/**
	 * @description
	 * Names of pipelines that must complete before this one runs.
	 * Leave empty (default) if the pipeline has no dependencies.
	 */
	public readonly dependsOn: string[] = [];

	/**
	 * @description
	 * Execute the pipeline given the shared run context.
	 * Implementations are responsible for ETL steps (extract → transform → load).
	 */
	public abstract run(context: TContext): Promise<void>;

	protected async extract(ctx: TContext): Promise<ExtractedSources> {
		const { emit } = ctx as AppContext;

		emit({
			kind: "step",
			phase: "extracting",
			status: "running",
			step: "game_master",
		});

		const extractStart = Date.now();
		const sources = await extractSources(ctx as AppContext);

		emit({
			count: sources.gameMaster.length,
			durationMs: Date.now() - extractStart,
			inserted: 0,
			kind: "step",
			phase: "extracting",
			status: "done",
			step: "game_master",
			updated: 0,
		});

		emit({
			kind: "step",
			phase: "extracting",
			status: "running",
			step: "pogo_assets",
		});

		emit({
			count: sources.i18n.size,
			durationMs: 0,
			inserted: 0,
			kind: "step",
			phase: "extracting",
			status: "done",
			step: "pogo_assets",
			updated: 0,
		});

		return sources;
	}
}
