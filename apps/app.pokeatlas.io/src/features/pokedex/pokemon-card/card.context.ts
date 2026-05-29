"use client";

import { createContext } from "react";

import type { Pokemon } from "./card.types";

interface PokemonCardContext {
	isTrackLogShown: boolean;
	pokemon: Pokemon;
	setIsTrackLogShown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PokemonCardContext = createContext<PokemonCardContext | null>(
	null,
);

// "use client";

// import { createContext } from "react";
// import type { Pokemon } from "./card.types";

// interface PokemonCardContext {
// 	displayedStates: string[];
// 	isPending: boolean;
// 	isTrackLogShown: boolean;
// 	onTap: () => void;
// 	pokemon: Pokemon;
// 	setIsTrackLogShown: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export const PokemonCardContext = createContext<PokemonCardContext | null>(
// 	null,
// );
