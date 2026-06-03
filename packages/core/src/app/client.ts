import type { CollectionContext } from "@context/collection/context";

/**
 * @description
 * Dependencies required to initialize the main application facade.
 */
export interface PokePulseDeps {
	collection: CollectionContext;
}

/**
 * @description
 * The root Application Facade (`PokePulse`).
 *
 * Serves as the centralized, unified entry point for all presentation layers
 * (e.g., Next.js API Routes, Server Components, CLI tools). It aggregates
 * multiple disparate Bounded Contexts into a single cohesive interface,
 * enforcing strict architectural boundaries and hiding underlying orchestration mechanics.
 */
export class PokePulse {
	/**
	 * @description
	 * Sub-facade for the Collection Bounded Context.
	 *
	 * Exposes application use cases and query services dedicated to managing
	 * trainer Pokémon tracking progress, catch histories, and collection states.
	 */
	public readonly collection: CollectionContext;

	constructor(deps: PokePulseDeps) {
		this.collection = deps.collection;
	}
}
