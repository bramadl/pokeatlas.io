"use client";

import { useMemo, useState } from "react";

import type { Pokemon } from "../../global/definitions/pokemon";
import {
	PokemonCardContext,
	type PokemonCardContextValue,
} from "./card.context";
import { getPokemonBadge, getPokemonDex, getPokemonTheme } from "./card.utils";

import { CardBackground } from "./ui/card-background";
import { CardBadge } from "./ui/card-badge";
import { CardComposer } from "./ui/card-composer";
import { CardContainer } from "./ui/card-container";
import { CardContent } from "./ui/card-content";
import { CardImage } from "./ui/card-image";
import { CardPointer } from "./ui/card-pointer";

interface PokemonCardProps {
	CardContext?: (props: PokemonCardContextValue) => React.JSX.Element;
	onTap: () => void;
	pokemon: Pokemon;
	pokemonHasShinyState?: boolean;
	shouldPreload?: boolean;
}

export function PokemonCard({
	CardContext,
	pokemon,
	pokemonHasShinyState: hasShinyState = false,
	shouldPreload = false,
	onTap,
}: PokemonCardProps) {
	const [isTrackLogShown, setIsTrackLogShown] = useState(false);

	const compoundStatesNumber = pokemon.trackedStates.length;

	const context = useMemo(
		() => ({
			hasShinyState,
			isBaseStateTracked: pokemon.trackedStates.includes("BASE"),
			isPokemonTracked: pokemon.trackedStates.length > 0,
			isTrackLogShown,
			onTap,
			pokemon,
			pokemonBadge: getPokemonBadge(pokemon),
			pokemonDexFormatted: getPokemonDex(pokemon),
			setIsTrackLogShown: () => setIsTrackLogShown((prev) => !prev),
			theme: getPokemonTheme(pokemon),
		}),
		[hasShinyState, isTrackLogShown, onTap, pokemon],
	);

	return (
		<PokemonCardContext.Provider value={context}>
			<CardComposer Context={CardContext}>
				<CardContainer>
					<CardImage priority={shouldPreload} />
					<div className="size-full">
						<CardBackground />
						<CardContent />
						{compoundStatesNumber > 0 && (
							<CardBadge compoundCount={compoundStatesNumber} />
						)}
					</div>
					<CardPointer />
				</CardContainer>
			</CardComposer>
		</PokemonCardContext.Provider>
	);
}
