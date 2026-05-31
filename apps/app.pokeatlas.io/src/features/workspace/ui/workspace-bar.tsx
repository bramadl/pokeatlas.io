"use client";

import { HandPointingIcon, NutIcon } from "@phosphor-icons/react";
import { useCallback, useMemo, useState } from "react";
import { useWindowSize } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useWorkspace } from "../use-workspace";
import { WorkspaceMode } from "./workspace-mode";
import { WorkspaceSyncButton } from "./workspace-sync-button";
import { BrushToolbar } from "./workspace-toolbar";

const BREAKPOINT = 768;

function DesktopVersion() {
	return (
		<aside className="fixed bottom-8 xl:bottom-4 left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center w-fit bg-background text-foreground drop-shadow-2xl border border-border/50 rounded-full animate-in slide-in-from-bottom fade-in-0 fill-mode-both duration-500 ease-in-out">
			<div className="flex items-center gap-3 p-2">
				<WorkspaceMode />
				<Separator className="my-1" orientation="vertical" />
				<BrushToolbar />
				<Separator className="my-1" orientation="vertical" />
				<WorkspaceSyncButton mobile={false} />
			</div>
		</aside>
	);
}

function MobileVersion() {
	const { activeBrushes } = useWorkspace();
	const [open, setOpen] = useState(false);

	const toggle = useCallback(() => setOpen((o) => !o), []);
	const isPointerMode = useMemo(
		() => activeBrushes.length === 0,
		[activeBrushes],
	);

	return (
		<div className="md:hidden">
			<aside className="fixed bottom-4 left-4 z-50 bg-background text-foreground drop-shadow-2xl border border-border/50 rounded-full p-2">
				<WorkspaceSyncButton />
			</aside>
			<aside className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-2">
				<div
					className={cn(
						"flex flex-col items-center gap-2",
						"bg-background drop-shadow-2xl border border-border/50 rounded-full p-2",
						"transition-[opacity,translate-y] duration-300 ease-out",
						open
							? "opacity-100 translate-y-0 pointer-events-auto"
							: "opacity-0 translate-y-4 pointer-events-none",
					)}
				>
					<BrushToolbar vertical />
				</div>
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
	);
}

export function WorkspaceBar() {
	const { width } = useWindowSize();
	if (width < BREAKPOINT) return <MobileVersion />;
	return <DesktopVersion />;
}
