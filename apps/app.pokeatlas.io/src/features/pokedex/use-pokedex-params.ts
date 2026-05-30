import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { browsePokedexQueryOptions } from "./api/query-options";
import { usePokedexFilterParams } from "./filters/use-filter-params";

interface UsePokedexParamsOptions {
	/**
	 * @description
	 * Specify which trainer is accessing the Pokedex.
	 */
	trainerId: string;
}

/**
 * @description
 * Returns a sophisticated filter params for pokedex query.
 *
 * When the user goes to a page which data had been cached,
 * then the filter returned will not debounce the updates.
 *
 * Otherwise, a slight debounce will occurr to prevent furious
 * tapping on any filters–reducing network requests.
 */
export function usePokedexParams({ trainerId }: UsePokedexParamsOptions) {
	const queryClient = useQueryClient();

	const { raw, debounced } = usePokedexFilterParams();
	const isCached = useCallback(() => {
		return (
			queryClient.getQueryData(
				browsePokedexQueryOptions({ ...raw, trainerId }).queryKey,
			) !== undefined
		);
	}, [queryClient, raw, trainerId]);

	return isCached() ? raw : debounced;
}
