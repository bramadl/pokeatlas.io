"use client";

import Image from "next/image";
import { useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";

import { filterParsers } from "../filter.parsers";
import { FilterLabel } from "../ui/filter-label";
import { POKEMON_TYPE_OPTIONS } from "./type.options";

export function TypeFilter() {
	const [{ types }, setFilters] = useQueryStates(filterParsers);

	function toggleType(value: string) {
		const current = types ?? [];
		if (current.includes(value)) {
			const next = current.filter((t) => t !== value);
			setFilters({ types: next.length > 0 ? next : null });
		} else if (current.length < 2) {
			setFilters({ types: [...current, value] });
		}
	}

	return (
		<div>
			<FilterLabel
				hasClear={(types?.length ?? 0) > 0}
				onClear={() => setFilters({ types: null })}
			>
				Types
				{(types?.length ?? 0) > 0 && (
					<span className="ml-1 text-muted-foreground/50 normal-case font-normal tracking-normal">
						({types?.length}/2)
					</span>
				)}
			</FilterLabel>
			<div className="grid grid-cols-9 gap-1">
				{POKEMON_TYPE_OPTIONS.map((type) => {
					const isActive = (types ?? []).includes(type);
					const isDisabled = (types?.length ?? 0) >= 2 && !isActive;
					return (
						<Button
							aria-label={type}
							aria-pressed={isActive}
							className="px-1 md:px-3"
							disabled={isDisabled}
							key={type}
							onClick={() => toggleType(type)}
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
			</div>
		</div>
	);
}
