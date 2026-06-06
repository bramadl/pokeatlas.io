"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import type { PokemonType } from "@pokepulse/core";
import Image from "next/image";
import { Fragment } from "react/jsx-runtime";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { POKEMON_THEME_MAP } from "../pokedex/pokemon/card/pokemon-card.theme";

function CompletionAchievements() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Completion Achievements</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Card className="border-green-300 bg-green-50 text-green-500">
					<CardContent className="flex items-center gap-4">
						<div className="flex items-center justify-center rounded-full p-2 shadow border border-green-500 ring-2 ring-green-500/25 bg-green-100 size-8">
							🌎
						</div>
						<div className="flex items-center gap-4">
							<div>
								<div>Kanto Dex Completed</div>
								<p className="text-green-400 text-xs">
									Completed: 23 February 2026
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border-indigo-300 bg-indigo-50 text-indigo-500">
					<CardContent className="flex items-center gap-4">
						<div className="flex items-center justify-center rounded-full p-2 shadow border border-indigo-500 ring-2 ring-indigo-500/25 bg-indigo-100 size-8">
							🧬
						</div>
						<div className="flex items-center gap-4">
							<div>
								<div>Costume Completed</div>
								<p className="text-indigo-400 text-xs">
									Completed: 23 February 2026
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border-sky-300 bg-sky-50 text-sky-500">
					<CardContent className="flex items-center gap-4">
						<div className="flex items-center justify-center rounded-full p-2 shadow border border-sky-500 ring-2 ring-sky-500/25 bg-sky-100 size-8">
							✨
						</div>
						<div className="flex items-center gap-4">
							<div>
								<div>Shadow Dex Completed</div>
								<p className="text-sky-400 text-xs">
									Completed: 23 February 2026
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border-indigo-300 bg-indigo-50 text-indigo-500">
					<CardContent className="flex items-center gap-4">
						<div className="flex items-center justify-center rounded-full p-2 shadow border border-indigo-500 ring-2 ring-indigo-500/25 bg-indigo-100 size-8">
							🧬
						</div>
						<div className="flex items-center gap-4">
							<div>
								<div>Temp. Evolution Completed</div>
								<p className="text-indigo-400 text-xs">
									Completed: 23 February 2026
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
}

function LatestAcquisition() {
	return (
		<Card>
			<CardHeader className="flex items-center justify-between gap-4">
				<CardTitle>Latest Acquisition</CardTitle>
				<small className="text-xs ml-auto text-muted-foreground">
					5/20/2026, 11:40:52 AM
				</small>
			</CardHeader>
			<CardContent>
				<Card className="relative rounded-sm">
					<div
						className={cn(
							"absolute inset-0 bg-linear-30 from-25% via-background via-75% opacity-50",
							POKEMON_THEME_MAP.water.cardBg,
							POKEMON_THEME_MAP.water.cardBgOffset,
						)}
					/>
					<CardContent className="relative z-1">
						<div className="flex items-center gap-4">
							<Avatar className="bg-slate-50" size="lg">
								<AvatarImage
									src={
										"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm130.icon.png"
									}
								/>
								<AvatarFallback>G</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<div className="text-xs font-mono">#130</div>
									<div className="text-muted-foreground text-[8px] opacity-50">
										•
									</div>
									<div className="text-xs font-mono uppercase">Kanto</div>
								</div>
								<p className="font-semibold">Gyarados</p>
							</div>
						</div>
					</CardContent>
					<Separator />
					<CardFooter className="relative z-1">
						<div className="text-xs font-mono rounded-full px-1">
							✨ Shiny 🌑 Shadow
						</div>
					</CardFooter>
				</Card>
			</CardContent>
			{/* <Separator />
      <CardFooter>
        <p className="text-muted-foreground text-xs">Activity logged</p>
        <small className="text-xs ml-auto text-muted-foreground">
          5/20/2026, 11:40:52 AM
        </small>
      </CardFooter> */}
		</Card>
	);
}

