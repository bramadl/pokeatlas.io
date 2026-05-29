"use client";

import { createContext, useContext } from "react";

// import type { Pokemon } from "@/features/pokedex/pokemon-card/card.types";

// import type { Brush } from "./brush";

interface BrushContextValue {
	_: undefined;
	// activeBrushes: Brush[];
	// isOpen: boolean;
	// isPending: boolean;
	// onBrushChange: (values: string[]) => void;
	// onClearBrushes: () => void;
	// onTap: (pokemon: Pokemon) => void;
	// onToggleOpen: () => void;
	// pendingRefs: Set<string>;
}

export const BrushContext = createContext<BrushContextValue | null>(null);

export function useBrush() {
	const ctx = useContext(BrushContext);
	if (!ctx) throw new Error("useBrush must be used inside <BrushProvider>");
	return ctx;
}
