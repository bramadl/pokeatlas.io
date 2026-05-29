"use client";

import { memo, useCallback, useState } from "react";

import { useTrackingStore } from "../workspace/tracking/tracking.store";
import { useTrackPokemon } from "../workspace/tracking/use-track-pokemon";
import { useWorkspace } from "../workspace/workspace.context";
import { PokemonCardContext } from "./card.context";
import type { Pokemon } from "./card.types";
import { CardBackground } from "./ui/card-background";
import { CardBadge } from "./ui/card-badge";
import { CardComposer } from "./ui/card-composer";
import { CardContainer } from "./ui/card-container";
import { CardContent } from "./ui/card-content";
import { CardImage } from "./ui/card-image";
import { CardPointer } from "./ui/card-pointer";
import { CardTrackLog } from "./ui/card-track-log";

interface PokemonCardProps {
	pokemon: Pokemon;
	shouldPreload?: boolean;
}

export const PokemonCard = memo(function PokemonCard({
	pokemon,
	shouldPreload,
}: PokemonCardProps) {
	const [isTrackLogShown, setIsTrackLogShown] = useState(false);

	const { activeBrushes, trainerId } = useWorkspace();
	const { tap } = useTrackPokemon(activeBrushes, trainerId);

	const displayedStates = useTrackingStore((s) => {
		const overlay = s.overlays.get(pokemon.id);
		return overlay?.trackedStates ?? pokemon.trackedStates;
	});

	const isPending = useTrackingStore(
		(s) => (s.overlays.get(pokemon.id)?.inflight ?? 0) > 0,
	);

	const toggleTrackLog = useCallback(() => {
		setIsTrackLogShown((prev) => !prev);
	}, []);

	return (
		<PokemonCardContext.Provider
			value={{
				displayedStates,
				isPending,
				isTrackLogShown,
				onTap: () => tap(pokemon),
				pokemon,
				setIsTrackLogShown: toggleTrackLog,
			}}
		>
			<CardComposer Context={CardTrackLog}>
				<CardContainer>
					<CardImage priority={shouldPreload} />
					<div className="size-full">
						<CardBackground />
						<CardContent />
						<CardBadge />
					</div>
					<CardPointer />
				</CardContainer>
			</CardComposer>
		</PokemonCardContext.Provider>
	);
});
