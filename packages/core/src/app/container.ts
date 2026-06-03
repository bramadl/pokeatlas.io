import { BrowsePokedexHandler, TrackPokemonHandler } from "@context/collection";
import { CollectionContext } from "@context/collection/context";
import {
	PrismaBrowsePokedexQueryAdapter,
	PrismaPokedexAdapter,
	PrismaTrainerDexAdapter,
} from "@pokepulse/database";
import { ContainerBuilder } from "@pokepulse/toolkit";

import { PokePulse } from "./client";

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

	// .add("EventBus", () => new EventBus())

	// ----- Query Services ------------------------------------------------

	.add(
		"QueryService:BrowsePokedexQuery",
		() => new PrismaBrowsePokedexQueryAdapter(),
	)

	// ----- Repositories --------------------------------------------------

	.add("Repository:Pokedex", () => new PrismaPokedexAdapter())
	.add("Repository:TrainerDex", () => new PrismaTrainerDexAdapter())

	// ----- Handlers ------------------------------------------------------

	.add(
		"Handler:BrowsePokedex",
		(r) => new BrowsePokedexHandler(r["QueryService:BrowsePokedexQuery"]),
	)

	.add(
		"Handler:TrackPokemon",
		(r) =>
			new TrackPokemonHandler(
				r["Repository:Pokedex"],
				r["Repository:TrainerDex"],
			),
	)

	// ----- Contexts ------------------------------------------------------

	.add("collection", (r) => {
		return new CollectionContext({
			browsePokedex: r["Handler:BrowsePokedex"],
			trackPokemon: r["Handler:TrackPokemon"],
		});
	})

	// ----- pulse ---------------------------------------------------------

	.add("pulse", (r) => new PokePulse({ collection: r.collection }))
	.build();

/**
 * @description
 * Unified Application Facade (`pulse`).
 *
 * The primary public entry point for the presentation layer (e.g., Next.js API Routes, CLI).
 * It abstracts the underlying storage systems, repositories, and domain wiring,
 * exposing only context-driven use cases to the consumer.
 *
 * @example
 * ```ts
 * import { pulse } from "@pokepulse/core";
 * const result = await pulse.collection.browsePokedex();
 * ```
 */
export const pulse = container.pulse;
export type pulseClient = typeof pulse;
