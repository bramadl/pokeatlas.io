"use client";

import { useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";

import { FilterGroup } from "../../filters/filter-group";
import { FilterLabel } from "../../filters/filter-label";
import { filterParsers } from "../../filters/use-filter-params";
import { REGION_OPTIONS } from "./region.options";

export function RegionFilter() {
	const [{ regions }, setFilters] = useQueryStates(filterParsers);

	function toggleRegion(value: string) {
		const current = regions ?? [];
		const next = current.includes(value)
			? current.filter((r) => r !== value)
			: [...current, value];
		setFilters({ regions: next.length > 0 ? next : null });
	}

	return (
		<div>
			<FilterLabel
				hasClear={(regions?.length ?? 0) > 0}
				onClear={() => setFilters({ regions: null })}
			>
				Regions
			</FilterLabel>
			<FilterGroup>
				{REGION_OPTIONS.map(({ label, value }) => {
					const isActive = (regions ?? []).includes(value);
					return (
						<Button
							aria-pressed={isActive}
							key={value}
							onClick={() => toggleRegion(value)}
							size="sm"
							variant={isActive ? "default" : "secondary"}
						>
							{label}
						</Button>
					);
				})}
			</FilterGroup>
		</div>
	);
}
