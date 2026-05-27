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
				<div className="relative z-1 p-4 grid grid-cols-[minmax(360px,auto)_1fr_minmax(360px,auto)] gap-x-8 bg-white items-center">
					<DexSwitcher />
					<StatusFilter />
					<div className="flex items-center gap-2">
						<SearchFilter />
						<VariantControls />
						<CollapsibleTrigger asChild>
							<FilterButton
								activeFilterCount={activeFilterCount}
								isOpen={isOpen}
								onClick={() => {}}
							/>
						</CollapsibleTrigger>
					</div>
				</div>

				<CollapsibleContent>
					<div className="bg-white">
						<div className="bg-border h-px" />
						<div className="p-4 grid lg:grid-cols-[3.5fr_1.45fr] gap-x-8 gap-y-4">
							<TypeFilter />
							<ClassificationFilter />
						</div>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</header>
	);
}
