import type {
	BrowsePokedexInput,
	PokedexStatus,
	PokemonClassification,
	PokemonDex,
} from "@pokeatlas/core/types";

import { VARIANT_DEFINITIONS } from "./variant-controls/variant.store";

export interface RawFilterParams {
	classification?: string[] | null;
	search?: string | null;
	status?: string | null;
	types?: string[] | null;
	variants?: string[] | null;
}

export interface RawDexParam {
	dex?: string | null;
}

export function buildFilters(
	raw: RawFilterParams,
): BrowsePokedexInput["filters"] {
	const search = raw.search?.trim() || undefined;

	const status = raw.status
		? (raw.status.toUpperCase() as PokedexStatus)
		: undefined;

	const classification =
		raw.classification && raw.classification.length > 0
			? raw.classification.map((c) => c.toUpperCase() as PokemonClassification)
			: undefined;

	const rawTypes = raw.types?.slice(0, 2);
	const types =
		rawTypes?.length === 1
			? ([rawTypes[0]] as [string])
			: rawTypes?.length === 2
				? ([rawTypes[0], rawTypes[1]] as [string, string])
				: undefined;

	const variantSet = new Set(raw.variants ?? []);
	const matchedVariants = VARIANT_DEFINITIONS.filter((v) =>
		variantSet.has(v.urlValue),
	);

	const variants =
		matchedVariants.length > 0
			? Object.fromEntries(matchedVariants.map((v) => [v.key, true]))
			: undefined;

	const filters: NonNullable<BrowsePokedexInput["filters"]> = {
		...(classification && { classification }),
		...(search && { search }),
		...(status && { status }),
		...(types && { types }),
		...(variants && { variants }),
	};

	return Object.keys(filters).length > 0 ? filters : undefined;
}

export function buildDex(raw: RawDexParam): BrowsePokedexInput["dex"] {
	return raw.dex ? (raw.dex.toUpperCase() as PokemonDex) : undefined;
}
