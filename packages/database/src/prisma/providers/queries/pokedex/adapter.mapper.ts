import {
	type PokedexEntry,
	type PokemonForm,
	type PokemonRegion,
	REGION_DEX_RANGES,
} from "@context/collection";
import { PokemonRef, TypeRef } from "@context/shared";

import type { PokemonModelGetPayload } from "#prisma-client/models.ts";

export type PokemonQueryResult = PokemonModelGetPayload<{
	select: {
		ref: true;
		formCategory: true;
		formPriority: true;
		formSortGroup: true;
		formName: true;
		speciesName: true;
		pokedexNumber: true;
		pokemonClassification: true;
		isDefaultForm: true;
		isCostume: true;
		isFemale: true;
		isTemporaryEvolution: true;
		regularSprite: true;
		shinySprite: true;
		primaryType: { select: { name: true; templateId: true } };
		secondaryType: { select: { name: true; templateId: true } };
		trackedPokemons: {
			select: { createdAt: true; trackedStates: true; updatedAt: true };
		};
	};
}>;

const getRegion = (dex: number): PokemonRegion | null => {
	for (const region in REGION_DEX_RANGES) {
		const range = REGION_DEX_RANGES[region as keyof typeof REGION_DEX_RANGES];
		if (!range) return null;

		const [min, max] = range;
		if (dex >= min && dex <= max) return region as PokemonRegion;
	}

	return null;
};

const getTypes = (
	primary: string,
	secondary: string | null,
): [TypeRef] | [TypeRef, TypeRef] => {
	const types: [TypeRef] | [TypeRef, TypeRef] = [TypeRef.from(primary)];
	if (secondary) types.push(TypeRef.from(secondary));
	return types;
};

export function toEntry(row: PokemonQueryResult): PokedexEntry {
	const tracked = row.trackedPokemons.find(() => true) ?? null;
	const dex = row.pokedexNumber;

	return {
		dex,
		form: row.formCategory as PokemonForm,
		id: PokemonRef.from(row.ref),
		lastModifiedAt:
			tracked && tracked.createdAt.getTime() !== tracked.updatedAt.getTime()
				? tracked.updatedAt
				: null,
		name: row.formName,
		region: getRegion(dex),
		sortGroup: row.formSortGroup,
		sprites: { shinyUrl: row.shinySprite, url: row.regularSprite },
		trackedStates: tracked?.trackedStates ?? [],
		types: getTypes(row.primaryType.name, row.secondaryType?.name ?? null),
		variant: {
			isCostume: row.isCostume,
			isDefaultForm: row.isDefaultForm,
			isFemale: row.isFemale,
			isTemporaryEvolution: row.isTemporaryEvolution,
		},
	};
}
