import {
	CLASSIFICATION_ALIASES,
	POKEDEX_ALIASES,
	POKEDEX_OPTIONS,
	POKEMON_CLASSIFICATIONS,
	POKEMON_TYPES,
	TRACKING_STATUS_ALIASES,
	TRACKING_STATUSES,
	TYPES_ALIASES,
	VARIANT_CONFIG,
	type VariantKey,
} from "@pokepulse/core";
import { createSearchParamsCache, type UrlKeys } from "nuqs/server";

import {
	createMultiSelectParser,
	createSearchParser,
	createSingleSelectParser,
	createVariantParser,
} from "@/lib/nuqs/nuqs-parser";

export const pokedexFilterParser = {
	classifications: createMultiSelectParser(
		POKEMON_CLASSIFICATIONS,
		CLASSIFICATION_ALIASES,
	).withDefault([]),
	pokedex: createSingleSelectParser(
		POKEDEX_OPTIONS,
		POKEDEX_ALIASES,
	).withDefault("NATIONAL"),
	search: createSearchParser().withDefault(""),
	status: createSingleSelectParser(
		TRACKING_STATUSES,
		TRACKING_STATUS_ALIASES,
	).withDefault("ALL"),
	types: createMultiSelectParser(POKEMON_TYPES, TYPES_ALIASES)
		.withLimit(2)
		.withDefault([]),
	variants: createVariantParser(VARIANT_CONFIG).withDefault(
		Object.fromEntries(VARIANT_CONFIG.map((v) => [v.key, false])) as Record<
			VariantKey,
			boolean
		>,
	),
};

export const pokedexFilterKeys: UrlKeys<typeof pokedexFilterParser> = {
	classifications: "cl",
	pokedex: "op",
	search: "q",
	status: "st",
	types: "ty",
	variants: "vr",
};

export const loadPokedexFilters = createSearchParamsCache(pokedexFilterParser, {
	urlKeys: pokedexFilterKeys,
});
