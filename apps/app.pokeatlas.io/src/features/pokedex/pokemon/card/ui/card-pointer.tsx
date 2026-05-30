"use client";

import { usePokemonCard } from "../use-pokemon-card";

export function CardPointer() {
	const { isPokemonTracked, onTap, pokemon } = usePokemonCard();
	return (
		<button
			aria-label={`${isPokemonTracked ? "Untrack" : "Track"} ${pokemon.name}`}
			className="absolute inset-0 z-2 cursor-pointer outline-none"
			onClick={onTap}
			tabIndex={-1}
			type="button"
		/>
	);
}
