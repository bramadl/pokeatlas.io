"use client";

import { MagnifyingGlassIcon, XCircleIcon } from "@phosphor-icons/react";
import { useQueryState } from "nuqs";
import { useState } from "react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

import { searchParser } from "../filter.params";

export function SearchFilter() {
	const [urlSearch, setUrlSearch] = useQueryState("search", searchParser);
	const [localValue, setLocalValue] = useState(urlSearch ?? "");

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setLocalValue(value);
		if (value === "") {
			setUrlSearch(null);
		} else {
			setUrlSearch(value, { scroll: false });
		}
	}

	function handleClear() {
		setLocalValue("");
		setUrlSearch(null);
	}

	return (
		<InputGroup className="w-full">
			<InputGroupAddon align="inline-start">
				<MagnifyingGlassIcon className="text-muted-foreground" />
			</InputGroupAddon>

			<InputGroupInput
				onChange={handleChange}
				placeholder="pikachu, 025, +charizard…"
				value={localValue}
			/>

			<InputGroupAddon align="inline-end">
				{localValue && (
					<button aria-label="Clear search" onClick={handleClear} type="button">
						<XCircleIcon className="text-muted-foreground mr-1 opacity-50 hover:opacity-100 transition-opacity duration-100" />
					</button>
				)}
			</InputGroupAddon>
		</InputGroup>
	);
}
