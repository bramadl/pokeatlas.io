"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { dexParser } from "../filters/filter.params";
import { POKEDEX_OPTIONS } from "./dex.options";

export function DexSwitcher() {
	const [dex, setDex] = useQueryState("dex", dexParser);

	const currentIndex = useMemo(() => {
		const index = POKEDEX_OPTIONS.findIndex((o) => o.value === dex);
		return Math.max(0, index);
	}, [dex]);

	const getDexAt = useCallback((index: number) => {
		const item = POKEDEX_OPTIONS.at(index % POKEDEX_OPTIONS.length);
		if (!item) throw new Error("POKEDEX_OPTIONS is empty");
		return item;
	}, []);

	const currentDex = useMemo(() => {
		return getDexAt(currentIndex);
	}, [getDexAt, currentIndex]);

	const prev = useCallback(
		function prev() {
			const index = currentIndex - 1 + POKEDEX_OPTIONS.length;
			setDex(getDexAt(index).value);
		},
		[currentIndex, getDexAt, setDex],
	);

	const next = useCallback(
		function next() {
			const index = currentIndex + 1;
			setDex(getDexAt(index).value);
		},
		[currentIndex, getDexAt, setDex],
	);

	return (
		<div className="w-full flex items-center justify-between gap-4">
			<Button onClick={prev} size="icon" variant="secondary">
				<CaretLeftIcon />
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="font-bold" variant="ghost">
						{currentDex.label} Dex
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						{POKEDEX_OPTIONS.map(({ label, value }) => (
							<DropdownMenuItem key={value} onClick={() => setDex(value)}>
								{label}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<Button onClick={next} size="icon" variant="secondary">
				<CaretRightIcon />
			</Button>
		</div>
	);
}
