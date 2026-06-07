import {
	BrowsePokedexHandler,
	CollectionContext,
	TrackPokemonHandler,
} from "@context/collection";
import {
	PrismaBrowsePokedexQueryServiceAdapter,
	PrismaPokedexAdapter,
	PrismaTrainerDexAdapter,
} from "@pokepulse/database";
import type { ContainerBuilder, EventBus } from "@pokepulse/toolkit";

export function buildCollectionSlice<
	Base extends { "Infrastructure:EventBus": () => EventBus },
>(base: ContainerBuilder<Base>) {
	return base
		.add("Adapter:Repository:Pokedex", () => new PrismaPokedexAdapter())
		.add("Adapter:Repository:TrainerDex", () => new PrismaTrainerDexAdapter())
		.add(
			"Adapter:QueryService:BrowsePokedex",
			() => new PrismaBrowsePokedexQueryServiceAdapter(),
		)
		.add(
			"Handler:Command:TrackPokemon",
			(r) =>
				new TrackPokemonHandler(
					r["Infrastructure:EventBus"],
					r["Adapter:Repository:Pokedex"],
					r["Adapter:Repository:TrainerDex"],
				),
		)
		.add(
			"Handler:Query:BrowsePokedex",
			(r) => new BrowsePokedexHandler(r["Adapter:QueryService:BrowsePokedex"]),
		)
		.add(
			"Context:Collection",
			(r) =>
				new CollectionContext({
					browsePokedex: r["Handler:Query:BrowsePokedex"],
					trackPokemon: r["Handler:Command:TrackPokemon"],
				}),
		);
}
