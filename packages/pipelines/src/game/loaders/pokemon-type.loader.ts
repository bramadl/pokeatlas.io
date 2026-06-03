import type { PrismaClient } from "@pokepulse/database";

import type { TransformedPokemonType } from "../types/contract.types";
import type { PipelineEvent } from "../types/event.types";
import type { StepResult } from "../types/runner.types";
import { chunk } from "../utils/chunk";
import { writePreview } from "../utils/preview";

const BATCH_SIZE = 100;

export async function loadTypes(
	prisma: PrismaClient,
	data: TransformedPokemonType[],
	dryRun: boolean,
	_emit?: (event: PipelineEvent) => void,
): Promise<StepResult> {
	const start = Date.now();

	if (dryRun) {
		writePreview("pokemon-types", data);
		return {
			count: data.length,
			durationMs: Date.now() - start,
			inserted: 0,
			step: "PokemonType",
			updated: 0,
		};
	}

	const countBefore = await prisma.pokemonTypeModel.count();

	for (const batch of chunk(data, BATCH_SIZE)) {
		await Promise.all(
			batch.map((type) =>
				prisma.pokemonTypeModel.upsert({
					create: type,
					update: { name: type.name },
					where: { templateId: type.templateId },
				}),
			),
		);
	}

	// ----- Reconciliation -----------------------------------------------------
	const countAfter = await prisma.pokemonTypeModel.count();

	if (countAfter < data.length) {
		throw new Error(
			`Reconciliation failed for PokemonType: ` +
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
		step: "PokemonType",
		updated,
	};
}
