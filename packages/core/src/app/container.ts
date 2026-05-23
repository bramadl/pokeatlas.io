import { CollectionContext } from "@context/collection";
import { PrismaTrainerPokedexQueryService } from "@pokeatlas/database";
import { ContainerBuilder } from "@pokeatlas/toolkit";

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
	// ----- Layer: Collection BC -------------------------------------------------
	.add("QueryService:Pokedex", () => new PrismaTrainerPokedexQueryService())
	.add("collection", (r) => {
		return new CollectionContext({
			queries: {
				browsePokedex: r["QueryService:Pokedex"],
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
