"use client";

import { useQueryStates } from "nuqs";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { filterParsers } from "../use-filter-params";
import { STATUS_OPTIONS } from "./status.options";

export function StatusFilter() {
	const [{ status }, setFilters] = useQueryStates(filterParsers);
	function toggleStatus(value: string | null) {
		setFilters({ status: status === value ? null : value });
	}

	return (
		<Tabs
			className="flex items-center justify-center"
			defaultValue={status || "all"}
		>
			<TabsList>
				<TabsTrigger
					aria-pressed={status === "all"}
					onClick={() => toggleStatus(null)}
					value={"all"}
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
