"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

interface PokedexToolbarProps {
	initialSearch: string;
	onSearchChange: (value: string) => void;
}

export function PokedexToolbar({
	initialSearch,
	onSearchChange,
}: PokedexToolbarProps) {
	return (
		<header className="sticky top-16 z-10 bg-white shadow p-4">
			<InputGroup className="max-w-80">
				<InputGroupInput
					defaultValue={initialSearch}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search by dex number or name"
				/>
				<InputGroupAddon align="inline-start">
					<MagnifyingGlassIcon className="text-muted-foreground" />
				</InputGroupAddon>
			</InputGroup>
		</header>
	);
}
