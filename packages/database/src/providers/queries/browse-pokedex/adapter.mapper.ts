import {
	POKEDEX_REGIONAL_RANGES,
	POKEMON_REGIONAL_ORIGIN_SUFFIX,
	type PokedexEntry,
	type PokemonForm,
	type PokemonRegion,
	TrackedStateRef,
} from "@context/collection/contracts";
import { PokemonRef, TypeRef } from "@context/shared";

import type { PokemonModelGetPayload } from "#prisma-client/models.ts";

export type BrowsePokedexQueryResult = PokemonModelGetPayload<{
	select: {
		formCategory: true;
		formName: true;
		formPriority: true;
		formSortGroup: true;
		isCostume: true;
		isDefaultForm: true;
		isFemale: true;
		isShadowAvailable: true;
		isTemporaryEvolution: true;
		pokedexNumber: true;
		pokemonClassification: true;
		primaryType: { select: { name: true; templateId: true } };
		ref: true;
		regularSprite: true;
		secondaryType: { select: { name: true; templateId: true } };
		shinySprite: true;
		speciesName: true;
		trackedPokemons: {
			select: { trackedStates: true; createdAt: true; updatedAt: true };
		};
	};
}>;

const REGION_LOOKUP = new Map<number, PokemonRegion>();
Object.entries(POKEDEX_REGIONAL_RANGES).forEach(([region, range]) => {
	if (!range) return;
	const [min, max] = range;
	for (let i = min; i <= max; i++) {
		REGION_LOOKUP.set(i, region as PokemonRegion);
	}
});

const getRegion = (dex: number): PokemonRegion | null => {
	return REGION_LOOKUP.get(dex) ?? null;
};

const getTypes = (
	primary: string,
	secondary: string | null,
): [TypeRef] | [TypeRef, TypeRef] => {
	const types: [TypeRef] | [TypeRef, TypeRef] = [TypeRef.from(primary)];
	if (secondary) types.push(TypeRef.from(secondary));
	return types;
};

export function toPokedexEntry(row: BrowsePokedexQueryResult): PokedexEntry {
	const pokedexNumber = row.pokedexNumber;
	const tracked = row.trackedPokemons.find(() => true) ?? null;

	const getEntryRegion = (): PokemonRegion => {
		if (row.formCategory === "REGIONAL_FORM") {
			const ref = row.ref.toUpperCase();
			for (const [region, suffix] of Object.entries(
				POKEMON_REGIONAL_ORIGIN_SUFFIX,
			)) {
				if (ref.includes(suffix)) return region as PokemonRegion;
			}
		}
		return getRegion(pokedexNumber) ?? "UNREGISTERED";
	};

	return {
		lastModifiedAt:
			tracked && tracked.createdAt.getTime() !== tracked.updatedAt.getTime()
				? tracked.updatedAt
				: null,
		sortGroup: row.formSortGroup,
		species: {
			dexNumber: pokedexNumber,
			form: row.formCategory as PokemonForm,
			id: PokemonRef.from(row.ref),
			name: row.formName,
			region: getEntryRegion(),
			shadowEligible: row.isShadowAvailable,
			sprites: { shinyUrl: row.shinySprite, url: row.regularSprite },
			types: getTypes(row.primaryType.name, row.secondaryType?.name ?? null),
			variants: {
				isCostume: row.isCostume,
				isDefaultForm: row.isDefaultForm,
				isFemale: row.isFemale,
				isTemporaryEvolution: row.isTemporaryEvolution,
			},
		},
		trackedStates:
			tracked?.trackedStates.map((state) => TrackedStateRef.from(state)) ?? [],
	};
}
