/// SKIP THIS FILE, SEE `workspace.context.tsx` INSTEAD
/// THIS FILE IS INTENDED ONLY FOR REFERENCES FROM PREVIOUS (FAILURE) ATTEMPTS

// "use client";

// import { createContext, useContext } from "react";

// import type { Brush } from "./brush-toolbar/brush";
// import type { ViewKey } from "./view.options";

// export interface WorkspaceContextValue {
// 	activeBrushes: Brush[];
// 	activeView: ViewKey;
// 	setActiveBrushes: (brushes: Brush[]) => void;
// 	setActiveView: (view: ViewKey) => void;
// 	trainerId: string;
// }

// export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
// 	null,
// );

// export function useWorkspace() {
// 	const ctx = useContext(WorkspaceContext);
// 	if (!ctx) {
// 		throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
// 	}
// 	return ctx;
// }

// "use client"; ––– THIS

// import { createContext, useContext } from "react";
// import type { Pokemon } from "../pokemon-card/card.types";
// import type { Brush } from "./brush-toolbar/brush";
// import type { ViewKey } from "./view.options";

// export interface WorkspaceContextValue {
// 	activeBrushes: Brush[];
// 	activeView: ViewKey;
// 	setActiveBrushes: (brushes: Brush[]) => void;
// 	setActiveView: (view: ViewKey) => void;
// 	tap: (pokemon: Pokemon) => void;
// 	trainerId: string;
// }

// export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
// 	null,
// );

// export function useWorkspace() {
// 	const ctx = useContext(WorkspaceContext);
// 	if (!ctx)
// 		throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
// 	return ctx;
// }
