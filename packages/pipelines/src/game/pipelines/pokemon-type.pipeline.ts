import { loadTypes } from "../loaders/pokemon-type.loader";
import { transformTypes } from "../transformers/pokemon-type.transformer";
import type { AppContext } from "./core/app-context";
import { EntityPipeline } from "./entity.pipeline";

export class PokemonTypePipeline extends EntityPipeline<AppContext> {
	public readonly name = "pokemon-type";
	public override readonly dependsOn: string[] = [];

	public async run(ctx: AppContext): Promise<void> {
		const sources = await this.extract(ctx);

		ctx.emit({
			kind: "step",
			phase: "transforming",
			status: "running",
			step: "PokemonType",
		});
		const tTypes = transformTypes(sources);
		ctx.emit({
			count: tTypes.length,
			durationMs: 0,
			inserted: 0,
			kind: "step",
			phase: "transforming",
			status: "done",
			step: "PokemonType",
			updated: 0,
		});

		ctx.emit({
			kind: "step",
			phase: "loading",
			status: "running",
			step: "PokemonType",
		});
		const result = await loadTypes(ctx.prisma, tTypes, ctx.dryRun);
		ctx.emit({ kind: "step", phase: "loading", status: "done", ...result });
	}
}
