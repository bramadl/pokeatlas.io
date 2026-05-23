import type { TrackedPokemon } from "@context/collection";
import type { DomainEvent } from "@pokeatlas/toolkit";
import { prisma } from "@prisma-client";

import { getFormPriority } from "../utils/get-form-priority";
import { getPokemonDisplayName } from "../utils/get-pokemon-display-name";

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
		include: { species: true },
		where: { form: pokemonRef },
	});

	if (!form) {
		console.error(
			`[UpdatePokedexProjection] PokemonForm not found: ${pokemonRef}`,
		);
		return;
	}

	const pokemonName = getPokemonDisplayName(form);
	const formPriority = getFormPriority(
		form.form,
		form.isCostume,
		form.isTemporaryEvolution,
	);

	await prisma.pokedexProjection.upsert({
		create: {
			dexNumber: form.species.pokedexNumber,
			formPriority,
			imageUrl: form.regularSprite,
			pokemonName,
			pokemonRef,
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
