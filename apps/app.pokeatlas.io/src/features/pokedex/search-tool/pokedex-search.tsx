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
		<InputGroup className="w-full md:max-w-64">
			<InputGroupInput
				defaultValue={initialSearch}
				onChange={(e) => onSearchChange(e.target.value)}
				placeholder="e.g. bulbasaur, +charizard, 025"
				type="search"
			/>
			<InputGroupAddon align="inline-start">
				{isSearchPending ? (
					<Spinner className="text-muted-foreground" />
				) : (
					<MagnifyingGlassIcon className="text-muted-foreground" />
				)}
			</InputGroupAddon>
		</InputGroup>
	);
}
