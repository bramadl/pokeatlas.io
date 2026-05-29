"use client";

import { useQueryStates } from "nuqs";
import { useMemo, useState } from "react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { DexSwitcher } from "./dex-switcher/dex-switcher";
import { ClassificationFilter } from "./filters/classifications";
import { FilterButton } from "./filters/filter-button";
import { SearchFilter } from "./filters/search";
import { StatusFilter } from "./filters/status";
import { TypeFilter } from "./filters/types";
import { filterParsers } from "./filters/use-filter-params";
import { VariantControls } from "./filters/variant-controls";

export function PokedexToolbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [{ classification, types }] = useQueryStates(filterParsers);

	const activeFilterCount = useMemo(
		() => (classification ? 1 : 0) + (types?.length ?? 0),
		[classification, types],
	);

	return (
		<header className="sticky top-16 z-10 shadow">
			<Collapsible onOpenChange={setIsOpen} open={isOpen}>
				<div className="relative z-1 p-4 grid grid-cols-1 sm:grid-cols-[260px_260px] md:grid-cols-[320px_320px] lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[320px_1fr_320px] gap-x-8 gap-y-4 bg-white items-center justify-between">
					<div className="w-full">
						<DexSwitcher />
					</div>
					<div className="flex items-center justify-start lg:justify-center gap-4">
						<StatusFilter />
					</div>
					<div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
						<div className="order-1 lg:order-2">
							<CollapsibleTrigger asChild>
								<FilterButton
									activeFilterCount={activeFilterCount}
									isOpen={isOpen}
									onClick={() => {}}
								/>
							</CollapsibleTrigger>
						</div>
						<div className="flex-1 order-2 lg:order-1">
							<SearchFilter />
						</div>
						<div className="order-3 lg:order-3">
							<VariantControls />
						</div>
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
