// import { prisma } from "@prisma-client";

import type { TrackedPokemon } from "@context/collection";
import type { DomainEvent } from "@pokeatlas/toolkit";

// import { getFormPriority } from "./query.helpers";

export async function handlePokemonTracked(
	_event: DomainEvent<TrackedPokemon>,
): Promise<void> {
	throw new Error("Method not implemented");

	// const trackedPokemon = event.payload;
	// if (!trackedPokemon) {
	// 	return console.error(
	// 		`[UpdatePokedexProjection] Can not read payload from event: ${event}`,
	// 	);
	// }

	// const pokemonRef = trackedPokemon.get("pokemonRef");
	// const trainerRef = trackedPokemon.get("trackedBy").value();
	// const trackedStates = trackedPokemon
	// 	.get("trackedStates")
	// 	.map((combo) => combo.encode());

	// const form = await prisma.pokemonFormModel.findUnique({
	// 	include: { primaryType: true, secondaryType: true, species: true },
	// 	where: { form: pokemonRef },
	// });

	// if (!form) {
	// 	return console.error(
	// 		`[UpdatePokedexProjection] PokemonForm not found: ${pokemonRef}`,
	// 	);
	// }

	// const formCategory = toProjectionFormCategory(form.formCategory);
	// const formPriority = getFormPriority(form);

	// await prisma.pokedexProjection.upsert({
	// 	create: {
	// 		dexNumber: form.species.pokedexNumber,
	// 		formCategory,
	// 		formPriority,
	// 		imageUrl: form.regularSprite,
	// 		isFemale: form.isFemale,
	// 		pokemonName: form.name,
	// 		pokemonRef,
	// 		primaryType: form.primaryType.name,
	// 		secondaryType: form.secondaryType?.name ?? null,
	// 		shinyImageUrl: form.shinySprite,
	// 		trackedStates,
	// 		trainerRef,
	// 	},
	// 	update: {
	// 		trackedStates,
	// 	},
	// 	where: {
	// 		trainerRef_pokemonRef: { pokemonRef, trainerRef },
	// 	},
	// });
}
