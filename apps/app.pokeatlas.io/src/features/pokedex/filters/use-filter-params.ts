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

export const dexParsers = { dex: dexParser } as const;

export const filterParsers = {
	classification: classificationParser,
	search: searchParser,
	status: statusParser,
	types: typesParser,
	variants: variantsParser,
} as const;

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

	return {
		debounced: {
			dex: buildDex({ dex: dDex }),
			filters: buildFilters({
				classification: dClassification,
				search: dSearch,
				status: dStatus,
				types: dTypes,
				variants: dVariants,
			}),
		},
		raw: {
			dex: buildDex({ dex }),
			filters: buildFilters({
				classification,
				search,
				status,
				types,
				variants,
			}),
		},
	};
}
