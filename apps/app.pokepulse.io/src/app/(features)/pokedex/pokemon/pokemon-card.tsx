"use client";

import type { PokemonType } from "@pokepulse/core";
import type React from "react";
import { useState } from "react";

import type { PokemonCardTheme } from "./card/pokemon-card.theme";
import { PokemonCardBackground } from "./card/pokemon-card-background";
import { PokemonCardBadge } from "./card/pokemon-card-badge";
import { PokemonCardComposer } from "./card/pokemon-card-composer";
import { PokemonCardContainer } from "./card/pokemon-card-container";
import { PokemonCardContent } from "./card/pokemon-card-content";
import { PokemonCardImage } from "./card/pokemon-card-image";
import { PokemonCardPointer } from "./card/pokemon-card-pointer";

interface Pokemon {
	badge: string;
	includeShiny?: boolean;
	isTracked?: boolean;
	name: string;
	sprites: {
		default: string;
		shiny: string | null;
	};
	theme: PokemonCardTheme;
	types: PokemonType[];
}

interface PokemonCardProps<TContextProps extends Record<string, unknown>> {
	CardContext?: React.ComponentType<TContextProps>;
	CardContextProps?: TContextProps;
	isCardDisabled?: boolean;
	isCardPrioritized?: boolean;
	onCardTapped?: () => void;
	pokemon: Pokemon;
}

export function PokemonCard<TContextProps extends Record<string, unknown>>({
	CardContext,
	CardContextProps,
	isCardDisabled,
	isCardPrioritized,
	pokemon,
	onCardTapped,
}: PokemonCardProps<TContextProps>) {
	const [isTrackLogShown, setIsTrackLogShown] = useState(false);
	const openTrackLog = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setIsTrackLogShown(true);
	};

	return (
		<PokemonCardComposer
			Context={CardContext}
			ContextProps={CardContextProps}
			isContextOpened={isTrackLogShown}
			onContextChanged={(v) => setIsTrackLogShown(v)}
			pokemonName={pokemon.name}
		>
			<PokemonCardContainer
				isCardDisabled={isCardDisabled}
				isPokemonTracked={pokemon.isTracked}
				isTrackLogShown={isTrackLogShown}
			>
				<PokemonCardImage
					hasShinyState={pokemon.includeShiny}
					onInfoClicked={openTrackLog}
					pokemonName={pokemon.name}
					pokemonSprite={pokemon.sprites}
					pokemonTypes={pokemon.types}
					priority={isCardPrioritized}
					theme={pokemon.theme}
					tracked={pokemon.isTracked}
				/>
				<div className={"size-full"}>
					<PokemonCardBackground
						theme={pokemon.theme}
						tracked={pokemon.isTracked}
					/>
					<PokemonCardContent
						pokemonBadge={pokemon.badge}
						pokemonName={pokemon.name}
						theme={pokemon.theme}
					/>
					<PokemonCardBadge hasShinyState={pokemon.includeShiny} />
				</div>
				<PokemonCardPointer
					onTap={onCardTapped}
					pokemonName={pokemon.name}
					tracked={pokemon.isTracked}
				/>
			</PokemonCardContainer>
		</PokemonCardComposer>
	);
}
