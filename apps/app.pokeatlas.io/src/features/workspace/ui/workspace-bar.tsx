"use client";

import { HandPointingIcon, NutIcon } from "@phosphor-icons/react";
import { Fragment, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useWorkspace } from "../use-workspace";
import { WorkspaceMode } from "./workspace-mode";
import { WorkspaceSyncButton } from "./workspace-sync-button";
import { BrushToolbar } from "./workspace-toolbar";

function DesktopVersion() {
	return (
		<aside className="hidden md:flex items-center justify-center fixed bottom-8 xl:bottom-4 left-1/2 -translate-x-1/2 w-fit bg-background text-foreground drop-shadow-2xl border border-border/50 rounded-full animate-in slide-in-from-bottom fade-in-0 fill-mode-both duration-500 ease-in-out">
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

	const isPointerMode = useMemo(
		() => activeBrushes.length === 0,
		[activeBrushes],
	);

	return (
		<div className="md:hidden">
			<aside className="fixed bottom-4 left-4 z-50 bg-background text-foreground drop-shadow-2xl border border-border/50 rounded-full p-2 animate-in slide-in-from-bottom fade-in-0 fill-mode-both duration-500 ease-in-out">
				<WorkspaceSyncButton />
			</aside>
			<aside className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-2 animate-in slide-in-from-bottom fade-in-0 fill-mode-both duration-500 ease-in-out">
				<Popover>
					<div className="bg-background drop-shadow-2xl border border-border/50 rounded-full p-2">
						<PopoverTrigger asChild>
							<Button aria-label="Toggle brush toolbar" size="icon">
								{isPointerMode ? <HandPointingIcon /> : <NutIcon />}
							</Button>
						</PopoverTrigger>
					</div>
					<PopoverContent
						className={cn(
							"flex flex-col items-center gap-2 w-auto outline-none shadow-none ring-0  ",
							"bg-background drop-shadow-2xl border border-border/50 rounded-full p-2",
						)}
						sideOffset={16}
					>
						<BrushToolbar vertical />
					</PopoverContent>
				</Popover>
			</aside>
		</div>
	);
}

export function WorkspaceBar() {
	return (
		<Fragment>
			<MobileVersion />
			<DesktopVersion />
		</Fragment>
	);
}
