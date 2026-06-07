"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { POKEDEX_ALIASES, POKEMON_REGIONS } from "@pokepulse/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";

import { pokedexFilterKeys } from "../../pokedex/toolbar";
import { progressQueries } from "../progress.query";

export function RegionalBreakdown({ trainerId }: { trainerId: string }) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary.regionalCollections,
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Regional Breakdown</CardTitle>
				<CardDescription>Species completion by region.</CardDescription>
			</CardHeader>
			<CardContent className="grid grid-cols-2 lg:grid-cols-5 gap-4">
				{POKEMON_REGIONS.filter((r) => r !== "UNREGISTERED").map((region) => {
					const stat = data[region];
					if (!stat) return null;

					const href = `/pokedex?${pokedexFilterKeys.pokedex}=${POKEDEX_ALIASES[region]}`;
					return (
						<Card className="rounded-sm" key={region}>
							<CardHeader className="flex items-center justify-between">
								<CardTitle className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
									{region.charAt(0) + region.slice(1).toLowerCase()}
								</CardTitle>
								<Link aria-label="Go to dex" href={href}>
									<ArrowRightIcon size={12} />
								</Link>
							</CardHeader>
							<CardContent>
								<Field>
									<Progress className="h-1" value={stat.completionPercentage} />
									<div className="flex items-end justify-between gap-4 uppercase text-muted-foreground text-xs tracking-widest">
										<FieldLabel className="text-xs">
											{stat.tracked}/{stat.total}
										</FieldLabel>
										<span>{stat.completionPercentage.toFixed(0)}%</span>
									</div>
								</Field>
							</CardContent>
						</Card>
					);
				})}
			</CardContent>
		</Card>
	);
}
