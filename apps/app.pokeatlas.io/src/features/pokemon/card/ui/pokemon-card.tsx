"use client";

import { useMemo, useState } from "react";

import type { Pokemon } from "@/features/global/definitions/pokemon";
import { cn } from "@/lib/utils";

import {
	PokemonCardContext,
	type PokemonCardContextValue,
} from "../card.context";
import { getPokemonBadge, getPokemonDex, getPokemonTheme } from "../card.utils";

import { CardBackground } from "./card-background";
import { CardBadge } from "./card-badge";
import { CardComposer } from "./card-composer";
import { CardContainer } from "./card-container";
import { CardContent } from "./card-content";
import { CardImage } from "./card-image";
import { CardPointer } from "./card-pointer";

interface PokemonCardProps {
	CardContext?: (props: PokemonCardContextValue) => React.JSX.Element;
	isDisabled?: boolean;
	isTracked?: boolean;
	onTap: () => void;
	pokemon: Pokemon;
	shouldPreload?: boolean;
	suspense?: boolean;
}

export function PokemonCard({
	CardContext,
	isDisabled = false,
	isTracked = false,
	pokemon,
	onTap,
	shouldPreload = false,
	suspense,
}: PokemonCardProps) {
	const [isTrackLogShown, setIsTrackLogShown] = useState(false);

	const context = useMemo<PokemonCardContextValue>(() => {
		return {
			hasShinyState: pokemon.trackedStates.some((s) => s.includes("SHINY")),
			isBaseStateTracked: pokemon.trackedStates.includes("BASE"),
			isDisabled,
			isPokemonTracked: isTracked,
			isTrackLogShown,
			onTap,
			pokemon,
			pokemonBadge: getPokemonBadge(pokemon),
			pokemonDexFormatted: getPokemonDex(pokemon),
			setIsTrackLogShown: () => setIsTrackLogShown((prev) => !prev),
			theme: getPokemonTheme(pokemon),
		};
	}, [isDisabled, isTrackLogShown, isTracked, onTap, pokemon]);

	return (
		<PokemonCardContext.Provider value={context}>
			<CardComposer Context={CardContext}>
				<CardContainer
					className={cn(
						"transition-[filter]",
						suspense && "blur-[2px] pointer-events-none",
					)}
				>
					<CardImage priority={shouldPreload} />
					<div className={"size-full"}>
						<CardBackground />
						<CardContent />
						<CardBadge />
					</div>
					<CardPointer />
				</CardContainer>
			</CardComposer>
		</PokemonCardContext.Provider>
	);
}
