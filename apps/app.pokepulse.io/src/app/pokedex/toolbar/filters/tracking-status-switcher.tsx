"use client";

import { TRACKING_STATUSES, type TrackingStatus } from "@pokepulse/core";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePokedexFilter } from "./use-pokedex-filter";

export function TrackingStatusSwitcher() {
	const [{ status }, setFilters] = usePokedexFilter();
	const changeStatusTo = (target: TrackingStatus) => {
		setFilters((f) => ({ ...f, status: target }));
	};

	return (
		<Tabs
			className="w-full flex items-center justify-start lg:justify-center gap-4"
			onValueChange={(value) => changeStatusTo(value as TrackingStatus)}
			value={status}
		>
			<TabsList className="w-full lg:w-auto">
				{TRACKING_STATUSES.map((option) => (
					<TabsTrigger
						aria-pressed={option === status}
						className="capitalize"
						key={option}
						value={option}
					>
						{option.toLowerCase()}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
