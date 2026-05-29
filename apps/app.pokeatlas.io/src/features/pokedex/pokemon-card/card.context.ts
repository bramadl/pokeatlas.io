import { createContext, useContext } from "react";
import type { Pokemon } from "./card.types";

export interface PokemonCardContextValue {
	displayedStates: string[];
	isPending: boolean;
	isTrackLogShown: boolean;
	onTap: () => void;
	pokemon: Pokemon;
	setIsTrackLogShown: (value: boolean) => void;
}

export const PokemonCardContext = createContext<PokemonCardContextValue | null>(
	null,
);

export function usePokemonCard(): PokemonCardContextValue {
	const ctx = useContext(PokemonCardContext);
	if (!ctx) {
		throw new Error("usePokemonCard must be used inside PokemonCardContext");
	}
	return ctx;
}
