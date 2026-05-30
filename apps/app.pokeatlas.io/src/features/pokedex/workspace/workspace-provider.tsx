"use client";

import { useCallback, useState } from "react";

import {
	applyBrushConstraints,
	type Brush,
	getDisabledBrushes,
} from "./brush/brush";
import type { ViewKey } from "./views/view.options";
import { WorkspaceContext } from "./workspace.context";
import { WorkspaceBar } from "./workspace-bar";

interface WorkspaceProviderProps {
	children: React.ReactNode;
	trainerId: string;
}

export function WorkspaceProvider({
	children,
	trainerId,
}: WorkspaceProviderProps) {
	const [activeBrushes, setActiveBrushesRaw] = useState<Brush[]>([]);
	const [activeView, setActiveViewRaw] = useState<ViewKey>("BASE");

	const setActiveBrushes = useCallback((next: Brush[]) => {
		setActiveBrushesRaw(next);
	}, []);

	/**
	 * When the view changes, strip any currently-active brushes that are now
	 * invalid for the new view. This prevents silent illegal states.
	 * e.g. user had "purified" active, switches to SHADOW view → purified stripped.
	 */
	const setActiveView = useCallback(
		(next: ViewKey) => {
			setActiveViewRaw(next);
			const disabled = getDisabledBrushes(next);
			if (disabled.size > 0 && activeBrushes.some((b) => disabled.has(b))) {
				setActiveBrushesRaw((prev) =>
					applyBrushConstraints(prev, prev, disabled),
				);
			}
		},
		[activeBrushes],
	);

	return (
		<WorkspaceContext.Provider
			value={{
				activeBrushes,
				activeView,
				setActiveBrushes,
				setActiveView,
				trainerId,
			}}
		>
			{children}
			<WorkspaceBar />
		</WorkspaceContext.Provider>
	);
}
