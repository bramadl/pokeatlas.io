"use client";

import { useCallback, useState } from "react";
import type { PokedexEntry } from "../types";
import {
	applyBrushConstraints,
	applyBrushTap,
	type Brush,
	isDirty,
} from "./brush";

interface UseBrushReturn {
	activeBrushes: Brush[];
	/** Deselects all brushes without closing the dial. */
	clearBrushes: () => void;
	/**
	 * Returns the next trackedStates for an entry after a tap,
	 * or null if nothing changed (dirty check).
	 *
	 * When the dial is closed, always produces a BASE tap (track/untrack entry).
	 * When the dial is open, uses the active brushes.
	 */
	computeTap: (entry: PokedexEntry) => string[] | null;
	isOpen: boolean;
	/** For brush item onToggle — handles mutual exclusion internally */
	onBrushChange: (values: string[]) => void;
	onToggleOpen: () => void;
}

export function useBrush(): UseBrushReturn {
	const [activeBrushes, setActiveBrushes] = useState<Brush[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	const clearBrushes = useCallback(() => setActiveBrushes([]), []);

	const computeTap = useCallback(
		(entry: PokedexEntry): string[] | null => {
			const newStates = applyBrushTap(entry.trackedStates, activeBrushes);
			console.log("computeTap", {
				activeBrushes,
				currentStates: entry.trackedStates,
				newStates,
			});
			if (!isDirty(entry.trackedStates, newStates)) return null;
			return newStates;
		},
		[activeBrushes],
	);

	const onBrushChange = useCallback(
		(values: string[]) => {
			const next = values as Brush[];
			setActiveBrushes(applyBrushConstraints(activeBrushes, next));
		},
		[activeBrushes],
	);

	const onToggleOpen = useCallback(() => setIsOpen((v) => !v), []);

	return {
		activeBrushes,
		clearBrushes,
		computeTap,
		isOpen,
		onBrushChange,
		onToggleOpen,
	};
}
