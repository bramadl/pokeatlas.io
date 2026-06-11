"use client";

import type { PokemonType } from "@pokepulse/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { POKEMON_THEME_MAP } from "../../pokedex/pokemon/card/pokemon-card.theme";
import { progressQueries } from "../progress.query";

export function CatchOfTheDay({
	date,
	trainerId,
}: {
	date: string;
	trainerId: string;
}) {
	const { data } = useSuspenseQuery(
		progressQueries.catchOfTheDay({ date, trainerId }),
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Catch of the Day</CardTitle>
				<CardDescription>Missing entries worth chasing today.</CardDescription>
			</CardHeader>
			<CardContent className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 place-items-center gap-4">
				{data.entries.map((entry) => {
					return (
						<Tooltip key={entry.pokemonRef}>
							<TooltipTrigger asChild>
								<button
									className={cn(
										"relative flex items-center justify-center p-4 max-w-24 size-full aspect-square rounded-full border shadow",
										"bg-linear-60 from-1% via-background via-50% grayscale-75 opacity-50 hover:opacity-100 transition-all",
										POKEMON_THEME_MAP[
											entry.primaryType.toLowerCase() as PokemonType
										].cardBg,
										POKEMON_THEME_MAP[
											entry.primaryType.toLowerCase() as PokemonType
										].cardBgOffset,
									)}
									type="button"
								>
									<span
										className={cn(
											"relative p-4 rounded-full border shadow bg-slate-100",
											"bg-linear-30 from-1% via-background via-50%",
											POKEMON_THEME_MAP[
												entry.primaryType.toLowerCase() as PokemonType
											].cardBg,
											POKEMON_THEME_MAP[
												entry.primaryType.toLowerCase() as PokemonType
											].cardBgOffset,
											POKEMON_THEME_MAP[
												entry.primaryType.toLowerCase() as PokemonType
											].badgeBorder,
										)}
									>
										<span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1">
											<span className="px-1 py-px text-[10px] rounded-full bg-slate-50 text-slate-500 border border-slate-500/50 shadow drop-shadow-2xl">
												#{String(entry.dexNumber).padStart(3, "0")}
											</span>
										</span>
										<Image
											alt={entry.name}
											height={128}
											priority
											src={
												entry.targetSignature === "SHINY" && entry.shinySprite
													? entry.shinySprite
													: entry.sprite
											}
											width={128}
										/>
										{entry.targetSignature === "SHINY" && (
											<span className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1">
												<span className="aspect-square size-4 text-xs p-px text-center align-middle rounded-full shadow drop-shadow-2xl bg-background">
													✨
												</span>
											</span>
										)}
									</span>
								</button>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{entry.targetSignature !== "BASE" && (
										<span className="capitalize">
											({entry.targetSignature.toLowerCase()}){" "}
										</span>
									)}
									{entry.name}
								</p>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</CardContent>
		</Card>
	);
}
