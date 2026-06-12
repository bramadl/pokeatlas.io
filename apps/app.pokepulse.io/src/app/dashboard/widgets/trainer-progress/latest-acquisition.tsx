"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import {
	POKEDEX_ALIASES,
	type PokemonType,
	type TrackingSignatureRef,
} from "@pokepulse/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { POKEMON_THEME_MAP } from "../../../pokedex/pokemon/card/pokemon-card.theme";
import { pokedexFilterKeys } from "../../../pokedex/toolbar";
import { progressQueries } from "../../api/progress.query";
import { EmptyWidget } from "../empty-widget";

const STATE_EMOJI: Record<string, string> = {
	BASE: "⭐",
	HUNDO: "💯",
	LUCKY: "🍀",
	NUNDO: "🔴",
	PURIFIED: "💫",
	SHADOW: "🌑",
	SHINY: "✨",
};

const DISPLAY_STATE_ORDER = [
	"SHINY",
	"SHADOW",
	"PURIFIED",
	"LUCKY",
	"HUNDO",
	"NUNDO",
];

export function LatestAcquisition({ trainerId }: { trainerId: string }) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary.latestAcquisition,
	});

	if (!data) {
		return (
			<EmptyWidget
				description="Track your first Pokémon and it'll appear here."
				Icon={MagnifyingGlassIcon}
				title="No catches yet"
				withAction={{
					href: "/pokedex",
					label: "Open Pokédex",
				}}
			/>
		);
	}

	const primaryType = data.types[0]?.toLowerCase() as PokemonType | undefined;
	const theme = primaryType
		? POKEMON_THEME_MAP[primaryType]
		: POKEMON_THEME_MAP.normal;

	const displayStates = DISPLAY_STATE_ORDER.filter((s) =>
		data.trackedStates.includes(s as TrackingSignatureRef),
	);

	const timestamp = new Intl.DateTimeFormat("en-US", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(data.timestamp));

	return (
		<Card
			className={cn(
				"relative transition-all duration-300",
				data.status === "UNTRACKED" && "grayscale-50",
			)}
		>
			<CardHeader className="flex items-center justify-between gap-4">
				<CardTitle>Latest Acquisition</CardTitle>
				<small className="text-xs ml-auto text-muted-foreground">
					{timestamp}
				</small>
			</CardHeader>
			<CardContent>
				<Card className="relative rounded-sm">
					<Link
						aria-label="View in pokedex"
						className="absolute inset-0 z-2"
						href={`/pokedex?q=${data.dexNumber}&${pokedexFilterKeys.pokedex}=${POKEDEX_ALIASES[data.region as keyof typeof POKEDEX_ALIASES]}`}
					/>
					<div
						className={cn(
							"absolute inset-0 bg-linear-30 from-25% via-background via-75% opacity-50",
							theme.cardBg,
							theme.cardBgOffset,
						)}
					/>
					<CardContent className="relative z-1 flex items-start justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="bg-slate-50" size="lg">
								<AvatarImage src={data.sprite ?? undefined} />
								<AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<div className="text-xs font-mono">
										#{data.dexNumber.toString().padStart(3, "0")}
									</div>
									<div className="text-muted-foreground text-[8px] opacity-50">
										•
									</div>
									<div className="text-xs font-mono uppercase">
										{data.region.charAt(0) + data.region.slice(1).toLowerCase()}
									</div>
								</div>
								<p className="font-semibold">{data.name}</p>
							</div>
						</div>
						{data.status !== "TRACKED" && (
							<Badge variant="secondary">{data.status}</Badge>
						)}
					</CardContent>
					{displayStates.length > 0 && (
						<>
							<Separator />
							<CardFooter className="relative z-1">
								<div className="text-xs font-mono rounded-full px-1">
									{displayStates
										.map(
											(s) =>
												`${STATE_EMOJI[s]} ${s.charAt(0) + s.slice(1).toLowerCase()}`,
										)
										.join(" ")}
								</div>
							</CardFooter>
						</>
					)}
				</Card>
			</CardContent>
		</Card>
	);
}
