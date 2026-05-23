import { CollectionContext, PokemonTracked } from "@context/collection";
import {
	handlePokemonTracked,
	PrismaPokedexQueryService,
	PrismaPokedexRepositoryAdapter,
	PrismaPokemonCatalogAdapter,
} from "@pokeatlas/database";
import { ContainerBuilder, EventBus } from "@pokeatlas/toolkit";

import { PokeAtlas } from "./client";

/**
 * @description
 * Application Dependency Injection (DI) Container.
 *
 * Configures and wires the entire application object graph. The registration
 * sequence via `.add()` strictly dictates the dependency tree—tokens declared
 * above are safely resolvable and consumable by factories declared below them.
 *
 * This architecture enforces strict encapsulation by hiding infrastructure mechanics
 * and internal bounded context structures from the outer presentation layers.
 */
const container = ContainerBuilder.create()
	// ----- Layer: Infrastructure ------------------------------------------------
	.add("EventBus", () => {
		const bus = new EventBus();

		bus.subscribe(PokemonTracked.type, handlePokemonTracked);

		return bus;
	})

	// ----- Layer: Collection BC -------------------------------------------------
	.add("QueryService:Pokedex", () => new PrismaPokedexQueryService())
	.add("QueryService:PokemonCatalog", () => new PrismaPokemonCatalogAdapter())
	.add("Repository:Pokedex", () => new PrismaPokedexRepositoryAdapter())
	.add("collection", (r) => {
		return new CollectionContext({
			eventBus: r.EventBus,
			queries: {
				pokedex: r["QueryService:Pokedex"],
				pokemonCatalog: r["QueryService:PokemonCatalog"],
			},
			repositories: {
				pokedex: r["Repository:Pokedex"],
			},
		});
	})

	// ----- Layer: Poke Atlas ----------------------------------------------------
	.add("atlas", (r) => new PokeAtlas({ collection: r.collection }))
	.build();

/**
 * @description
 * Unified Application Facade (`atlas`).
 *
 * The primary public entry point for the presentation layer (e.g., Next.js API Routes, CLI).
 * It abstracts the underlying storage systems, repositories, and domain wiring,
 * exposing only context-driven use cases to the consumer.
 *
 * @example
 * ```ts
 * import { atlas } from "@pokeatlas/core";
 * const result = await atlas.collection.browsePokedex();
 * ```
 */
export const atlas = container.atlas;
export type AtlasClient = typeof atlas;
