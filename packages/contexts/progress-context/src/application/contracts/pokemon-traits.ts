import type {
	PokemonClassification,
	PokemonForm,
	PokemonRef,
	PokemonRegion,
	TrackableState,
} from "@context/game";

export interface PokemonTraits {
	formCategory: PokemonForm;
	isCostume: boolean;
	isDefaultForm: boolean;
	isFemale: boolean;
	isShadowAvailable: boolean;
	isTemporaryEvolution: boolean;
	isTradable: boolean;
	pokedexNumber: number;
	pokemonClassification: PokemonClassification | null;
	ref: PokemonRef;
	region: PokemonRegion;
}

const NUNDO_TRIO_LAKE_DEX = [480, 481, 482];
const NUNDO_GALARIAN_BIRDS_DEX = [144, 145, 146];

export const TraitRules = {
	canTrack(
		state: Exclude<TrackableState, "BASE">,
		traits: PokemonTraits,
	): boolean {
		const IS_TRIO_LAKE = NUNDO_TRIO_LAKE_DEX.includes(traits.pokedexNumber);
		const IS_GALARIAN_BIRDS =
			traits.formCategory === "REGIONAL_FORM" &&
			NUNDO_GALARIAN_BIRDS_DEX.includes(traits.pokedexNumber);

		switch (state) {
			case "SHINY":
				return true;
			case "HUNDO":
				return true;
			case "SHADOW":
			case "PURIFIED":
				return traits.isShadowAvailable;
			case "LUCKY":
				return traits.isTradable;
			case "NUNDO":
				if (traits.pokemonClassification === null) return true;
				if (IS_TRIO_LAKE) return true;
				if (IS_GALARIAN_BIRDS) return true;
				return false;
		}
	},

	getEffectiveRegion(traits: PokemonTraits): PokemonTraits["region"] {
		const IS_HISUI =
			traits.formCategory === "REGIONAL_FORM" && traits.ref.includes("HISUIAN");

		if (IS_HISUI) return "HISUI";
		return traits.region;
	},

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
