import type { PrismaClient } from "@pokeatlas/database";

import type { TransformedPokemonForm } from "../types/contract.types";
import type { PipelineEvent } from "../types/event.types";
import type { StepResult } from "../types/runner.types";
import { chunk } from "../utils/chunk";
import { writePreview } from "../utils/preview";

const BATCH_SIZE = 100;
const ETA_MIN_SAMPLES = 3;

export async function loadForms(
	prisma: PrismaClient,
	data: TransformedPokemonForm[],
	dryRun: boolean,
	emit?: (event: PipelineEvent) => void,
): Promise<StepResult> {
	const start = Date.now();

	if (dryRun) {
		writePreview("pokemon-forms", data);
		return {
			count: data.length,
			durationMs: Date.now() - start,
			inserted: 0,
			step: "PokemonForm",
			updated: 0,
		};
	}

	const existingRows = await prisma.pokemonFormModel.findMany({
		select: { form: true },
	});
	const existingFormSlugs = new Set(existingRows.map((r) => r.form));

	const batches = [...chunk(data, BATCH_SIZE)];
	const batchTotal = batches.length;
	let itemsDone = 0;

	const upsertedSlugs = new Set<string>();

	for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
		const batch = batches[batchIndex] as TransformedPokemonForm[];

		await Promise.all(
			batch.map((form) =>
				prisma.pokemonFormModel
					.upsert({
						create: form,
						update: {
							baseAttack: form.baseAttack,
							baseDefense: form.baseDefense,
							baseStamina: form.baseStamina,
							height: form.height,
							isCostume: form.isCostume,
							isTemporaryEvolution: form.isTemporaryEvolution,
							name: form.name,
							primaryTypeId: form.primaryTypeId,
							regularSprite: form.regularSprite,
							secondaryTypeId: form.secondaryTypeId,
							shinySprite: form.shinySprite,
							speciesId: form.speciesId,
							templateId: form.templateId,
							weight: form.weight,
						},
						where: { form: form.form },
					})
					.then(() => {
						upsertedSlugs.add(form.form);
					}),
			),
		);

		itemsDone += batch.length;

		if (emit) {
			const elapsedMs = Date.now() - start;
			const batchDone = batchIndex + 1;
			const throughput = itemsDone / elapsedMs;
			const remaining = data.length - itemsDone;
			const etaMs =
				batchDone >= ETA_MIN_SAMPLES && throughput > 0
					? Math.round(remaining / throughput)
					: null;

			emit({
				batchDone,
				batchTotal,
				elapsedMs,
				etaMs,
				itemsDone,
				itemsTotal: data.length,
				kind: "step:progress",
				phase: "loading",
				step: "PokemonForm",
			});
		}
	}

	const missingSlugs = data
		.map((f) => f.form)
		.filter((slug) => !upsertedSlugs.has(slug));

	if (missingSlugs.length > 0) {
		throw new Error(
			`Reconciliation failed for PokemonForm: ` +
				`${missingSlugs.length} form(s) were not upserted. ` +
				`Missing slugs: ${missingSlugs.slice(0, 5).join(", ")}` +
				`${missingSlugs.length > 5 ? ` … (+${missingSlugs.length - 5} more)` : ""}`,
		);
	}

	const inserted = [...upsertedSlugs].filter(
		(slug) => !existingFormSlugs.has(slug),
	).length;
	const updated = upsertedSlugs.size - inserted;

	return {
		count: data.length,
		durationMs: Date.now() - start,
		inserted,
		step: "PokemonForm",
		updated,
	};
}
