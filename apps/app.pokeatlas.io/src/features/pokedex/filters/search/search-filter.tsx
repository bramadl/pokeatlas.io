"use client";

import { MagnifyingGlassIcon, XCircleIcon } from "@phosphor-icons/react";
import { useQueryState } from "nuqs";
import { useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

import { searchParser } from "../filter.params";

export function SearchFilter({
	className,
	...props
}: React.ComponentProps<typeof InputGroup>) {
	const [urlSearch, setUrlSearch] = useQueryState("search", searchParser);
	const [localValue, setLocalValue] = useState(urlSearch ?? "");

	const inputRef = useRef<HTMLInputElement>(null);
	useEventListener("keydown", (event) => {
		const isMetaKey = event.metaKey || event.ctrlKey;
		if (isMetaKey && event.key.toLowerCase() === "k") {
			event.preventDefault();
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setLocalValue(value);

		if (value === "") setUrlSearch(null);
		else setUrlSearch(value, { scroll: false });
	}

	function handleClear() {
		setLocalValue("");
		setUrlSearch(null);
		inputRef.current?.focus();
	}

	return (
		<InputGroup className={cn(className)} {...props}>
			<InputGroupAddon align="inline-start">
				<MagnifyingGlassIcon className="text-muted-foreground" />
			</InputGroupAddon>

			<InputGroupInput
				onChange={handleChange}
				placeholder="Search pokemon..."
				ref={inputRef}
				value={localValue}
			/>

			<InputGroupAddon align="inline-end">
				{localValue ? (
					<button aria-label="Clear search" onClick={handleClear} type="button">
						<XCircleIcon className="text-muted-foreground mr-1 opacity-50 hover:opacity-100 transition-opacity duration-100" />
					</button>
				) : (
					<span className="text-xs text-muted-foreground/50 mr-1">(⌘K)</span>
				)}
			</InputGroupAddon>
		</InputGroup>
	);
}
