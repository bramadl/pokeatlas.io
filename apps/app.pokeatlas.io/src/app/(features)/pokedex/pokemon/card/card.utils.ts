import type { PokedexEntry, PokemonType } from "@pokeatlas/core";

import { POKEMON_THEME_MAP } from "./pokemon-card.theme";

type Pokemon = PokedexEntry["species"];

export function formatPokedexNumber(dex: number) {
	return `#${String(dex).padStart(3, "0")}`;
}

export function getPokemonBadge(pokemon: Pokemon) {
	if (pokemon.form === "ALTERNATE_FORM" && !pokemon.variants.isDefaultForm) {
		if (pokemon.variants.isCostume) {
			return `Costume${pokemon.variants.isFemale ? " | Female" : ""}`;
		}
		return `Alternate${pokemon.variants.isFemale ? " | Female" : ""}`;
	}

	if (pokemon.form === "REGIONAL_FORM") {
		return `Regional${pokemon.variants.isFemale ? " | Female" : ""}`;
	}

	if (pokemon.variants.isCostume) {
		return `Costume${pokemon.variants.isFemale ? " | Female" : ""}`;
	}

	if (pokemon.variants.isFemale) return "Female";
	if (pokemon.variants.isTemporaryEvolution) return "Mega";

	return formatPokedexNumber(pokemon.dexNumber);
}

export function getPokemonTheme(pokemon: Pokemon) {
	const primaryType = pokemon.types[0];
	if (!primaryType) throw new Error(`Failed to get theme for ${pokemon.name}`);
	return POKEMON_THEME_MAP[primaryType.toLowerCase() as PokemonType];
}
