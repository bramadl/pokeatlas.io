import { useContext } from "react";
import { useStore } from "zustand";

import { PokedexStoreContext } from "./pokedex.context";
import type { PokedexStore } from "./pokedex.store";

export const usePokedexStore = <T>(selector: (store: PokedexStore) => T): T => {
	const counterStoreContext = useContext(PokedexStoreContext);
	if (!counterStoreContext) {
		throw new Error(`usePokedexStore must be used within PokedexStoreProvider`);
	}

	return useStore(counterStoreContext, selector);
};
