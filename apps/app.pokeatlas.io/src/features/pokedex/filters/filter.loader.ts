import type { BrowsePokedexInput } from "@pokeatlas/core/types";
import type { SearchParams } from "nuqs/server";
import { createSearchParamsCache } from "nuqs/server";

import {
	classificationParser,
	dexParser,
	searchParser,
	statusParser,
	typesParser,
	variantsParser,
} from "./filter.params";
import { buildDex, buildFilters } from "./filter.utils";

const searchParamsCache = createSearchParamsCache({
	classification: classificationParser,
	dex: dexParser,
	search: searchParser,
	status: statusParser,
	types: typesParser,
	variants: variantsParser,
});

export interface PokedexLoaderResult {
	dex: BrowsePokedexInput["dex"];
	filters: BrowsePokedexInput["filters"];
}

export async function loadPokedexFilters(
	searchParams: Promise<SearchParams>,
): Promise<PokedexLoaderResult> {
	const parsed = await searchParamsCache.parse(searchParams);
	return {
		dex: buildDex({ dex: parsed.dex }),
		filters: buildFilters(parsed),
	};
}
