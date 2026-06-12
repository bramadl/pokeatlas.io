"use client";

import { ArrowRightIcon, InfoIcon } from "@phosphor-icons/react";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { pokedexFilterKeys } from "../../../pokedex/toolbar";
import { progressQueries } from "../../api/progress.query";

export function RegionalBreakdown({ trainerId }: { trainerId: string }) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary.regionalCollections,
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Regional Breakdown
					<Tooltip>
						<TooltipTrigger aria-label="Info" className="align-middle ml-1">
							<InfoIcon />
						</TooltipTrigger>
						<TooltipContent>
							<div className="py-2 flex flex-col gap-2">
								<p>
									Only <strong>Base</strong> tracked state pokemons count.
								</p>
								<p>
									Such <em>Shiny</em>, <em>Hundo</em>, <em>Shadow</em>, etc–will
									not be counted.
								</p>
							</div>
						</TooltipContent>
					</Tooltip>
				</CardTitle>
				<CardDescription>Species completion by region.</CardDescription>
			</CardHeader>
			<CardContent className="grid grid-cols-2 lg:grid-cols-5 gap-4">
				{POKEMON_REGIONS.filter((r) => r !== "UNREGISTERED").map((region) => {
					const stat = data[region];
					if (!stat) return null;

					const href = `/pokedex?${pokedexFilterKeys.pokedex}=${POKEDEX_ALIASES[region]}`;
					return (
						<Card
							className="group relative transition-transform hover:scale-105 duration-300"
							key={region}
						>
							<Link
								aria-label="Go to dex"
								className="absolute inset-0 z-1"
								href={href}
							/>
							<CardHeader className="flex items-center justify-between">
								<CardTitle className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
									{region.charAt(0) + region.slice(1).toLowerCase()}
								</CardTitle>
								<ArrowRightIcon
									className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all delay-100"
									size={14}
								/>
							</CardHeader>
							<CardContent>
								<Field>
									<Progress className="h-1" value={stat.completionPercentage} />
									<div className="flex items-end justify-between gap-2 uppercase text-muted-foreground text-[10px] tracking-widest">
										<FieldLabel className="text-[10px]">
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
