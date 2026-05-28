import {
	BrowsePokedexHandler,
	CollectionContext,
	CountPokedexHandler,
} from "@context/collection";
import { PrismaPokedexServiceAdapter } from "@pokeatlas/database";
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
	// ----- Infrastructure ------------------------------------------------

	.add("EventBus", () => new EventBus())

	// ----- Query Services ------------------------------------------------

	.add("QueryService:Pokedex", () => new PrismaPokedexServiceAdapter())

	// ----- Handlers ------------------------------------------------------

	.add(
		"Handler:BrowsePokedex",
		(r) => new BrowsePokedexHandler(r["QueryService:Pokedex"]),
	)

	.add(
		"Handler:CountPokedex",
		(r) => new CountPokedexHandler(r["QueryService:Pokedex"]),
	)

	// ----- Contexts ------------------------------------------------------

	.add("collection", (r) => {
		return new CollectionContext({
			browsePokedex: r["Handler:BrowsePokedex"],
			countPokedex: r["Handler:CountPokedex"],
		});
	})

	// ----- Atlas ---------------------------------------------------------

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
