"use client";

import { useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { CLASSIFICATION_OPTIONS } from "../filter.options";
import { filterParsers } from "../filter.parsers";
import { FilterGroup } from "./filter-group";
import { FilterLabel } from "./filter-label";

export function ClassificationFilter() {
	const [{ classification }, setFilters] = useQueryStates(filterParsers);
	const active = classification ?? [];

	function toggleClassification(value: string) {
		const next = active.includes(value)
			? active.filter((c) => c !== value)
			: [...active, value];
		setFilters({ classification: next.length > 0 ? next : null });
	}

	return (
		<div>
			<FilterLabel
				hasClear={active.length > 0}
				onClear={() => setFilters({ classification: null })}
			>
				Classifications
			</FilterLabel>
			<FilterGroup>
				{CLASSIFICATION_OPTIONS.map(({ label, value }) => {
					const isActive = active.includes(value);
					return (
						<Button
							aria-pressed={isActive}
							key={value}
							onClick={() => toggleClassification(value)}
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
