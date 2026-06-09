import type { TrackingSignatureRef } from "@context/collection";

import type { PokemonTraits } from "#progress:application/contracts/pokemon-traits";

import type { DimensionDelta } from "../ports/projection";
import { resolveSignatureDimensions } from "../rules/signature-engine";

export function computeProgressDelta(
	added: TrackingSignatureRef[],
	removed: TrackingSignatureRef[],
	traits: PokemonTraits,
): DimensionDelta[] {
	const out: DimensionDelta[] = [];

	for (const sig of added) {
		for (const dimension of resolveSignatureDimensions(sig, traits)) {
			out.push({ delta: 1, dimension });
		}
	}

	for (const sig of removed) {
		for (const dimension of resolveSignatureDimensions(sig, traits)) {
			out.push({ delta: -1, dimension });
		}
	}

	return out;
}
