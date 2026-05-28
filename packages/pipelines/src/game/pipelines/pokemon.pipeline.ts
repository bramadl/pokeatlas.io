import { loadPokemon } from "../loaders/pokemon.loader";
import { transformPokemon } from "../transformers/pokemon.transformer";
import type { AppContext } from "./core/app-context";
import { EntityPipeline } from "./entity.pipeline";

export class PokemonPipeline extends EntityPipeline<AppContext> {
	public readonly name = "pokemon";
	public override readonly dependsOn = ["pokemon-type"];

	public async run(ctx: AppContext): Promise<void> {
		const sources = await this.extract(ctx);

		const tPokemon = transformPokemon(sources);
		ctx.emit({
			count: tPokemon.length,
			durationMs: 0,
			inserted: 0,
			kind: "step",
			phase: "transforming",
			status: "done",
			step: "PokemonForm",
			updated: 0,
		});

		ctx.emit({
			kind: "step",
			phase: "loading",
			status: "running",
			step: "PokemonForm",
		});
		const result = await loadPokemon(
			ctx.prisma,
			tPokemon,
			ctx.dryRun,
			ctx.emit,
		);
		ctx.emit({ kind: "step", phase: "loading", status: "done", ...result });
	}
}
