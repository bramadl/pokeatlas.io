"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { useState } from "react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { PokedexSearchInput } from "./filters/pokedex-search-input";
import { PokedexSwitcher } from "./filters/pokedex-switcher";
import { TrackingStatusSwitcher } from "./filters/tracking-status-switcher";
import { usePokedexFilter } from "./filters/use-pokedex-filter";
import { VariantsControls } from "./filters/variants-controls";
import { PokedexToolbarButton } from "./pokedex-toolbar-button";

export function PokedexToolbar({ children }: React.PropsWithChildren) {
	const [{ classifications, types }] = usePokedexFilter();

	const [isOpen, setIsOpen] = useState(false);
	const activeFilterCount = classifications.length + types.length;

	useHotkey("Escape", () => void setIsOpen(false), { enabled: isOpen });

	return (
		<header className="sticky top-16 z-10 shadow">
			<Collapsible onOpenChange={setIsOpen} open={isOpen}>
				<div className="relative z-1 p-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr] lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[320px_1fr_320px] gap-x-8 gap-y-4 bg-background items-center justify-between">
					<div className="row-start-1 sm:row-start-[unset]">
						<PokedexSwitcher />
					</div>
					<div className="row-start-3 sm:row-start-[unset]">
						<TrackingStatusSwitcher />
					</div>
					<div className="sm:col-span-2 lg:col-span-1 flex items-center gap-2">
						<div className="flex-1 order-2 lg:order-1">
							<PokedexSearchInput />
						</div>
						<div className="order-1 lg:order-2">
							<CollapsibleTrigger asChild>
								<PokedexToolbarButton
									activeFilterCount={activeFilterCount}
									isOpen={isOpen}
								/>
							</CollapsibleTrigger>
						</div>
						<div className="order-3 lg:order-3">
							<VariantsControls />
						</div>
					</div>
				</div>
				<CollapsibleContent>{children}</CollapsibleContent>
			</Collapsible>
		</header>
	);
}
