import type { PokemonTraits } from "#progress:application/ports/pokedex-metadata-provider.ts";
import type { DimensionDelta } from "#progress:application/ports/progress-projection-store.ts";

import { resolveSignatureDimensions } from "../rules/signature-engine";

/**
 * Pure function — computes all DimensionDeltas from added/removed signatures and pokemon traits.
 * No DB access, no side effects. Safe to unit test in isolation.
 */
export function computeProgressDelta(
	added: string[],
	removed: string[],
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
