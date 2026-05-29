"use client";

import type { BrowsePokedexInput } from "@pokeatlas/core/types";
import { useQueryStates } from "nuqs";
import { useDebounceValue } from "usehooks-ts";

import {
	classificationParser,
	dexParser,
	searchParser,
	statusParser,
	typesParser,
	variantsParser,
} from "./filter.params";
import { buildDex, buildFilters } from "./filter.utils";

export const filterParsers = {
	classification: classificationParser,
	search: searchParser,
	status: statusParser,
	types: typesParser,
	variants: variantsParser,
} as const;

export const dexParsers = { dex: dexParser } as const;

export interface PokedexFilterParams {
	dex: BrowsePokedexInput["dex"];
	filters: BrowsePokedexInput["filters"];
}

export interface PokedexFilterParamsResult {
	debounced: PokedexFilterParams;
	raw: PokedexFilterParams;
}

export function usePokedexFilterParams(): PokedexFilterParamsResult {
	const [{ dex }] = useQueryStates(dexParsers);
	const [{ classification, search, status, types, variants }] =
		useQueryStates(filterParsers);

	const [dDex] = useDebounceValue(dex, 400);
	const [dClassification] = useDebounceValue(classification, 300);
	const [dSearch] = useDebounceValue(search, 500);
	const [dStatus] = useDebounceValue(status, 300);
	const [dTypes] = useDebounceValue(types, 300);
	const [dVariants] = useDebounceValue(variants, 300);

	const raw: PokedexFilterParams = {
		dex: buildDex({ dex }),
		filters: buildFilters({ classification, search, status, types, variants }),
	};

	const debounced: PokedexFilterParams = {
		dex: buildDex({ dex: dDex }),
		filters: buildFilters({
			classification: dClassification,
			search: dSearch,
			status: dStatus,
			types: dTypes,
			variants: dVariants,
		}),
	};

	return {
		debounced,
		raw,
	};
}

// export function usePokedexFilterParams(): PokedexFilterParamsResult {
// 	const [{ dex }] = useQueryStates(dexParsers);
// 	const [{ classification, search, status, types, variants }] =
// 		useQueryStates(filterParsers);

// 	const [dSearch] = useDebounceValue(search, 500);

// 	const raw: PokedexFilterParams = {
// 		dex: buildDex({ dex }),
// 		filters: buildFilters({ classification, search, status, types, variants }),
// 	};

// 	const debounced: PokedexFilterParams = {
// 		dex: buildDex({ dex }),
// 		filters: buildFilters({
// 			classification,
// 			search: dSearch, // hanya ini yang beda dari raw
// 			status,
// 			types,
// 			variants,
// 		}),
// 	};

// 	return { debounced, raw };
// }
