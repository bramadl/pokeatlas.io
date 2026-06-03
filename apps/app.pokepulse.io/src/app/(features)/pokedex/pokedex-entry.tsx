"use client";

import {
	type PokedexEntry as IPokedexEntry,
	isGuest,
	type PokemonType,
	TrackedStateRef,
	type TrackingStatus,
} from "@pokepulse/core";
import { useDebounceCallback } from "usehooks-ts";

import { getQueryClient } from "@/lib/tanstack/query/query-client";

import { PokedexEntryLog } from "./pokedex-entry-log";
import { PokemonCard } from "./pokemon";
import {
	formatPokedexNumber,
	getPokemonBadge,
} from "./pokemon/card/card.utils";
import { POKEMON_THEME_MAP } from "./pokemon/card/pokemon-card.theme";
import { usePokedexMutation } from "./use-pokedex-mutation";

interface PokedexEntryProps {
	entry: IPokedexEntry;
	index?: number;
	isEraserActive?: boolean;
	trackingSignature: string;
	trackingStatus: TrackingStatus;
	trainerId: string;
}

export function PokedexEntry({
	entry,
	index,
	isEraserActive,
	trackingSignature,
	trackingStatus,
	trainerId,
}: PokedexEntryProps) {
	const guest = isGuest(trainerId);

	const queryClient = getQueryClient();

	const mutation = usePokedexMutation({ queryClient, scope: entry.species.id });
	const debounceMutate = useDebounceCallback(mutation.mutate, 300);

	const cardTheme =
		POKEMON_THEME_MAP[entry.species.types[0]?.toLowerCase() as PokemonType];

	const trackedStateRef = TrackedStateRef.from(trackingSignature);
	const isEntryTracked = guest
		? true
		: entry.trackedStates.includes(trackedStateRef as TrackedStateRef);

	const trackedStates = isEntryTracked
		? entry.trackedStates.filter((s) => s !== trackedStateRef)
		: [...entry.trackedStates, trackedStateRef];

	const trackPokemon = () => {
		const derivedTrackedStates = isEraserActive ? [] : trackedStates;
		const snapshot = mutation.getSnapshot(queryClient, entry.species.id);

		mutation.updateEntryTrackedStates(
			queryClient,
			entry.species.id,
			derivedTrackedStates.map(String),
		);

		mutation.injectEntryIntoCache(
			queryClient,
			{ ...entry, trackedStates: derivedTrackedStates },
			trackingStatus === "ALL"
				? isEntryTracked
					? "MISSING"
					: "TRACKED"
				: trackingStatus === "MISSING"
					? "TRACKED"
					: "MISSING",
		);

		mutation.invalidateNonAllStatusCaches(queryClient);
		debounceMutate({
			currentStatus: trackingStatus,
			entry,
			pokemonRef: entry.species.id,
			snapshot,
			trackedStates: derivedTrackedStates,
			trainerId,
		});
	};

	return (
		<PokemonCard
			CardContext={PokedexEntryLog}
			CardContextProps={{
				entry,
				isEntryTracked,
				pokedex: formatPokedexNumber(entry.species.dexNumber),
				theme: cardTheme,
			}}
			isCardDisabled={guest}
			isCardPrioritized={index ? index < 10 : false}
			key={entry.species.id}
			onCardTapped={trackPokemon}
			pokemon={{
				badge: getPokemonBadge(entry.species),
				includeShiny: entry.trackedStates.some((s) => s.includes("SHINY")),
				isTracked: isEntryTracked,
				name: entry.species.name,
				sprites: {
					default: entry.species.sprites.url,
					shiny: entry.species.sprites.shinyUrl,
				},
				theme: cardTheme,
				types: entry.species.types.map((t) => t.toLowerCase() as PokemonType),
			}}
		/>
	);
}
