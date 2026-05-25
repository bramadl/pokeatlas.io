import type { TrackedPokemon } from "@context/collection";
import type { DomainEvent } from "@pokeatlas/toolkit";
import { getPokemonDisplayName } from "@prisma/utils/get-pokemon-display-name";
import { prisma } from "@prisma-client";

import { getFormPriority, toProjectionFormCategory } from "./query.helpers";

export async function handlePokemonTracked(
	event: DomainEvent<TrackedPokemon>,
): Promise<void> {
	const trackedPokemon = event.payload;
	if (!trackedPokemon) {
		console.error(
			`[UpdatePokedexProjection] Can not read payload from event: ${event}`,
		);
		return;
	}

	const pokemonRef = trackedPokemon.get("pokemonRef");
	const trainerRef = trackedPokemon.get("trackedBy").value();
	const trackedStates = trackedPokemon
		.get("trackedStates")
		.map((combo) => combo.encode());

	const form = await prisma.pokemonFormModel.findUnique({
		include: { primaryType: true, secondaryType: true, species: true },
		where: { form: pokemonRef },
	});

	if (!form) {
		console.error(
			`[UpdatePokedexProjection] PokemonForm not found: ${pokemonRef}`,
		);
		return;
	}

	const pokemonName = getPokemonDisplayName(form);
	const formCategory = toProjectionFormCategory(form.formCategory);
	const formPriority = getFormPriority(form);

	await prisma.pokedexProjection.upsert({
		create: {
			dexNumber: form.species.pokedexNumber,
			formCategory,
			formPriority,
			imageUrl: form.regularSprite,
			isFemale: form.isFemale,
			pokemonName,
			pokemonRef,
			primaryType: form.primaryType.name,
			secondaryType: form.secondaryType?.name ?? null,
			shinyImageUrl: form.shinySprite,
			trackedStates,
			trainerRef,
		},
		update: {
			trackedStates,
		},
		where: {
			trainerRef_pokemonRef: { pokemonRef, trainerRef },
		},
	});
}
