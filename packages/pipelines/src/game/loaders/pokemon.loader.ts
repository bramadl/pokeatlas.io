import type { PrismaClient } from "@pokepulse/database";

import type { TransformedPokemon } from "../types/contract.types";
import type { PipelineEvent } from "../types/event.types";
import type { StepResult } from "../types/runner.types";
import { chunk } from "../utils/chunk";
import { writePreview } from "../utils/preview";

const BATCH_SIZE = 100;
const ETA_MIN_SAMPLES = 3;

export async function loadPokemon(
	prisma: PrismaClient,
	data: TransformedPokemon[],
	dryRun: boolean,
	emit?: (event: PipelineEvent) => void,
): Promise<StepResult> {
	const start = Date.now();

	if (dryRun) {
		writePreview("pokemon", data);
		return {
			count: data.length,
			durationMs: Date.now() - start,
			inserted: 0,
			step: "Pokemon",
			updated: 0,
		};
	}

	const existingRows = await prisma.pokemonModel.findMany({
		select: { ref: true },
	});
	const existingRefs = new Set(existingRows.map((r) => r.ref));

	const batches = [...chunk(data, BATCH_SIZE)];
	const batchTotal = batches.length;
	let itemsDone = 0;
	const upsertedRefs = new Set<string>();

	for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
		const batch = batches[batchIndex] as TransformedPokemon[];

		await Promise.all(
			batch.map((pokemon) =>
				prisma.pokemonModel
					.upsert({
						create: {
							baseAttack: pokemon.baseAttack,
							baseDefense: pokemon.baseDefense,
							baseStamina: pokemon.baseStamina,
							familyId: pokemon.familyId,
							formCategory: pokemon.formCategory,
							formName: pokemon.formName,
							formPriority: pokemon.formPriority,
							formSortGroup: pokemon.formSortGroup,
							height: pokemon.height,
							isCostume: pokemon.isCostume,
							isDefaultForm: pokemon.isDefaultForm,
							isFemale: pokemon.isFemale,
							isShadowAvailable: pokemon.isShadowAvailable,
							isTemporaryEvolution: pokemon.isTemporaryEvolution,
							isTrackable: pokemon.isTrackable,
							isTradable: pokemon.isTradable,
							pokedexNumber: pokemon.pokedexNumber,
							pokemonClassification: pokemon.pokemonClassification,
							primaryTypeId: pokemon.primaryTypeId,
							ref: pokemon.ref,
							region: pokemon.region,
							regularSprite: pokemon.regularSprite,
							secondaryTypeId: pokemon.secondaryTypeId,
							shinySprite: pokemon.shinySprite,
							speciesId: pokemon.speciesId,
							speciesName: pokemon.speciesName,
							templateId: pokemon.templateId,
							weight: pokemon.weight,
						},
						update: {
							baseAttack: pokemon.baseAttack,
							baseDefense: pokemon.baseDefense,
							baseStamina: pokemon.baseStamina,
							familyId: pokemon.familyId,
							formCategory: pokemon.formCategory,
							formName: pokemon.formName,
							formPriority: pokemon.formPriority,
							formSortGroup: pokemon.formSortGroup,
							height: pokemon.height,
							isCostume: pokemon.isCostume,
							isDefaultForm: pokemon.isDefaultForm,
							isFemale: pokemon.isFemale,
							isShadowAvailable: pokemon.isShadowAvailable,
							isTemporaryEvolution: pokemon.isTemporaryEvolution,
							isTrackable: pokemon.isTrackable,
							isTradable: pokemon.isTradable,
							pokedexNumber: pokemon.pokedexNumber,
							pokemonClassification: pokemon.pokemonClassification,
							primaryTypeId: pokemon.primaryTypeId,
							region: pokemon.region,
							regularSprite: pokemon.regularSprite,
							secondaryTypeId: pokemon.secondaryTypeId,
							shinySprite: pokemon.shinySprite,
							speciesId: pokemon.speciesId,
							speciesName: pokemon.speciesName,
							templateId: pokemon.templateId,
							weight: pokemon.weight,
						},
						where: { ref: pokemon.ref },
					})
					.then(() => {
						upsertedRefs.add(pokemon.ref);
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
				step: "Pokemon",
			});
		}
	}

	// ── Reconciliation ────────────────────────────────────────────────────────
	const missingRefs = data
		.map((p) => p.ref)
		.filter((ref) => !upsertedRefs.has(ref));

	if (missingRefs.length > 0) {
		throw new Error(
			`Reconciliation failed for Pokemon: ` +
				`${missingRefs.length} record(s) were not upserted. ` +
				`Missing refs: ${missingRefs.slice(0, 5).join(", ")}` +
				`${missingRefs.length > 5 ? ` … (+${missingRefs.length - 5} more)` : ""}`,
		);
	}

	const inserted = [...upsertedRefs].filter(
		(ref) => !existingRefs.has(ref),
	).length;
	const updated = upsertedRefs.size - inserted;

	return {
		count: data.length,
		durationMs: Date.now() - start,
		inserted,
		step: "Pokemon",
		updated,
	};
}
