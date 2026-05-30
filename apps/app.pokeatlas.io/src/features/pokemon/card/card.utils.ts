import type { Pokemon } from "../../global/definitions/pokemon";
import type { PokemonType } from "../../global/definitions/pokemon-types";
import { POKEMON_THEME_MAP } from "./card.theme";

export function getPokemonDex(pokemon: Pokemon) {
	return `#${String(pokemon.dex).padStart(3, "0")}`;
}

export function getPokemonBadge(pokemon: Pokemon) {
	if (pokemon.form === "ALTERNATE_FORM" && !pokemon.variant.isDefaultForm) {
		if (pokemon.variant.isCostume) {
			return `Costume${pokemon.variant.isFemale ? " | Female" : ""}`;
		}
		return `Alternate${pokemon.variant.isFemale ? " | Female" : ""}`;
	}

	if (pokemon.form === "REGIONAL_FORM") {
		return `Regional${pokemon.variant.isFemale ? " | Female" : ""}`;
	}

	if (pokemon.variant.isCostume) {
		return `Costume${pokemon.variant.isFemale ? " | Female" : ""}`;
	}

	if (pokemon.variant.isFemale) return "Female";

	if (pokemon.variant.isTemporaryEvolution) return "Mega";

	return getPokemonDex(pokemon);
}

export function getPokemonTheme(pokemon: Pokemon) {
	const primaryType = pokemon.types[0];
	if (!primaryType) throw new Error(`Failed to get theme for ${pokemon.name}`);
	return POKEMON_THEME_MAP[primaryType.toLowerCase() as PokemonType];
}
