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

export function usePokedexFilterParams(): PokedexFilterParams {
	const [{ classification, search, status, types, variants }] =
		useQueryStates(filterParsers);

	const [{ dex }] = useQueryStates(dexParsers);

	const [debouncedSearch] = useDebounceValue(search, 500);

	return {
		dex: buildDex({ dex }),
		filters: buildFilters({
			classification,
			search: debouncedSearch,
			status,
			types,
			variants,
		}),
	};
}
