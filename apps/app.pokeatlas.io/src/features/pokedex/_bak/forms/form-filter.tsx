"use client";

import { useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";

import { FilterGroup } from "../../filters/filter-group";
import { FilterLabel } from "../../filters/filter-label";
import { filterParsers } from "../../filters/use-filter-params";
import { FORM_OPTIONS } from "./form.options";

export function FormFilter() {
	const [{ form }, setFilters] = useQueryStates(filterParsers);
	function toggleForm(value: string) {
		setFilters({ form: form === value ? null : value });
	}

	return (
		<div>
			<FilterLabel hasClear={!!form} onClear={() => setFilters({ form: null })}>
				Form
			</FilterLabel>
			<FilterGroup>
				{FORM_OPTIONS.map(({ label, value }) => (
					<Button
						aria-pressed={form === value}
						key={value}
						onClick={() => toggleForm(value)}
						size="sm"
						variant={form === value ? "default" : "secondary"}
					>
						{label}
					</Button>
				))}
			</FilterGroup>
		</div>
	);
}
