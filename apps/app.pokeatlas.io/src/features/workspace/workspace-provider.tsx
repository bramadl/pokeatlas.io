"use client";

import { useCallback, useMemo, useState } from "react";

import {
	applyBrushConstraints,
	type Brush,
	computeSignature,
	getDisabledBrushes,
} from "./brush";
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

	const signature = useMemo(() => {
		const isPointerMode =
			activeBrushes.length === 0 || activeBrushes.includes("eraser");

		return isPointerMode ? "BASE" : computeSignature(activeBrushes);
	}, [activeBrushes]);

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
				signature,
				trainerId,
			}}
		>
			{children}
			<WorkspaceBar />
		</WorkspaceContext.Provider>
	);
}
