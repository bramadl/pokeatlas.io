import {
	POKEDEX_STATUSES,
	POKEMON_CLASSIFICATIONS,
	POKEMON_DEXES,
} from "@pokeatlas/core/types";
import {
	parseAsArrayOf,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";
import { VARIANT_VALUES } from "./variant-controls/variant.store";

export const searchParser = parseAsString;

export const statusParser = parseAsStringLiteral(
	POKEDEX_STATUSES.map((s) => s.toLowerCase()) as [string, ...string[]],
);

export const dexParser = parseAsStringLiteral(
	POKEMON_DEXES.map((d) => d.toLowerCase()) as [string, ...string[]],
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
