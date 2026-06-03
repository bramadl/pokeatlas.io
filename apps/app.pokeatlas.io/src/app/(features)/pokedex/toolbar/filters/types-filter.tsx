"use client";

import { POKEMON_TYPES, type PokemonType } from "@pokeatlas/core";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { ToolbarFilterLabel } from "./toolbar-filter-label";
import { usePokedexFilter } from "./use-pokedex-filter";

export function TypesFilter() {
	const [{ types }, setFilters] = usePokedexFilter();
	const hasTypes = types.length > 0;
	const selectedTypesCount = types.length;

	const resetTypes = () => void setFilters({ types: null });
	const checkTypes = (type: PokemonType) => types.includes(type);

	const toggleTypes = (type: PokemonType) => {
		setFilters((f) => {
			return {
				...f,
				types: checkTypes(type)
					? f.types.filter((t) => t !== type)
					: [...f.types, type],
			};
		});
	};

	return (
		<div>
			<ToolbarFilterLabel hasClear={hasTypes} onClear={resetTypes}>
				Types
				{hasTypes && (
					<span className="ml-1 text-muted-foreground/50 normal-case font-normal tracking-normal">
						({selectedTypesCount}/2)
					</span>
				)}
			</ToolbarFilterLabel>
			<div className="grid grid-cols-9 gap-1">
				{POKEMON_TYPES.map((type) => {
					const isActive = checkTypes(type);
					const isDisabled = (selectedTypesCount ?? 0) >= 2 && !isActive;

					return (
						<Button
							aria-label={type}
							aria-pressed={isActive}
							className="px-1 md:px-3"
							disabled={isDisabled}
							key={type}
							onClick={() => toggleTypes(type)}
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
