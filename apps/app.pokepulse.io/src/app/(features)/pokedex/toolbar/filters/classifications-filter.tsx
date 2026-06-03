"use client";

import {
	POKEMON_CLASSIFICATIONS,
	type PokemonClassification,
} from "@pokepulse/core";
import { Button } from "@/components/ui/button";

import { ToolbarFilterLabel } from "./toolbar-filter-label";
import { usePokedexFilter } from "./use-pokedex-filter";

export function ClassificationsFilter() {
	const [{ classifications }, setFilters] = usePokedexFilter();
	const hasClassifications = classifications.length > 0;

	const resetClassification = () => void setFilters({ classifications: null });
	const checkClassification = (v: PokemonClassification) => {
		return classifications.includes(v);
	};

	const toggleClassification = (value: PokemonClassification) => {
		setFilters((f) => {
			return {
				...f,
				classifications: checkClassification(value)
					? f.classifications.filter((c) => c !== value)
					: [...f.classifications, value],
			};
		});
	};

	return (
		<div>
			<ToolbarFilterLabel
				hasClear={hasClassifications}
				onClear={resetClassification}
			>
				Classifications
			</ToolbarFilterLabel>
			<div className="flex flex-wrap items-center gap-1">
				{POKEMON_CLASSIFICATIONS.map((option) => {
					const isActive = checkClassification(option);
					return (
						<Button
							aria-pressed={isActive}
							className="capitalize"
							key={option}
							onClick={() => toggleClassification(option)}
							size="sm"
							variant={isActive ? "default" : "secondary"}
						>
							{option === "MYTHIC"
								? "Mythical"
								: option.toLowerCase().replace(/_/g, " ")}
						</Button>
					);
				})}
			</div>
		</div>
	);
}
