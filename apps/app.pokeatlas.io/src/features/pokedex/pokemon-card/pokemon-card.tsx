import { memo, useCallback, useMemo, useState } from "react";

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
	const [isTrackLogShown, setIsTrackLogShown] = useState<boolean>(false);

	const toggleTrackLog = useCallback(() => {
		setIsTrackLogShown((prev) => !prev);
	}, []);

	const context = useMemo(
		() => ({
			isTrackLogShown,
			pokemon,
			setIsTrackLogShown: toggleTrackLog,
		}),
		[isTrackLogShown, pokemon, toggleTrackLog],
	);

	return (
		<PokemonCardContext.Provider value={context}>
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

// "use client";

// import { memo, useState } from "react";

// import { useTrackingStore } from "../workspace/tracking/tracking.store";
// import { useTrackPokemon } from "../workspace/tracking/use-track-pokemon";
// import { useWorkspace } from "../workspace/workspace.context";
// import { PokemonCardContext } from "./card.context";
// import type { Pokemon } from "./card.types";
// import { CardBackground } from "./ui/card-background";
// import { CardBadge } from "./ui/card-badge";
// import { CardComposer } from "./ui/card-composer";
// import { CardContainer } from "./ui/card-container";
// import { CardContent } from "./ui/card-content";
// import { CardImage } from "./ui/card-image";
// import { CardPointer } from "./ui/card-pointer";
// import { CardTrackLog } from "./ui/card-track-log";

// interface PokemonCardProps {
// 	pokemon: Pokemon;
// 	shouldPreload?: boolean;
// }

// export const PokemonCard = memo(function PokemonCard({
// 	pokemon,
// 	shouldPreload,
// }: PokemonCardProps) {
// 	const [isTrackLogShown, setIsTrackLogShown] = useState(false);

// 	const { activeBrushes } = useWorkspace();
// 	const { tap } = useTrackPokemon(activeBrushes);

// 	// Reactive subscription per pokemon — hanya card ini yang re-render
// 	// kalau overlay pokemon ini berubah. Bukan semua card.
// 	const displayedStates = useTrackingStore((s) => {
// 		const overlay = s.overlays.get(pokemon.id);
// 		return overlay?.pendingStates ?? pokemon.trackedStates;
// 	});

// 	const isPendingCard = useTrackingStore(
// 		(s) => (s.overlays.get(pokemon.id)?.inflightCount ?? 0) > 0,
// 	);

// 	return (
// 		<PokemonCardContext.Provider
// 			value={{
// 				displayedStates,
// 				isPending: isPendingCard,
// 				isTrackLogShown,
// 				onTap: () => tap(pokemon),
// 				pokemon,
// 				setIsTrackLogShown,
// 			}}
// 		>
// 			<CardComposer Context={CardTrackLog}>
// 				<CardContainer>
// 					<CardImage priority={shouldPreload} />
// 					<div className="size-full">
// 						<CardBackground />
// 						<CardContent />
// 						<CardBadge />
// 					</div>
// 					<CardPointer />
// 				</CardContainer>
// 			</CardComposer>
// 		</PokemonCardContext.Provider>
// 	);
// });

// "use client";

// import { memo, useState } from "react";

// import { useTrackingStore } from "../workspace/tracking/tracking.store";
// import { useWorkspace } from "../workspace/workspace.context";
// import { PokemonCardContext } from "./card.context";
// import type { Pokemon } from "./card.types";
// import { CardBackground } from "./ui/card-background";
// import { CardBadge } from "./ui/card-badge";
// import { CardComposer } from "./ui/card-composer";
// import { CardContainer } from "./ui/card-container";
// import { CardContent } from "./ui/card-content";
// import { CardImage } from "./ui/card-image";
// import { CardPointer } from "./ui/card-pointer";
// import { CardTrackLog } from "./ui/card-track-log";

// interface PokemonCardProps {
// 	pokemon: Pokemon;
// 	shouldPreload?: boolean;
// }

// export const PokemonCard = memo(function PokemonCard({
// 	pokemon,
// 	shouldPreload,
// }: PokemonCardProps) {
// 	const [isTrackLogShown, setIsTrackLogShown] = useState(false);
// 	const { tap } = useWorkspace();

// 	// Reactive per-card subscription — hanya card ini re-render saat overlaynya berubah
// 	const displayedStates = useTrackingStore((s) => {
// 		const overlay = s.overlays.get(pokemon.id);
// 		return overlay?.pendingStates ?? pokemon.trackedStates;
// 	});

// 	const isPending = useTrackingStore(
// 		(s) => (s.overlays.get(pokemon.id)?.inflightCount ?? 0) > 0,
// 	);

// 	return (
// 		<PokemonCardContext.Provider
// 			value={{
// 				displayedStates,
// 				isPending,
// 				isTrackLogShown,
// 				onTap: () => tap(pokemon),
// 				pokemon,
// 				setIsTrackLogShown,
// 			}}
// 		>
// 			<CardComposer Context={CardTrackLog}>
// 				<CardContainer>
// 					<CardImage priority={shouldPreload} />
// 					<div className="size-full">
// 						<CardBackground />
// 						<CardContent />
// 						<CardBadge />
// 					</div>
// 					<CardPointer />
// 				</CardContainer>
// 			</CardComposer>
// 		</PokemonCardContext.Provider>
// 	);
// });

// "use client";

// import { memo, useEffect, useState } from "react";

// import { useTrackingStore } from "../workspace/tracking/tracking.store";
// import { useWorkspace } from "../workspace/workspace.context";
// import { PokemonCardContext } from "./card.context";
// import type { Pokemon } from "./card.types";
// import { CardBackground } from "./ui/card-background";
// import { CardBadge } from "./ui/card-badge";
// import { CardComposer } from "./ui/card-composer";
// import { CardContainer } from "./ui/card-container";
// import { CardContent } from "./ui/card-content";
// import { CardImage } from "./ui/card-image";
// import { CardPointer } from "./ui/card-pointer";
// import { CardTrackLog } from "./ui/card-track-log";

// interface PokemonCardProps {
// 	hideWhenTracked?: boolean; // untuk MISSING
// 	hideWhenUntracked?: boolean; // untuk TRACKED
// 	pokemon: Pokemon;
// 	shouldPreload?: boolean;
// }

// export const PokemonCard = memo(function PokemonCard({
// 	pokemon,
// 	shouldPreload,
// 	hideWhenTracked = false,
// 	hideWhenUntracked = false,
// }: PokemonCardProps) {
// 	const [isTrackLogShown, setIsTrackLogShown] = useState(false);
// 	const { tap } = useWorkspace();

// 	const displayedStates = useTrackingStore((s) => {
// 		return s.overlays.get(pokemon.id)?.states ?? pokemon.trackedStates;
// 	});

// 	const isTracked = displayedStates.length > 0;

// 	// Auto-clear overlay saat server data sudah confirmed match
// 	useEffect(() => {
// 		const overlay = useTrackingStore.getState().overlays.get(pokemon.id);
// 		if (!overlay) return;

// 		const serverSorted = [...pokemon.trackedStates].sort().join(",");
// 		const overlaySorted = [...overlay.states].sort().join(",");

// 		if (serverSorted === overlaySorted) {
// 			useTrackingStore.getState().removeOverlay(pokemon.id);
// 		}
// 	}, [pokemon.trackedStates, pokemon.id]);

// 	if (hideWhenTracked && isTracked) return null;
// 	if (hideWhenUntracked && !isTracked) return null;

// 	return (
// 		<PokemonCardContext.Provider
// 			value={{
// 				displayedStates,
// 				isPending: false,
// 				isTrackLogShown,
// 				onTap: () => tap(pokemon),
// 				pokemon,
// 				setIsTrackLogShown,
// 			}}
// 		>
// 			<CardComposer Context={CardTrackLog}>
// 				<CardContainer>
// 					<CardImage priority={shouldPreload} />
// 					<div className="size-full">
// 						<CardBackground />
// 						<CardContent />
// 						<CardBadge />
// 					</div>
// 					<CardPointer />
// 				</CardContainer>
// 			</CardComposer>
// 		</PokemonCardContext.Provider>
// 	);
// });