function CollectionInsights() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Collection Insights</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<p>Kanto is your most complete region</p>
					<p className="text-muted-foreground text-xs">98% completed</p>
				</div>
				<Separator />
				<div>
					<p>Only 4 Temporary Evolutions remain</p>
					<p className="text-muted-foreground text-xs">
						Closest collection to completion
					</p>
				</div>
				<Separator />
				<div>
					<p>Lucky Dex is your largest collection</p>
					<p className="text-muted-foreground text-xs">522 entries tracked</p>
				</div>
				<Separator />
				<div>
					<p>Shadow Dex grew by 12 entries this month</p>
					<p className="text-muted-foreground text-xs">
						Fastest growing collection
					</p>
				</div>
				<Separator />
				<div>
					<p>Female Variants are 10 away from completion</p>
					<p className="text-muted-foreground text-xs">
						Closest variant category
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

function RegionalBreakdown() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Regional Breakdown</CardTitle>
				<CardDescription>Species completion by region.</CardDescription>
			</CardHeader>
			<CardContent className="grid grid-cols-2 lg:grid-cols-5 gap-4">
				{[
					["Kanto", 148, 151],
					["Johto", 97, 100],
					["Hoenn", 113, 135],
					["Sinnoh", 93, 107],
					["Unova", 121, 156],
					["Kalos", 58, 72],
					["Alola", 74, 88],
					["Galar", 71, 89],
					["Hisui", 28, 30],
					["Paldea", 91, 120],
				].map(([region, current, total]) => (
					<Card className="rounded-sm" key={region}>
						<CardHeader>
							<CardTitle className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
								{region}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Field>
								<Progress
									className="h-1"
									value={(Number(current) / Number(total)) * 100}
								/>
								<div className="flex items-end justify-between gap-4 uppercase text-muted-foreground text-xs tracking-widest">
									<FieldLabel className="text-xs">
										{" "}
										{current}/{total}
									</FieldLabel>
									<span>
										{((Number(current) / Number(total)) * 100).toFixed(0)}%
									</span>
								</div>
							</Field>
						</CardContent>
					</Card>
				))}
			</CardContent>
		</Card>
	);
}

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

function CatchOfTheDay() {
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
							<div
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
							>
								<button
									aria-label="Tap to Track"
									className="absolute inset-0 z-1"
									type="button"
								/>
								<div
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
									<div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1">
										<div className="px-1 py-px text-[10px] rounded-full bg-slate-50 text-slate-500 border border-slate-500/50 shadow drop-shadow-2xl">
											#{Intl.NumberFormat().format(target.dex)}
										</div>
									</div>
									<Image
										alt={target.name}
										className=""
										height={128}
										priority
										src={target.sprite}
										width={128}
									/>
									<div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1">
										<div className="aspect-square size-4 text-xs p-px text-center align-middle rounded-full shadow drop-shadow-2xl bg-background">
											✨
										</div>
									</div>
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent>{target.name}</TooltipContent>
					</Tooltip>
				))}
			</CardContent>
		</Card>
	);
}

const VARIANT_COLLECTIONS = [
	{
		current: 190,
		label: "Alternate Forms",
		total: 243,
	},
	{
		current: 78,
		label: "Costume Variants",
		total: 332,
	},
	{
		current: 51,
		label: "Female Variants",
		total: 104,
	},
	{
		current: 32,
		label: "Temporary Evolutions",
		total: 50,
	},
];

function VariantCollections() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Variant Collections</CardTitle>
				<CardDescription>Progress beyond species completion.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{VARIANT_COLLECTIONS.map((variant, index) => (
					<Fragment key={variant.label}>
						{index !== 0 && <Separator />}
						<dl className="flex items-center justify-between">
							<dt className="flex items-center">
								<p>{variant.label}</p>
							</dt>
							<dd className="flex items-center gap-4">
								<Progress
									className="w-12 lg:w-24 h-1"
									value={(variant.current / variant.total) * 100}
								/>
								<p className="min-w-16 text-right text-xs text-muted-foreground font-semibold tracking-wider">
									{variant.current} / {variant.total}
								</p>
							</dd>
						</dl>
					</Fragment>
				))}
			</CardContent>
		</Card>
	);
}

const TRACKING_COLLECTIONS = [
	{
		current: 312,
		icon: "✨",
		label: "Shiny Dex",
		total: 1025,
	},
	{
		current: 44,
		icon: "🌑",
		label: "Shadow Dex",
		total: 1025,
	},
	{
		current: 87,
		icon: "💫",
		label: "Purified Dex",
		total: 1025,
	},
	{
		current: 522,
		icon: "🍀",
		label: "Lucky Dex",
		total: 1025,
	},
	{
		current: 157,
		icon: "💯",
		label: "Hundo Dex",
		total: 1025,
	},
	{
		current: 4,
		icon: "�",
		label: "Nundo Dex",
		total: 1025,
	},
];

