import { useQueryStates } from "nuqs";
import { useTransition } from "react";

import {
	pokedexFilterKeys,
	pokedexFilterParser,
} from "./pokedex-filters.parser";

export function usePokedexFilter() {
	const [isPending, startTransition] = useTransition();
	const [filters, rawSetFilters] = useQueryStates(pokedexFilterParser, {
		urlKeys: pokedexFilterKeys,
	});

	const setFilters: typeof rawSetFilters = (input, options) => {
		window.scrollTo({ behavior: "smooth", top: 0 });
		return rawSetFilters(input, { startTransition, ...options });
	};

	return [filters, setFilters, { isPending, startTransition }] as const;
}
