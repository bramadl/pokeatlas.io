"use client";

import type { PokemonType } from "@pokepulse/core";
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

const DAILY_TARGETS = [
	{
		dex: 25,
		name: "Pikachu Libre",
		signature: "BASE",
		sprite:
			"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm25.fDOCTOR.icon.png",
		types: ["ELECTRIC"],
	},
	{
		dex: 483,
		name: "Aegislash (Blade)",
		signature: "BASE",
		sprite:
			"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm483.fORIGIN.icon.png",
		types: ["GHOST"],
	},
	{
		dex: 681,
		name: "Origin Dialga",
		signature: "BASE",
		sprite:
			"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm681.fBLADE.icon.png",
		types: ["DRAGON"],
	},
	{
		dex: 745,
		name: "Dusk Lycanroc",
		signature: "BASE",
		sprite:
			"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm745.fDUSK.icon.png",
		types: ["ROCK"],
	},
	{
		dex: 376,
		name: "Metagross",
		signature: "SHINY+SHADOW",
		sprite:
			"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm376.icon.png",
		types: ["STEEL"],
	},
	{
		dex: 574,
		name: "Gothita",
		signature: "BASE",
		sprite:
			"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm574.icon.png",
		types: ["PSYCHIC"],
	},
	{
		dex: 888,
		name: "Zacian (Hero)",
		signature: "BASE",
		sprite:
			"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm888.fHERO.icon.png",
		types: ["FAIRY"],
	},
	{
		dex: 890,
		name: "Eternatus (Eternamax)",
		signature: "SHINY+SHADOW",
		sprite:
			"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm890.fETERNAMAX.icon.png",
		types: ["DRAGON"],
	},
];

export function CatchOfTheDay() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Catch of the Day</CardTitle>
				<CardDescription>Missing entries worth chasing today.</CardDescription>
			</CardHeader>
			<CardContent className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
				{DAILY_TARGETS.map((target) => (
					<Tooltip key={target.name}>
						<TooltipTrigger asChild>
							<button
								className={cn(
									"relative flex items-center justify-center p-4 aspect-square rounded-full border shadow",
									"bg-linear-60 from-1% via-background via-50% grayscale-75 opacity-50 hover:opacity-100 transition-all",
									POKEMON_THEME_MAP[
										(target.types[0] as string).toLowerCase() as PokemonType
									].cardBg,
									POKEMON_THEME_MAP[
										(target.types[0] as string).toLowerCase() as PokemonType
									].cardBgOffset,
								)}
								type="button"
							>
								<span
									className={cn(
										"relative p-4 sm:p-6 lg:p-4 rounded-full border shadow bg-slate-100",
										"bg-linear-30 from-1% via-background via-50%",
										POKEMON_THEME_MAP[
											(target.types[0] as string).toLowerCase() as PokemonType
										].cardBg,
										POKEMON_THEME_MAP[
											(target.types[0] as string).toLowerCase() as PokemonType
										].cardBgOffset,
										POKEMON_THEME_MAP[
											(target.types[0] as string).toLowerCase() as PokemonType
										].badgeBorder,
									)}
								>
									<span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1">
										<span className="px-1 py-px text-[10px] rounded-full bg-slate-50 text-slate-500 border border-slate-500/50 shadow drop-shadow-2xl">
											#{String(target.dex).padStart(3, "0")}
										</span>
									</span>
									<Image
										alt={target.name}
										className=""
										height={128}
										priority
										src={target.sprite}
										width={128}
									/>
									<span className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1">
										<span className="aspect-square size-4 text-xs p-px text-center align-middle rounded-full shadow drop-shadow-2xl bg-background">
											✨
										</span>
									</span>
								</span>
							</button>
						</TooltipTrigger>
						<TooltipContent>{target.name}</TooltipContent>
					</Tooltip>
				))}
			</CardContent>
		</Card>
	);
}
