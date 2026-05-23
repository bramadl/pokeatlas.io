import type { PokemonEntry } from "@context/collection";
import { PokemonRef, TypeRef } from "@context/shared";
import type { PokemonFormModelGetPayload } from "@prisma-client/models";

export function mapPokemonEntry(
	from: PokemonFormModelGetPayload<{
		include: { primaryType: true; secondaryType: true; species: true };
	}>,
): PokemonEntry {
	const types: [TypeRef] | [TypeRef, TypeRef] = from.secondaryType
		? [
				TypeRef.from(from.primaryType.name),
				TypeRef.from(from.secondaryType.name),
			]
		: [TypeRef.from(from.primaryType.name)];

	return {
		dexNumber: from.species.pokedexNumber,
		formName: from.name,
		isCostume: from.isCostume,
		isTemporaryEvolution: from.isTemporaryEvolution,
		ref: PokemonRef.from(from.form),
		speciesName: from.species.name,
		sprites: { shinyUrl: from.shinySprite, url: from.regularSprite },
		types,
	};
}
