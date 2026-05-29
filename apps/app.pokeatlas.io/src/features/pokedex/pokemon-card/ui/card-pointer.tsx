"use client";

// import { useBrush } from "@/features/pokedex/workspace/brush-tool/brush.context";

import { usePokemonCard } from "../use-pokemon-card";

export function CardPointer() {
	const { pokemon } = usePokemonCard();
	// const {
	// 	onTap,
	// 	pendingRefs
	// } = useBrush();
	// const isThisPending = pendingRefs.has(pokemon.id.toString());

	return (
		<button
			aria-label={
				pokemon.trackedStates.length > 0
					? `Untrack ${pokemon.name}`
					: `Track ${pokemon.name}`
			}
			className="absolute inset-0 z-2 cursor-pointer outline-none"
			// disabled={isThisPending}
			// onClick={() => onTap(pokemon)}
			tabIndex={-1}
			type="button"
		/>
	);
}

// "use client";

// // import { useBrush } from "@/features/pokedex/workspace/brush-tool/bak/brush.context";

// import { usePokemonCard } from "../use-pokemon-card";

// export function CardPointer() {
// 	const {
// 		// Added
// 		displayedStates,
// 		isPending,
// 		onTap,
// 		pokemon,
// 	} = usePokemonCard();
// 	const isTracked = displayedStates.length > 0;
// 	// const {
// 	// 	onTap,
// 	// 	pendingRefs
// 	// } = useBrush();
// 	// const isThisPending = pendingRefs.has(pokemon.id.toString());

// 	return (
// 		<button
// 			// aria-label={
// 			// 	pokemon.trackedStates.length > 0
// 			// 		? `Untrack ${pokemon.name}`
// 			// 		: `Track ${pokemon.name}`
// 			// }
// 			aria-label={
// 				isTracked ? `Untrack ${pokemon.name}` : `Track ${pokemon.name}`
// 			}
// 			className="absolute inset-0 z-2 cursor-pointer outline-none"
// 			// disabled={isThisPending}
// 			// onClick={() => onTap(pokemon)}
// 			onClick={onTap}
// 			tabIndex={-1}
// 			type="button"
// 		/>
// 	);
// }
