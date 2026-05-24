"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { POKEMON_TYPES } from "@/features/game.constant";
import { cn } from "@/lib/utils";

import {
	countActiveFilters,
	FORM_OPTIONS,
	type PokedexFilters,
	type PokedexForm,
	type PokedexStatus,
	STATUS_OPTIONS,
} from "./filter.types";
import { useFilterForm, useFilterStatus, useFilterType } from "./use-filter";

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterSectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70 mb-1.5">
			{children}
		</p>
	);
}

function FilterChipGroup({
	children,
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-wrap items-center gap-1", className)}
			{...props}
		>
			{children}
		</div>
	);
}

// ── Main component ─────────────────────────────────────────────────────────────

interface PokedexFilterPanelProps {
	filters: PokedexFilters;
	isVisible: boolean;
	onFilterChange: (patch: Partial<PokedexFilters>) => void;
	onReset?: () => void;
}

export function PokedexFilterPanel({
	filters,
	isVisible,
	onFilterChange,
	onReset,
}: PokedexFilterPanelProps) {
	const onStatusChange = useFilterStatus(onFilterChange);
	const onFormChange = useFilterForm(onFilterChange);
	const onTypeToggle = useFilterType(filters.types, onFilterChange);

	return (
		<div
			className={cn(
				"-m-3 p-3 overflow-hidden transition-all duration-300 ease-in-out",
				isVisible
					? "max-h-100 opacity-100"
					: "max-h-0 opacity-0 pointer-events-none",
			)}
		>
			<div className="mt-4 pt-4 border-t border-border/50">
				<div className="grid lg:grid-cols-2 gap-4">
					<div className="flex flex-col justify-between gap-4">
						{/* ── Status ─────────────────────────────────────────────────── */}
						<div className="shrink-0">
							<FilterSectionLabel>Status</FilterSectionLabel>
							<FilterChipGroup>
								{STATUS_OPTIONS.map(({ label, value }) => (
									<Button
										key={value}
										onClick={() => onStatusChange(value as PokedexStatus)}
										size="sm"
										variant={filters.status === value ? "default" : "secondary"}
									>
										{label}
									</Button>
								))}
							</FilterChipGroup>
						</div>

						{/* ── Forms ──────────────────────────────────────────────────── */}
						<div className="shrink-0">
							<FilterSectionLabel>Forms</FilterSectionLabel>
							<FilterChipGroup>
								{FORM_OPTIONS.map(({ label, value }) => (
									<Button
										key={value}
										onClick={() => onFormChange(value as PokedexForm)}
										size="sm"
										variant={filters.form === value ? "default" : "secondary"}
									>
										{label}
									</Button>
								))}
							</FilterChipGroup>
						</div>
					</div>

					{/* ── Types ──────────────────────────────────────────────────── */}
					<div className="flex-1">
						<FilterSectionLabel>Types</FilterSectionLabel>
						<FilterChipGroup className="grid grid-cols-6 gap-1">
							{POKEMON_TYPES.map((type) => {
								const isActive = filters.types.includes(type);
								const shouldDisable = filters.types.length >= 2 && !isActive;
								return (
									<Button
										aria-label={type}
										aria-pressed={isActive}
										disabled={shouldDisable}
										key={type}
										onClick={() => onTypeToggle(type)}
										size="sm"
										variant={isActive ? "default" : "secondary"}
									>
										<Image
											alt={type}
											height={20}
											src={`/pokemon-types/${type}.png`}
											width={20}
										/>
									</Button>
								);
							})}
						</FilterChipGroup>
					</div>
				</div>

				{countActiveFilters(filters) > 0 && (
					<div className="mt-3 flex animate-in fade-in">
						<Button
							className="text-muted-foreground"
							onClick={onReset}
							size="sm"
							variant="ghost"
						>
							Reset filters
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
