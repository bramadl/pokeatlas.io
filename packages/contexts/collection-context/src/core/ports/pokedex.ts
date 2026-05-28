import type { PokemonRef } from "@context/shared";
import type { UID } from "@pokeatlas/toolkit";

import type { TrackedPokemon } from "../aggregates/tracked-pokemon.aggregate";
import type { Pokedex } from "../definitions/pokedex";
import type { PokedexEntry } from "../definitions/pokedex-entry";
import type { PokedexStatus } from "../definitions/pokedex-status";
import type { PokemonClassification } from "../definitions/pokemon-classification";

export interface BasePokedexInput {
	dex?: Pokedex;
	filters?: Partial<{
		classification: PokemonClassification[];
		search: string;
		status: PokedexStatus;
		types: [string] | [string, string];
		variants: Partial<{
			alternateForm: boolean;
			costume: boolean;
			gender: boolean;
			temporaryEvolution: boolean;
		}>;
	}>;
	trainerId: string;
}

export interface BrowsePokedexInput extends BasePokedexInput {
	pagination: {
		limit: number;
		page?: number;
		cursor?: string | null;
	};
}

export interface CountPokedexInput extends BasePokedexInput {}

export interface BrowsePokedexOutput {
	entries: PokedexEntry[];
	hasMore: boolean;
	nextCursor?: string | null;
	totalEntries?: number;
}

export type CountPokedexOutput = number;

/**
 * @description
 * A port for accessign the pokedex.
 */
export interface IPokedex {
	browse(input: BrowsePokedexInput): Promise<BrowsePokedexOutput>;
	countPokedexEntries(input: CountPokedexInput): Promise<CountPokedexOutput>;
}
