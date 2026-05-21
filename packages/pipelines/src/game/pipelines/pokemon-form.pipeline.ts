import { loadForms } from "../loaders/pokemon-form.loader";
import { transformForms } from "../transformers/pokemon-form.transformer";
import type { AppContext } from "./core/app-context";
import { EntityPipeline } from "./entity.pipeline";

export class PokemonFormPipeline extends EntityPipeline<AppContext> {
	public readonly name = "pokemon-form";
	public override readonly dependsOn = ["pokemon-type", "pokemon-species"];

	public async run(ctx: AppContext): Promise<void> {
		const sources = await this.extract(ctx);

		const tForms = transformForms(sources);
		ctx.emit({
			count: tForms.length,
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
		const result = await loadForms(ctx.prisma, tForms, ctx.dryRun, ctx.emit);
		ctx.emit({ kind: "step", phase: "loading", status: "done", ...result });
	}
}
