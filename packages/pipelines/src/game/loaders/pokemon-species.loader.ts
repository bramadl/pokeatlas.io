import type { PrismaClient } from "@pokeatlas/database";

import type { TransformedPokemonSpecies } from "../types/contract.types";
import type { PipelineEvent } from "../types/event.types";
import type { StepResult } from "../types/runner.types";
import { chunk } from "../utils/chunk";
import { writePreview } from "../utils/preview";

const BATCH_SIZE = 100;
const ETA_MIN_SAMPLES = 3;

export async function loadSpecies(
	prisma: PrismaClient,
	data: TransformedPokemonSpecies[],
	dryRun: boolean,
	emit?: (event: PipelineEvent) => void,
): Promise<StepResult> {
	const start = Date.now();

	if (dryRun) {
		writePreview("pokemon-species", data);
		return {
			count: data.length,
			durationMs: Date.now() - start,
			inserted: 0,
			step: "PokemonSpecies",
			updated: 0,
		};
	}

	const countBefore = await prisma.pokemonSpeciesModel.count();

	const batches = [...chunk(data, BATCH_SIZE)];
	const batchTotal = batches.length;
	let itemsDone = 0;

	for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
		const batch = batches[batchIndex] as TransformedPokemonSpecies[];

		await Promise.all(
			batch.map((sp) =>
				prisma.pokemonSpeciesModel.upsert({
					create: sp,
					update: {
						familyId: sp.familyId,
						isShadowAvailable: sp.isShadowAvailable,
						name: sp.name,
						pokedexNumber: sp.pokedexNumber,
						pokemonClassification: sp.pokemonClassification,
					},
					where: { pokemonId: sp.pokemonId },
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
				step: "PokemonSpecies",
			});
		}
	}

	// ----- Reconciliation -----------------------------------------------------
	const countAfter = await prisma.pokemonSpeciesModel.count();

	if (countAfter < data.length) {
		throw new Error(
			`Reconciliation failed for PokemonSpecies: ` +
				`expected at least ${data.length} rows, found ${countAfter}. ` +
				`${data.length - countAfter} record(s) are missing.`,
		);
	}

	const inserted = countAfter - countBefore;
	const updated = data.length - inserted;

	return {
		count: data.length,
		durationMs: Date.now() - start,
		inserted,
		step: "PokemonSpecies",
		updated,
	};
}
