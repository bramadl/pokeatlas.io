"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { dexParser } from "../filters/filter.params";
import { DEX_OPTIONS } from "./dex.options";

function getDexAt(index: number) {
	const item = DEX_OPTIONS.at(index % DEX_OPTIONS.length);
	if (!item) throw new Error("DEX_OPTIONS is empty");
	return item;
}

export function DexSwitcher() {
	const [dex, setDex] = useQueryState("dex", dexParser);

	const currentIndex = Math.max(
		0,
		DEX_OPTIONS.findIndex((o) => o.value === dex),
	);

	const current = getDexAt(currentIndex);

	function prev() {
		setDex(getDexAt(currentIndex - 1 + DEX_OPTIONS.length).value);
	}

	function next() {
		setDex(getDexAt(currentIndex + 1).value);
	}

	return (
		<div className="w-full flex items-center justify-between gap-4">
			<Button onClick={prev} size="icon" variant="secondary">
				<CaretLeftIcon />
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="font-bold" variant="ghost">
						{current.label} Dex
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						{DEX_OPTIONS.map(({ label, value }) => (
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
