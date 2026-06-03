import { createContext, type ReactNode } from "react";

import type { createPokedexStore } from "./pokedex.store";

export type PokedexStoreApi = ReturnType<typeof createPokedexStore>;

export const PokedexStoreContext = createContext<PokedexStoreApi | null>(null);

export interface PokedexStoreProviderProps {
	children: ReactNode;
	initialPokedexEntriesLimit: number;
	initialTrackingSignature: string;
	trainerId: string;
}
