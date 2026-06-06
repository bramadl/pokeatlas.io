import type { PokedexEntry } from "@context/collection";
import {
	PokemonFormRef,
	PokemonRef,
	PokemonRegionRef,
	type PokemonType,
	PokemonTypeRef,
	TrackedStateRef,
} from "@context/game";
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
		region: true;
		regularSprite: true;
		secondaryType: { select: { name: true; templateId: true } };
		shinySprite: true;
		speciesName: true;
		trackedPokemons:
			| {
					select: { trackedStates: true; createdAt: true; updatedAt: true };
			  }
			| false;
	};
}>;

const getTypes = (
	primary: string,
	secondary: string | null,
): [PokemonType] | [PokemonType, PokemonType] => {
	const types: [PokemonType] | [PokemonType, PokemonType] = [
		PokemonTypeRef.from(primary),
	];
	if (secondary) types.push(PokemonTypeRef.from(secondary));
	return types;
};

export function toPokedexEntry(row: BrowsePokedexQueryResult): PokedexEntry {
	const pokedexNumber = row.pokedexNumber;

	const tracked = (row.trackedPokemons || []).find(() => true) ?? null;
	const trackedStates =
		tracked?.trackedStates.map((state) => TrackedStateRef.from(state)) ?? [];

	return {
		lastModifiedAt:
			tracked && tracked.createdAt.getTime() !== tracked.updatedAt.getTime()
				? tracked.updatedAt
				: null,
		sortGroup: row.formSortGroup,
		species: {
			dexNumber: pokedexNumber,
			form: PokemonFormRef.from(row.formCategory),
			id: PokemonRef.from(row.ref),
			name: row.formName,
			region: PokemonRegionRef.from(row.region),
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
		trackedStates,
	};
}
