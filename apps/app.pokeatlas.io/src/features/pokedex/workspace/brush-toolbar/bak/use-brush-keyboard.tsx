// "use client";

// import { useCallback, useEffect, useState } from "react";

// import { BRUSH_HOTKEY, BRUSHES, type Brush } from "./brush";

// interface UseBrushKeyboardOptions {
// 	activeBrushes: Brush[];
// 	isBannerVisible: boolean;
// 	isDialOpen: boolean;
// 	onBrushToggle: (brush: Brush) => void;
// 	onClear: () => void;
// 	onToggleOpen: () => void;
// }

// interface UseBrushKeyboardReturn {
// 	clearHighlight: () => void;
// 	highlightedIndex: number | null;
// }

// /**
//  * Keyboard shortcuts:
//  *
//  * Global (always active, suppressed when typing):
//  *   B         — toggle FAB open/closed
//  *   C         — clear brush selection (only when banner visible)
//  *
//  * Dial-open only:
//  *   S/W/P/L/H/N/E  — toggle the corresponding brush directly
//  *   ↑ / ↓          — move highlight up/down through the brush list
//  *   Enter / Space  — toggle the currently highlighted brush
//  *   Escape         — close the dial
//  */
// export function useBrushKeyboard({
// 	activeBrushes,
// 	isBannerVisible,
// 	isDialOpen,
// 	onToggleOpen,
// 	onClear,
// 	onBrushToggle,
// }: UseBrushKeyboardOptions): UseBrushKeyboardReturn {
// 	const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

// 	const clearHighlight = useCallback(() => setHighlightedIndex(null), []);
// 	useEffect(() => {
// 		if (!isDialOpen) clearHighlight();
// 	}, [isDialOpen, clearHighlight]);

// 	useEffect(() => {
// 		function handleKeyDown(e: KeyboardEvent) {
// 			const target = e.target as HTMLElement;

// 			const isTyping =
// 				target.tagName === "INPUT" ||
// 				target.tagName === "TEXTAREA" ||
// 				target.isContentEditable;

// 			// ── Shift shortcuts (global, always active) ──────────────────────────
// 			if (e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
// 				const key = e.key.toLowerCase();

// 				// Shift+Delete = clear all brushes
// 				if (e.key === "Delete" || e.key === "Backspace") {
// 					if (activeBrushes.length === 0) return; // no-op guard
// 					e.preventDefault();
// 					onClear();
// 					return;
// 				}

// 				// Shift+S/W/P/L/H/N/E = toggle brush globally
// 				if (BRUSH_HOTKEY[key]) {
// 					if (isTyping) return; // still respect typing fields
// 					e.preventDefault();
// 					onBrushToggle(BRUSH_HOTKEY[key]);
// 					return;
// 				}

// 				return; // other Shift combos — ignore
// 			}

// 			if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;

// 			const key = e.key.toLowerCase();

// 			// ── Global shortcuts ────────────────────────────────────────────
// 			if (key === "b") {
// 				e.preventDefault();
// 				onToggleOpen();
// 				(document.activeElement as HTMLElement | null)?.blur();
// 				return;
// 			}

// 			if (key === "c") {
// 				if (!isBannerVisible) return;
// 				e.preventDefault();
// 				onClear();
// 				(document.activeElement as HTMLElement | null)?.blur();
// 				return;
// 			}

// 			// ── Dial-open only shortcuts ────────────────────────────────────
// 			if (!isDialOpen) return;

// 			// Hotkeys: directly toggle a brush
// 			if (BRUSH_HOTKEY[key]) {
// 				e.preventDefault();
// 				onBrushToggle(BRUSH_HOTKEY[key]);
// 				// Also move highlight to that brush so user gets visual feedback
// 				setHighlightedIndex(BRUSHES.indexOf(BRUSH_HOTKEY[key]));
// 				return;
// 			}

// 			// Arrow navigation
// 			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
// 				e.preventDefault();
// 				const direction = e.key === "ArrowUp" ? -1 : 1;
// 				setHighlightedIndex((prev) => {
// 					if (prev === null) {
// 						// ArrowUp starts at last item, ArrowDown starts at first
// 						return direction === -1 ? BRUSHES.length - 1 : 0;
// 					}
// 					return (prev + direction + BRUSHES.length) % BRUSHES.length;
// 				});
// 				return;
// 			}

// 			// Enter / Space — toggle highlighted brush
// 			if ((e.key === "Enter" || e.key === " ") && highlightedIndex !== null) {
// 				e.preventDefault();
// 				const brush = BRUSHES[highlightedIndex];
// 				if (brush) onBrushToggle(brush);
// 				return;
// 			}

// 			// Escape — close dial
// 			if (e.key === "Escape") {
// 				e.preventDefault();
// 				onToggleOpen();
// 				return;
// 			}
// 		}

// 		window.addEventListener("keydown", handleKeyDown);
// 		return () => window.removeEventListener("keydown", handleKeyDown);
// 	}, [
// 		activeBrushes,
// 		isBannerVisible,
// 		isDialOpen,
// 		highlightedIndex,
// 		onToggleOpen,
// 		onClear,
// 		onBrushToggle,
// 	]);

// 	return { clearHighlight, highlightedIndex };
// }
