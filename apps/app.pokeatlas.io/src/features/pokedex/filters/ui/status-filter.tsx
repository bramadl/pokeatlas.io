"use client";

import { useQueryStates } from "nuqs";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { STATUS_OPTIONS } from "../filter.options";
import { filterParsers } from "../filter.parsers";

const DEFAULT_VALUE = "all";

export function StatusFilter({
	className,
	...props
}: React.ComponentProps<typeof Tabs>) {
	const [{ status }, setFilters] = useQueryStates(filterParsers);
	function toggleStatus(value: string | null) {
		if (value === status || value === DEFAULT_VALUE) return;
		setFilters({ status: status === value ? null : value });
	}

	return (
		<Tabs
			className={cn(className)}
			defaultValue={status || DEFAULT_VALUE}
			{...props}
		>
			<TabsList className="w-full lg:w-auto">
				<TabsTrigger
					aria-pressed={status === DEFAULT_VALUE}
					onClick={() => toggleStatus(null)}
					value={DEFAULT_VALUE}
				>
					All
				</TabsTrigger>
				{STATUS_OPTIONS.map(({ label, value }) => (
					<TabsTrigger
						aria-pressed={status === value}
						key={value}
						onClick={() => toggleStatus(value)}
						value={value}
					>
						{label}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
