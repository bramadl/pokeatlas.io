"use client";

import { useState } from "react";

import {
	PokedexStoreContext,
	type PokedexStoreProviderProps,
} from "./pokedex.context";
import { createPokedexStore } from "./pokedex.store";

export const PokedexStoreProvider = ({
	children,
	initialTrackingSignature,
	initialPokedexEntriesLimit,
	trainerId,
}: PokedexStoreProviderProps) => {
	const [store] = useState(() =>
		createPokedexStore({
			defaultSignature: initialTrackingSignature,
			limit: initialPokedexEntriesLimit,
			trackingSignature: initialTrackingSignature,
			trainerId,
		}),
	);

	return (
		<PokedexStoreContext.Provider value={store}>
			{children}
		</PokedexStoreContext.Provider>
	);
};
