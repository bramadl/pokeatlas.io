import type {
	PokedexEntry,
	TrackingSignatureRef,
	TrackingStatus,
	TrackPokemonInput,
	TrackPokemonOutput,
} from "@pokepulse/core";
import { mutationOptions } from "@tanstack/react-query";

import { trackPokemon } from "./pokedex.api";

export type TrackPokemonMutationInput = TrackPokemonInput & {
	currentStatus: TrackingStatus;
	entry: PokedexEntry;
	snapshot: TrackingSignatureRef[];
};

export const pokedexMutations = {
	track: () => {
		return mutationOptions<
			TrackPokemonOutput,
			Error,
			TrackPokemonMutationInput
		>({
			mutationFn: ({
				entry: _,
				currentStatus: __,
				snapshot: ___,
				...input
			}) => {
				return trackPokemon(input);
			},
		});
	},
};
