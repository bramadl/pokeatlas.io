import { loadSpecies } from "../loaders/pokemon-species.loader";
import { transformSpecies } from "../transformers/pokemon-species.transformer";
import type { AppContext } from "./core/app-context";
import { EntityPipeline } from "./entity.pipeline";

export class PokemonSpeciesPipeline extends EntityPipeline<AppContext> {
	public readonly name = "pokemon-species";
	public override readonly dependsOn = ["pokemon-type"];

	public async run(ctx: AppContext): Promise<void> {
		const sources = await this.extract(ctx);

		ctx.emit({
			kind: "step",
			phase: "transforming",
			status: "running",
			step: "PokemonSpecies",
		});
		const tSpecies = transformSpecies(sources);
		ctx.emit({
			count: tSpecies.length,
			durationMs: 0,
			inserted: 0,
			kind: "step",
			phase: "transforming",
			status: "done",
			step: "PokemonSpecies",
			updated: 0,
		});

		ctx.emit({
			kind: "step",
			phase: "loading",
			status: "running",
			step: "PokemonSpecies",
		});
		const result = await loadSpecies(
			ctx.prisma,
			tSpecies,
			ctx.dryRun,
			ctx.emit,
		);
		ctx.emit({ kind: "step", phase: "loading", status: "done", ...result });
	}
}
