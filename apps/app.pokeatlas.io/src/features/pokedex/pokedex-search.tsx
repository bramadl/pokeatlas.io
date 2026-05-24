"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

interface PokedexSearchProps {
	initialSearch: string;
	isSearchPending: boolean;
	onSearchChange: (value: string) => void;
}

export function PokedexSearch({
	initialSearch,
	isSearchPending,
	onSearchChange,
}: PokedexSearchProps) {
	return (
		<div className="flex flex-col">
			<p className="text-[11px] text-muted-foreground mb-1 ml-1">
				Use <code className="font-mono">+name</code> to include the full
				evolution family
			</p>
			<InputGroup className="md:max-w-80">
				<InputGroupInput
					defaultValue={initialSearch}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="e.g. bulbasaur, +charizard, 025"
				/>
				<InputGroupAddon align="inline-start">
					{isSearchPending ? (
						<Spinner className="text-muted-foreground" />
					) : (
						<MagnifyingGlassIcon className="text-muted-foreground" />
					)}
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
}
