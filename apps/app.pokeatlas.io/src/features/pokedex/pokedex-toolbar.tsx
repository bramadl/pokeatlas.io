"use client";

import { useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { useEventListener } from "usehooks-ts";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ClassificationFilter } from "./filters/classifications";
import { filterParsers } from "./filters/filter.parsers";
import { FilterButton } from "./filters/filter-button";
import { SearchFilter } from "./filters/search";
import { StatusFilter } from "./filters/status";
import { TypeFilter } from "./filters/types";
import { VariantControls } from "./filters/variants";

import { PokedexSwitcher } from "./pokedex-switcher";

export function PokedexToolbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [{ classification, types }] = useQueryStates(filterParsers);

	const activeFilterCount = useMemo(
		() => (classification ? 1 : 0) + (types?.length ?? 0),
		[classification, types],
	);

	useEventListener("keydown", (event) => {
		if (!isOpen) return;
		if (event.key === "Escape" || event.key === "Esc") {
			event.preventDefault();
			setIsOpen(false);
		}
	});

	return (
		<header className="sticky top-16 z-10 shadow">
			<Collapsible onOpenChange={setIsOpen} open={isOpen}>
				<div className="relative z-1 p-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr] lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[320px_1fr_320px] gap-x-8 gap-y-4 bg-white items-center justify-between">
					<PokedexSwitcher className="row-start-1 sm:row-start-[unset] w-full flex items-center justify-between gap-4" />
					<StatusFilter className="row-start-3 sm:row-start-[unset] w-full flex items-center justify-start lg:justify-center gap-4" />
					<div className="sm:col-span-2 lg:col-span-1 flex items-center gap-2">
						<SearchFilter className="flex-1 order-2 lg:order-1" />
						<div className="order-1 lg:order-2">
							<CollapsibleTrigger asChild>
								<FilterButton
									activeFilterCount={activeFilterCount}
									isOpen={isOpen}
								/>
							</CollapsibleTrigger>
						</div>
						<VariantControls className="order-3 lg:order-3" />
					</div>
				</div>
				<CollapsibleContent>
					<div className="bg-white border-t">
						<div className="p-4 grid lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[320px_1fr_320px] gap-x-8 gap-y-4">
							<ClassificationFilter />
							<div className="lg:col-span-2">
								<TypeFilter />
							</div>
						</div>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</header>
	);
}
