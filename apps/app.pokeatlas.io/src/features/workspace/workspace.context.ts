"use client";

import { createContext } from "react";

import type { Brush } from "./brush";

export interface WorkspaceContextValue {
	activeBrushes: Brush[];
	activeView?: string;
	setActiveBrushes: (brushes: Brush[]) => void;
	setActiveView: (view?: string) => void;
	trainerId: string;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
	null,
);
