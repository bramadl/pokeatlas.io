import { HandPointingIcon, NutIcon } from "@phosphor-icons/react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { BrushToolbar } from "./brush-toolbar";
import { RefreshButton } from "./refresh-button";
import { useWorkspace } from "./workspace.context";

export function WorkspaceBar() {
	const [open, setOpen] = useState(false);
	const { activeBrushes } = useWorkspace();
	const isPointerMode = activeBrushes.length === 0;

	const toggle = useCallback(() => setOpen((o) => !o), []);
	return (
		<>
			{/* ── Desktop / Tablet: satu pill combined ──────────────────── */}
			<aside className="fixed bottom-8 xl:bottom-4 left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center">
				<aside className="w-fit bg-background text-foreground drop-shadow-2xl border border-border/50 rounded-full">
					<div className="flex items-center gap-3 p-2">
						<RefreshButton />
						<Separator className="my-1" orientation="vertical" />
						<BrushToolbar />
					</div>
				</aside>
			</aside>

			{/* ── Mobile: dua bubble terpisah ───────────────────────────── */}
			<div className="md:hidden">
				{/* Backdrop */}
				{open && (
					<button
						className="fixed inset-0 z-40"
						onClick={() => setOpen(false)}
						type="button"
					/>
				)}

				{/* Kiri: Sync */}
				<aside className="fixed bottom-4 left-4 z-50">
					<div className="bg-background text-foreground drop-shadow-2xl border border-border/50 rounded-full p-2">
						<RefreshButton />
					</div>
				</aside>

				{/* Kanan: FAB + brush stack */}
				<aside className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-2">
					{/* Brush buttons — slide up when open */}
					<div
						className={cn(
							"flex flex-col items-center gap-2",
							"transition-all duration-300 ease-out",
							open
								? "opacity-100 translate-y-0 pointer-events-auto"
								: "opacity-0 translate-y-4 pointer-events-none",
						)}
					>
						<div className="bg-background drop-shadow-2xl border border-border/50 rounded-full p-2 flex flex-col items-center gap-2">
							<BrushToolbar vertical />
						</div>
					</div>

					{/* FAB */}
					<div className="bg-background drop-shadow-2xl border border-border/50 rounded-full p-2">
						<Button
							aria-expanded={open}
							aria-label="Toggle brush toolbar"
							className={cn(
								"transition-transform duration-200",
								open && "rotate-45",
							)}
							onClick={toggle}
							size="icon"
							variant={open ? "default" : "secondary"}
						>
							{isPointerMode ? <HandPointingIcon /> : <NutIcon />}
						</Button>
					</div>
				</aside>
			</div>
		</>
	);
}
