/// SKIP THIS FILE, SEE `workspace-provider.tsx` INSTEAD
/// THIS FILE IS INTENDED ONLY FOR REFERENCES FROM PREVIOUS (FAILURE) ATTEMPTS

// "use client";

// import { useCallback, useState } from "react";

// import {
// 	applyBrushConstraints,
// 	type Brush,
// 	getDisabledBrushes,
// } from "./brush-toolbar/brush";
// import { BrushToolbar } from "./brush-toolbar/brush-toolbar";
// import type { ViewKey } from "./view.options";
// import { WorkspaceContext } from "./workspace.context";

// interface WorkspaceProviderProps {
// 	children: React.ReactNode;
// 	trainerId: string;
// }

// export function WorkspaceProvider({
// 	children,
// 	trainerId,
// }: WorkspaceProviderProps) {
// 	const [activeBrushes, setActiveBrushesRaw] = useState<Brush[]>([]);
// 	const [activeView, setActiveViewRaw] = useState<ViewKey>("BASE");

// 	const setActiveBrushes = useCallback((next: Brush[]) => {
// 		setActiveBrushesRaw(next);
// 	}, []);

// 	/**
// 	 * When the view changes, strip any currently-active brushes that are now
// 	 * invalid for the new view. This prevents silent illegal states.
// 	 * e.g. user had "purified" active, switches to SHADOW view → purified stripped.
// 	 */
// 	const setActiveView = useCallback(
// 		(next: ViewKey) => {
// 			setActiveViewRaw(next);
// 			const disabled = getDisabledBrushes(next);
// 			if (disabled.size > 0 && activeBrushes.some((b) => disabled.has(b))) {
// 				setActiveBrushesRaw((prev) =>
// 					applyBrushConstraints(prev, prev, disabled),
// 				);
// 			}
// 		},
// 		[activeBrushes],
// 	);

// 	return (
// 		<WorkspaceContext.Provider
// 			value={{
// 				activeBrushes,
// 				activeView,
// 				setActiveBrushes,
// 				setActiveView,
// 				trainerId,
// 			}}
// 		>
// 			{children}
// 			<BrushToolbar />
// 		</WorkspaceContext.Provider>
// 	);
// }

// "use client"; ––– THIS

// import { useCallback, useState } from "react";

// import {
// 	applyBrushConstraints,
// 	type Brush,
// 	getDisabledBrushes,
// } from "./brush-toolbar/brush";
// import { BrushToolbar } from "./brush-toolbar/brush-toolbar";
// import { useTrackMutation } from "./tracking/use-track-mutation";
// import type { ViewKey } from "./view.options";
// import { WorkspaceContext } from "./workspace.context";

// interface WorkspaceProviderProps {
// 	children: React.ReactNode;
// 	trainerId: string;
// }

// export function WorkspaceProvider({
// 	children,
// 	trainerId,
// }: WorkspaceProviderProps) {
// 	const [activeBrushes, setActiveBrushesRaw] = useState<Brush[]>([]);
// 	const [activeView, setActiveViewRaw] = useState<ViewKey>("BASE");

// 	// Singleton mutation — satu instance untuk seluruh workspace
// 	const { tap: tapMutation } = useTrackMutation();

// 	const tap = useCallback(
// 		(pokemon: Parameters<typeof tapMutation>[0]) => {
// 			tapMutation(pokemon, activeBrushes, trainerId);
// 		},
// 		[tapMutation, activeBrushes, trainerId],
// 	);

// 	const setActiveBrushes = useCallback((next: Brush[]) => {
// 		setActiveBrushesRaw(next);
// 	}, []);

// 	const setActiveView = useCallback(
// 		(next: ViewKey) => {
// 			setActiveViewRaw(next);
// 			const disabled = getDisabledBrushes(next);
// 			if (disabled.size > 0 && activeBrushes.some((b) => disabled.has(b))) {
// 				setActiveBrushesRaw((prev) =>
// 					applyBrushConstraints(prev, prev, disabled),
// 				);
// 			}
// 		},
// 		[activeBrushes],
// 	);

// 	return (
// 		<WorkspaceContext.Provider
// 			value={{
// 				activeBrushes,
// 				activeView,
// 				setActiveBrushes,
// 				setActiveView,
// 				tap,
// 				trainerId,
// 			}}
// 		>
// 			{children}
// 			<BrushToolbar />
// 		</WorkspaceContext.Provider>
// 	);
// }
