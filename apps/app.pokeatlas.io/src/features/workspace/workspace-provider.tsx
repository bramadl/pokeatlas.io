"use client";

import { useCallback, useState } from "react";

import { applyBrushConstraints, type Brush, getDisabledBrushes } from "./brush";
import { WorkspaceBar } from "./ui/workspace-bar";
import { WorkspaceContext } from "./workspace.context";

interface WorkspaceProviderProps {
	children: React.ReactNode;
	trainerId: string;
}

export function WorkspaceProvider({
	children,
	trainerId,
}: WorkspaceProviderProps) {
	const [activeBrushes, setActiveBrushesRaw] = useState<Brush[]>([]);
	const [activeView, setActiveViewRaw] = useState<string>();

	const setActiveBrushes = useCallback((next: Brush[]) => {
		setActiveBrushesRaw(next);
	}, []);

	const setActiveView = useCallback(
		(next?: string) => {
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
