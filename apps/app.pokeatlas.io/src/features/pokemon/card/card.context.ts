import { createContext } from "react";

import type { Pokemon } from "../../global/definitions/pokemon";
import type { PokemonTheme } from "./card.theme";

export interface PokemonCardContextValue {
	hasShinyState: boolean;
	index?: number;
	isBaseStateTracked?: boolean;
	isPokemonTracked: boolean;
	isTrackLogShown: boolean;
	onTap: () => void;
	pokemon: Pokemon;
	pokemonBadge: string;
	pokemonDexFormatted: string;
	setIsTrackLogShown: (value: boolean) => void;
	shouldAnimateEnter?: boolean;
	theme: PokemonTheme;
}

export const PokemonCardContext = createContext<PokemonCardContextValue | null>(
	null,
);
