import type { PokemonTraits } from "#progress:application/ports/pokedex-metadata-provider.ts";

// Hardcoded by game design — not derivable from model flags
const NUNDO_TRIO_LAKE_DEX = [480, 481, 482]; // Mesprit, Azelf, Uxie
const NUNDO_GALARIAN_BIRDS_DEX = [144, 145, 146]; // Galarian Articuno, Zapdos, Moltres

export const TraitRules = {
	/**
	 * Whether this pokemon qualifies for a given tracking state dex.
	 * Intentionally does NOT check isSpecies — Magikarp with SHINY
	 * but no BASE still counts in Shiny Dex.
	 */
	canTrack(
		state: Exclude<
			"BASE" | "SHINY" | "HUNDO" | "SHADOW" | "PURIFIED" | "LUCKY" | "NUNDO",
			"BASE"
		>,
		traits: PokemonTraits,
	): boolean {
		switch (state) {
			case "SHINY":
				// shinySprite availability is already baked into speciesTotal at seed time
				return true;
			case "HUNDO":
				return true;
			case "SHADOW":
			case "PURIFIED":
				return traits.isShadowAvailable;
			case "LUCKY":
				return traits.isTradable;
			case "NUNDO":
				// STANDARD classification (no legendary/mythic/UB)
				if (traits.pokemonClassification === null) return true;
				// Lake Trio exception — catchable in wild with 0/0/0 possible
				if (NUNDO_TRIO_LAKE_DEX.includes(traits.pokedexNumber)) return true;
				// Galarian Birds exception — roaming wild encounter
				if (
					traits.formCategory === "REGIONAL_FORM" &&
					NUNDO_GALARIAN_BIRDS_DEX.includes(traits.pokedexNumber)
				)
					return true;
				return false;
		}
	},

	/**
	 * Resolves the effective region for a pokemon.
	 * Hisuian forms are tagged as REGIONAL_FORM but their base species
	 * region resolves to e.g. JOHTO — we override to HISUI.
	 */
	getEffectiveRegion(traits: PokemonTraits): PokemonTraits["region"] | "HISUI" {
		if (
			traits.formCategory === "REGIONAL_FORM" &&
			traits.ref.includes("HISUIAN")
		) {
			return "HISUI";
		}
		return traits.region;
	},
	/**
	 * Whether this pokemon counts as a trackable "species" for
	 * SpeciesCompletion, RegionalCollections, and VariantCollections.
	 *
	 * Note: this is NOT a prerequisite for TrackingCollections (SHINY, SHADOW, etc).
	 * A pokemon can be counted in Shiny Dex without having BASE tracked.
	 */
	isSpecies(traits: PokemonTraits): boolean {
		if (traits.isCostume) return false;
		if (traits.isFemale) return false;
		if (traits.isTemporaryEvolution) return false;

		return (
			traits.formCategory === "BASE_FORM" ||
			traits.formCategory === "REGIONAL_FORM" ||
			(traits.formCategory === "ALTERNATE_FORM" && traits.isDefaultForm)
		);
	},
};
