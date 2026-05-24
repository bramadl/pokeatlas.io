"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import { useCallback, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";

import { getTypeTheme } from "../pokedex-theme";
import type { PokedexEntry } from "../types";
import { getFormBadge, getFormLabel } from "./pokedex-card.helpers";
import { PokedexCardBadge } from "./pokedex-card-badge";
import { PokedexCardDetail } from "./pokedex-card-detail";
import { PokedexCardInfo } from "./pokedex-card-info";
import { PokedexCardSprite } from "./pokedex-card-sprite";

interface PokedexCardProps {
	isBrushModeActive?: boolean;
	onTap?: () => void;
	pokemon: PokedexEntry;
	priority?: boolean;
}

export function PokedexCard({
	pokemon: p,
	onTap,
	priority = false,
	isBrushModeActive = false,
}: PokedexCardProps) {
	const masterButton = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState(false);
	const isMobile = useIsMobile();

	const isTracked = p.trackedStates.length > 0;
	const theme = getTypeTheme(p.types[0] as string);

	const handleInfoClick = useCallback(() => {
		masterButton.current?.focus();
		setOpen(true);
	}, []);

	const cardBody = (
		<div
			className={cn(
				"relative mt-10 group drop-shadow-xl drop-shadow-black/5",
				"hover:scale-105 transition-transform duration-300 will-change-transform",
				open && "scale-105 shadow-2xl",
			)}
		>
			<div
				className={cn(
					"size-full transition-opacity duration-300",
					isTracked ? "opacity-100" : "opacity-75",
				)}
			>
				<button
					aria-label={isTracked ? `Untrack ${p.name}` : `Track ${p.name}`}
					className="absolute inset-0 z-2 rounded-lg cursor-pointer outline-none"
					onClick={onTap}
					ref={masterButton}
					tabIndex={-1}
					type="button"
				/>

				<PokedexCardSprite
					isTracked={isTracked}
					name={p.name}
					onInfoClick={handleInfoClick}
					priority={priority}
					spriteUrl={p.sprites.url}
					theme={theme}
					types={p.types as string[]}
				/>

				<PokedexCardInfo
					formBadge={getFormBadge(p.form)}
					formLabel={getFormLabel(p.form, p.dex)}
					isBrushModeActive={isBrushModeActive}
					isTracked={isTracked}
					name={p.name}
					theme={theme}
				/>

				<PokedexCardBadge
					theme={theme}
					trackedStates={p.trackedStates}
					types={p.types as string[]}
				/>
			</div>
		</div>
	);

	if (!isMobile) {
		return (
			<Popover modal onOpenChange={setOpen} open={open}>
				<PopoverAnchor asChild>{cardBody}</PopoverAnchor>
				<PopoverContent
					align="center"
					className="min-w-60 w-auto ring-transparent drop-shadow-2xl p-4"
					side="right"
					sideOffset={16}
				>
					<PokedexCardDetail pokemon={p} />
					<PopoverPrimitive.Arrow className="fill-white" />
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<>
			{cardBody}
			<Drawer onOpenChange={setOpen} open={open}>
				<DrawerContent className="px-4 pb-8">
					<DrawerTitle className="sr-only">{p.name}</DrawerTitle>
					<div className="mt-4 scrollbar-none overflow-y-auto p-4">
						<PokedexCardDetail pokemon={p} />
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
