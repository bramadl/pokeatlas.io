import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { browsePokedexQueryOptions } from "./api/query-options";
import { usePokedexFilterParams } from "./filters/use-filter-params";

interface UsePokedexParamsOptions {
	trainerId: string;
}

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
