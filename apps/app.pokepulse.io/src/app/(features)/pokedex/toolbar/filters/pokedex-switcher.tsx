"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { POKEDEX_OPTIONS, type PokedexOption } from "@pokepulse/core";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePokedexFilter } from "./use-pokedex-filter";

export function PokedexSwitcher() {
	const [{ pokedex }, setFilters] = usePokedexFilter();
	const setPokedex = (option: PokedexOption) => {
		setFilters((f) => ({ ...f, pokedex: option }));
	};

	const goToPokedex = (pointer: number) => {
		const nextIndex =
			(POKEDEX_OPTIONS.indexOf(pokedex) + pointer + POKEDEX_OPTIONS.length) %
			POKEDEX_OPTIONS.length;

		const next = POKEDEX_OPTIONS[nextIndex];
		if (!next) return;

		setPokedex(next);
	};

	return (
		<div className="w-full flex items-center justify-between gap-4">
			<Button onClick={() => goToPokedex(-1)} size="icon" variant="secondary">
				<CaretLeftIcon />
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="flex-1 font-bold max-w-48" variant="ghost">
						Pokedex:{" "}
						<span className="capitalize text-primary">
							{pokedex.toLowerCase()}
						</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="center">
					<DropdownMenuGroup>
						{POKEDEX_OPTIONS.map((option) => (
							<DropdownMenuItem
								className="capitalize"
								key={option}
								onClick={() => setPokedex(option)}
							>
								{option.toLowerCase()}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<Button onClick={() => goToPokedex(1)} size="icon" variant="secondary">
				<CaretRightIcon />
			</Button>
		</div>
	);
}
