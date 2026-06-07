import {
	BrowsePokedexHandler,
	CollectionContext,
	PokemonTracked,
	type PokemonTrackedPayload,
	TrackingStatesChanged,
	type TrackingStatesChangedPayload,
	TrackPokemonHandler,
} from "@context/collection";
import {
	GetProgressSummaryHandler,
	PokemonTrackedHandler,
	ProgressContext,
	TrackingStatesChangedHandler,
} from "@context/progress";
import {
	PrismaBrowsePokedexQueryAdapter,
	PrismaGetProgressSummaryQueryAdapter,
	PrismaPokedexAdapter,
	PrismaPokedexMetadataAdapter,
	PrismaProgressProjectionAdapter,
	PrismaTrainerDexAdapter,
} from "@pokepulse/database";
import { ContainerBuilder, EventBus } from "@pokepulse/toolkit";

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

	.add("Infrastructure:EventBus", () => new EventBus())

	// ----- Query Services ------------------------------------------------

	.add(
		"QueryService:BrowsePokedexQuery",
		() => new PrismaBrowsePokedexQueryAdapter(),
	)

	.add(
		"QueryService:GetProgressSummaryQuery",
		() => new PrismaGetProgressSummaryQueryAdapter(),
	)

	// ----- Repositories --------------------------------------------------

	.add("Repository:Pokedex", () => new PrismaPokedexAdapter())
	.add("Repository:TrainerDex", () => new PrismaTrainerDexAdapter())

	// ----- Progress Adapters ---------------------------------------------

	.add("Progress:PokedexMetadata", () => new PrismaPokedexMetadataAdapter())
	.add("Progress:ProjectionStore", () => new PrismaProgressProjectionAdapter())

	// ----- Handlers ------------------------------------------------------

	.add(
		"Handler:BrowsePokedex",
		(r) => new BrowsePokedexHandler(r["QueryService:BrowsePokedexQuery"]),
	)

	.add(
		"Handler:TrackPokemon",
		(r) =>
			new TrackPokemonHandler(
				r["Infrastructure:EventBus"],
				r["Repository:Pokedex"],
				r["Repository:TrainerDex"],
			),
	)

	.add(
		"Handler:PokemonTracked",
		(r) =>
			new PokemonTrackedHandler(
				r["Progress:PokedexMetadata"],
				r["Progress:ProjectionStore"],
			),
	)

	.add(
		"Handler:TrackingStatesChanged",
		(r) =>
			new TrackingStatesChangedHandler(
				r["Progress:PokedexMetadata"],
				r["Progress:ProjectionStore"],
			),
	)

	.add(
		"Handler:GetProgressSummary",
		(r) =>
			new GetProgressSummaryHandler(r["QueryService:GetProgressSummaryQuery"]),
	)

	// ----- Contexts ------------------------------------------------------

	.add(
		"collection",
		(r) =>
			new CollectionContext({
				browsePokedex: r["Handler:BrowsePokedex"],
				trackPokemon: r["Handler:TrackPokemon"],
			}),
	)

	.add(
		"progress",
		(r) =>
			new ProgressContext({
				getProgressSummary: r["Handler:GetProgressSummary"],
			}),
	)

	// ----- Pulse ---------------------------------------------------------

	.add(
		"pulse",
		(r) => new PokePulse({ collection: r.collection, progress: r.progress }),
	)

	.build();

const bus = container["Infrastructure:EventBus"];
bus.subscribe<PokemonTrackedPayload>(PokemonTracked.type, (event) =>
	container["Handler:PokemonTracked"].handle(event),
);
bus.subscribe<TrackingStatesChangedPayload>(
	TrackingStatesChanged.type,
	(event) => container["Handler:TrackingStatesChanged"].handle(event),
);

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