function TrackingCollections() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Tracking Collections</CardTitle>
				<CardDescription>
					Collection progress across tracking states.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
				{TRACKING_COLLECTIONS.map((collection) => {
					const percent = (collection.current / collection.total) * 100;
					return (
						<Card key={collection.label}>
							<CardHeader>
								<CardTitle className="text-sm">
									{collection.icon} {collection.label}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex justify-between">
									<div>
										<div className="text-2xl font-bold">
											{collection.current}
										</div>
										<div className="text-xs text-muted-foreground">
											of {collection.total}
										</div>
									</div>
									<div className="text-sm font-medium">
										{percent.toFixed(1)}%
									</div>
								</div>
							</CardContent>
							<CardFooter>
								<Progress className="h-1" value={percent} />
							</CardFooter>
						</Card>
					);
				})}
			</CardContent>
		</Card>
	);
}

function SpeciesCompletionHero() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Species Completion</CardTitle>
				<CardDescription>Your overall National Dex progress.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-16">
				<div className="flex items-end gap-3 shrink-0">
					<div className="text-6xl font-bold">847</div>
					<div className="mb-1 text-muted-foreground">of 1,025 species</div>
				</div>
				<div className="flex-1 mb-2">
					<Field>
						<div className="flex items-end justify-between gap-4 text-muted-foreground text-xs">
							<FieldLabel className="text-muted-foreground text-xs font-normal">
								Completion
							</FieldLabel>
							<span>82.6%</span>
						</div>
						<Progress className="h-2" value={82.6} />
					</Field>
				</div>
			</CardContent>
			<Separator />
			<CardFooter className="flex flex-col gap-2">
				<div className="w-full flex items-center justify-between gap-4">
					<div>
						<div className="text-xs text-muted-foreground">Tracked</div>
						<div className="font-semibold">986 Species</div>
					</div>
					<div>
						<div className="text-xs text-muted-foreground">Missing</div>
						<div className="font-semibold">178 Species</div>
					</div>
					<div>
						<div className="text-xs text-muted-foreground">
							Most Complete Region
						</div>
						<div className="font-semibold">Kanto · 98%</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}

function TrainerCard() {
	return (
		<Card className="bg-linear-to-br from-background to-primary/5 border-primary/10 justify-between">
			<CardContent className="flex items-start gap-4">
				<div className="flex-1 flex items-center gap-2">
					<Avatar className="ring ring-primary-foreground" size="default">
						<AvatarImage alt="Ash Ketchum" src="/pp.jpeg" />
					</Avatar>
					<div className="flex flex-col gap-0">
						<span className="font-bold text-sm">Ash Ketchum</span>
						<span className="text-xs text-muted-foreground">
							ash@pokemon.com
						</span>
					</div>
				</div>
				<Badge className="text-xs">Team Valor</Badge>
			</CardContent>
			<Separator />
			<CardHeader>
				<CardTitle>Welcome Back!</CardTitle>
				<CardDescription>
					Pick up where you left off, you are <strong>87%</strong> away from
					total completion! Keep it going, Trainer.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-x-2">
				<Button>View Pokédex</Button>
				<Button className="hover:bg-primary/5" variant="ghost">
					Open User Guides
					<ArrowRightIcon />
				</Button>
			</CardContent>
		</Card>
	);
}

export default function Dashboard() {
	return (
		<Container
			className="relative min-h-160 sm:my-8 flex flex-col gap-4 py-4 sm:py-0 md:px-4"
			padded
		>
			<div className="grid lg:grid-cols-[400px_1fr] gap-4">
				<TrainerCard />
				<SpeciesCompletionHero />
			</div>
			<CatchOfTheDay />
			<div className="grid lg:grid-cols-[1fr_360px] gap-4">
				<div className="flex flex-col gap-4">
					<TrackingCollections />
					<VariantCollections />
					<RegionalBreakdown />
				</div>
				<div className="flex flex-col gap-4">
					<CompletionAchievements />
					<CollectionInsights />
					<LatestAcquisition />
				</div>
			</div>
		</Container>
	);
}
