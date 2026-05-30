import type { PokedexEntry } from "@pokeatlas/core/types";

import { PokedexEmpty } from "./pokedex-empty";
import { PokedexSkeleton } from "./pokedex-skeleton";
import { PokemonCard } from "./pokemon-card";

interface PokedexEntriesProps {
	entries: PokedexEntry[];
	showEmpty: boolean;
	showSkeleton: boolean;
	statusTab?: "MISSING" | "TRACKED";
}

export function PokedexEntries({
	entries,
	showEmpty,
	showSkeleton,
	statusTab,
}: PokedexEntriesProps) {
	if (showSkeleton) return <PokedexSkeleton />;
	if (showEmpty) return <PokedexEmpty status={statusTab} />;

	return entries.map((pokemon, index) => (
		<PokemonCard
			key={pokemon.id}
			pokemon={pokemon}
			shouldPreload={index <= 16}
		/>
	));
}
