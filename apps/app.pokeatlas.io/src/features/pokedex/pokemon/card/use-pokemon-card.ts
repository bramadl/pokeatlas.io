import { useContext } from "react";

import { PokemonCardContext } from "./card.context";

export function usePokemonCard() {
	const context = useContext(PokemonCardContext);
	if (!context) {
		throw new Error(
			"usePokemonCard must be used inside a <PokemonCard /> component!",
		);
	}
	return context;
}
