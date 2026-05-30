import {
	POKEDEX_STATUSES,
	POKEDEXES,
	POKEMON_CLASSIFICATIONS,
} from "@pokeatlas/core/types";
import {
	parseAsArrayOf,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";

import { VARIANT_VALUES } from "./variants/variant.store";

export const searchParser = parseAsString;

export const statusParser = parseAsStringLiteral(
	POKEDEX_STATUSES.map((s) => s.toLowerCase()) as [string, ...string[]],
);

export const dexParser = parseAsStringLiteral(
	POKEDEXES.map((d) => d.toLowerCase()) as [string, ...string[]],
).withDefault("national");

export const classificationParser = parseAsArrayOf(
	parseAsStringLiteral(
		POKEMON_CLASSIFICATIONS.map((c) => c.toLowerCase()) as [
			string,
			...string[],
		],
	),
);

export const typesParser = parseAsArrayOf(parseAsString);

export const variantsParser = parseAsArrayOf(
	parseAsStringLiteral(VARIANT_VALUES),
);
