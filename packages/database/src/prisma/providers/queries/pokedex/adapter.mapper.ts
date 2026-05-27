import type {
	PokedexEntry,
	PokemonForm,
	PokemonRegion,
} from "@context/collection/types";
import { DataCorruptionError, PokemonRef, TypeRef } from "@context/shared";

import type { PokedexProjection } from "#prisma-client/client";

import { REGION_DEX_RANGES } from "../../constants/region-dex-ranges";

const getForm = (form: string): PokemonForm => {
	return form as PokemonForm;
};

const getRegion = (dex: number): PokemonRegion => {
	for (const region in REGION_DEX_RANGES) {
		const range = REGION_DEX_RANGES[region];
		if (!range) throw new DataCorruptionError("PokedexProjection");

		const [min, max] = range;
		if (dex >= min && dex <= max) return region as PokemonRegion;
	}
	throw new DataCorruptionError("PokedexProjection");
};

const getTypes = (
	primaryType: string,
	secondaryType: string | null,
): [TypeRef] | [TypeRef, TypeRef] => {
	const types: [TypeRef] | [TypeRef, TypeRef] = [TypeRef.from(primaryType)];
	if (secondaryType) types.push(TypeRef.from(secondaryType));
	return types;
};

export function toProjection({
	createdAt,
	dexNumber,
	formCategory,
	imageUrl,
	isCostume,
	isFemale,
	isTemporaryEvolution,
	pokemonName,
	pokemonRef,
	primaryType,
	secondaryType,
	shinyImageUrl,
	sortGroup,
	trackedStates,
	updatedAt,
}: PokedexProjection): PokedexEntry {
	return {
		dex: dexNumber,
		form: getForm(formCategory),
		id: PokemonRef.from(pokemonRef),
		lastModifiedAt:
			createdAt.getTime() === updatedAt.getTime() ? null : updatedAt,
		name: pokemonName,
		region: getRegion(dexNumber),
		sortGroup: sortGroup ?? 0,
		sprites: { shinyUrl: shinyImageUrl, url: imageUrl },
		trackedStates: trackedStates,
		types: getTypes(primaryType, secondaryType),
		variant: {
			isCostume,
			isFemale,
			isTemporaryEvolution,
		},
	};
}
