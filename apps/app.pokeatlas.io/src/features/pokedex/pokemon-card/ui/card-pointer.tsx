"use client";

import { usePokemonCard } from "../use-pokemon-card";

export function CardPointer() {
	const { displayedStates, onTap, pokemon } = usePokemonCard();
	const isTracked = displayedStates.length > 0;

	return (
		<button
			aria-label={
				isTracked ? `Untrack ${pokemon.name}` : `Track ${pokemon.name}`
			}
			className="absolute inset-0 z-2 cursor-pointer outline-none"
			onClick={onTap}
			tabIndex={-1}
			type="button"
		/>
	);
}
