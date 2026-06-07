import type { TrackableState, VariantKey } from "@context/game";

import type { PokemonTraits } from "#progress:application/ports/pokedex-metadata.ts";
import type { ProgressDimension } from "#progress:application/ports/progress-projection.ts";

import { TraitRules } from "./trait-rules";

/**
 * Given a signature and pokemon traits, returns all ProgressDimensions affected.
 *
 * "BASE" → structural dimensions (species, regional, variants)
 * Everything else → TrackingCollections dimension if the pokemon qualifies
 */
export function resolveSignatureDimensions(
	signature: string,
	traits: PokemonTraits,
): ProgressDimension[] {
	if (signature === "BASE") {
		return resolveBaseDimensions(traits);
	}

	return resolveTrackingDimension(
		signature as Exclude<TrackableState, "BASE">,
		traits,
	);
}

function resolveBaseDimensions(traits: PokemonTraits): ProgressDimension[] {
	const dimensions: ProgressDimension[] = [];

	if (TraitRules.isSpecies(traits)) {
		dimensions.push({ type: "GLOBAL_SPECIES" });
		dimensions.push({
			region: TraitRules.getEffectiveRegion(traits),
			type: "REGIONAL",
		});
	}

	for (const key of resolveVariantKeys(traits)) {
		dimensions.push({ key, type: "VARIANT" });
	}

	return dimensions;
}

function resolveTrackingDimension(
	signature: Exclude<TrackableState, "BASE">,
	traits: PokemonTraits,
): ProgressDimension[] {
	if (!TraitRules.canTrack(signature, traits)) return [];
	return [{ state: signature, type: "TRACKING" }];
}

function resolveVariantKeys(traits: PokemonTraits): VariantKey[] {
	const keys: VariantKey[] = [];

	if (traits.isCostume) keys.push("costume");
	if (traits.isFemale) keys.push("gender");
	if (traits.isTemporaryEvolution) keys.push("temporaryEvolution");

	// Non-default alternate forms only — default alternate = counts as species, not variant
	if (
		traits.formCategory === "ALTERNATE_FORM" &&
		!traits.isDefaultForm &&
		!traits.isCostume &&
		!traits.isFemale &&
		!traits.isTemporaryEvolution
	) {
		keys.push("alternateForm");
	}

	return keys;
}
