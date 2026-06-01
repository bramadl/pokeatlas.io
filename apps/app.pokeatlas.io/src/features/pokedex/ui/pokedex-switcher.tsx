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
import { cn } from "@/lib/utils";

import { dexParser } from "../filters/filter.parsers";
import { getPokedex, POKEDEX_OPTIONS } from "../pokedex.options";

export function PokedexSwitcher({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [dex, setDex] = useQueryState("dex", dexParser);

	const currentIndex = useMemo(() => {
		const index = POKEDEX_OPTIONS.findIndex((o) => o.value === dex);
		return Math.max(0, index);
	}, [dex]);

	const prev = useCallback(() => {
		const index = currentIndex - 1 + POKEDEX_OPTIONS.length;
		setDex(getPokedex(index).value);
	}, [currentIndex, setDex]);

	const next = useCallback(() => {
		const index = currentIndex + 1;
		setDex(getPokedex(index).value);
	}, [currentIndex, setDex]);

	return (
		<div className={cn(className)} {...props}>
			<Button onClick={prev} size="icon" variant="secondary">
				<CaretLeftIcon />
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="font-bold" variant="ghost">
						Pokedex:{" "}
						<span className="text-primary">
							{getPokedex(currentIndex).label}
						</span>
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
