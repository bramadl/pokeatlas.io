import type { TrackingSignatureRef } from "@context/collection";
import type { TrackableState, VariantKey } from "@context/game";

import {
	type PokemonTraits,
	TraitRules,
} from "#progress:application/contracts/pokemon-traits.ts";

import type { ProgressDimension } from "../ports/projection";

export function resolveSignatureDimensions(
	signature: TrackingSignatureRef,
	traits: PokemonTraits,
): ProgressDimension[] {
	if (signature === "BASE") return resolveBaseDimensions(traits);
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

	const NON_DEFAULT_ALTERNATE_FORMS =
		traits.formCategory === "ALTERNATE_FORM" &&
		!traits.isDefaultForm &&
		!traits.isCostume &&
		!traits.isFemale &&
		!traits.isTemporaryEvolution;

	if (NON_DEFAULT_ALTERNATE_FORMS) keys.push("alternateForm");
	return keys;
}
