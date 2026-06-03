"use client";

import { MagnifyingGlassIcon, XCircleIcon } from "@phosphor-icons/react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

import { usePokedexFilter } from "./use-pokedex-filter";

export function PokedexSearchInput() {
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [{ search: keyword }, setFilters] = usePokedexFilter();

	const [search, setSearch] = useState<string>(keyword ?? "");
	const debounceSearch = useDebounceCallback((value: string) => {
		setFilters({ search: value });
	}, 500);

	const clearSearch = () => {
		setSearch("");
		setFilters({ search: "" });
		searchInputRef.current?.focus();
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	useHotkey("Mod+K", () => void searchInputRef.current?.focus());

	return (
		<InputGroup>
			<InputGroupAddon align="inline-start">
				<MagnifyingGlassIcon className="text-muted-foreground" />
			</InputGroupAddon>
			<InputGroupInput
				onChange={handleSearch}
				placeholder="Search..."
				ref={searchInputRef}
				value={search}
			/>
			<InputGroupAddon align="inline-end">
				{search ? (
					<button aria-label="Clear search" onClick={clearSearch} type="button">
						<XCircleIcon className="text-muted-foreground mr-1 opacity-50 hover:opacity-100 transition-opacity duration-100" />
					</button>
				) : (
					<span className="text-xs text-muted-foreground/50 mr-1">(⌘K)</span>
				)}
			</InputGroupAddon>
		</InputGroup>
	);
}
