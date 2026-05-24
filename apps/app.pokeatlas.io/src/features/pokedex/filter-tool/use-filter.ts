"use client";

import { useRouter } from "@bprogress/next/app";
import { useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import {
	buildSearchParams,
	countActiveFilters,
	DEFAULT_FILTERS,
	type PokedexFilters,
	type PokedexForm,
	type PokedexStatus,
	parseFiltersFromParams,
} from "./filter.types";

interface UseFilterReturn {
	activeFilterCount: number;
	filters: PokedexFilters;
	isFilterPending: boolean;
	onFilterChange: (patch: Partial<PokedexFilters>) => void;
	onResetFilters: () => void;
}

export function useFilter(): UseFilterReturn {
	const [isFilterPending, startTransition] = useTransition();
	const router = useRouter();
	const searchParams = useSearchParams();

	const filters = parseFiltersFromParams(searchParams);
	const activeFilterCount = countActiveFilters(filters);

	const onFilterChange = useCallback(
		(patch: Partial<PokedexFilters>) => {
			const next = buildSearchParams(searchParams, patch);
			startTransition(() => {
				router.push(`/?${next.toString()}`);
			});
		},
		[router, searchParams],
	);

	const onResetFilters = useCallback(() => {
		onFilterChange(DEFAULT_FILTERS);
	}, [onFilterChange]);

	return {
		activeFilterCount,
		filters,
		isFilterPending,
		onFilterChange,
		onResetFilters,
	};
}

// ── Convenience typed setters (optional, for component ergonomics) ─────────────

export function useFilterStatus(
	onFilterChange: UseFilterReturn["onFilterChange"],
) {
	return useCallback(
		(status: PokedexStatus) => onFilterChange({ status }),
		[onFilterChange],
	);
}

export function useFilterForm(
	onFilterChange: UseFilterReturn["onFilterChange"],
) {
	return useCallback(
		(form: PokedexForm) => onFilterChange({ form }),
		[onFilterChange],
	);
}

export function useFilterType(
	currentTypes: string[],
	onFilterChange: UseFilterReturn["onFilterChange"],
) {
	return useCallback(
		(type: string) => {
			const types = currentTypes.includes(type)
				? currentTypes.filter((t) => t !== type)
				: [...currentTypes, type];
			onFilterChange({ types });
		},
		[currentTypes, onFilterChange],
	);
}
