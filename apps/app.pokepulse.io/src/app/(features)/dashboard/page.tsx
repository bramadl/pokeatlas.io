"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { Fragment } from "react/jsx-runtime";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Container } from "@/components/ui/container";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { POKEMON_THEME_MAP } from "../pokedex/pokemon/card/pokemon-card.theme";

const chartData = [
	{ missing: 80, month: "January", tracked: 186 },
	{ missing: 200, month: "February", tracked: 305 },
	{ missing: 120, month: "March", tracked: 237 },
	{ missing: 190, month: "April", tracked: 73 },
	{ missing: 130, month: "May", tracked: 209 },
	{ missing: 140, month: "June", tracked: 214 },
];

const chartConfig = {
	missing: {
		color: "var(--chart-5)",
		label: "Missing",
	},
	tracked: {
		color: "var(--chart-1)",
		label: "Tracked",
	},
} satisfies ChartConfig;

export default function Dashboard() {
	return (
		<Container
			className="relative min-h-160 sm:my-8 flex flex-col gap-4 py-4 sm:py-0 md:px-4"
			padded
		>
			<div className="grid lg:grid-cols-[400px_1fr] gap-4">
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
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
					<Card>
						<CardHeader className="text-muted-foreground text-xs">
							Shiny Tracked ✨
						</CardHeader>
						<CardContent className="flex items-end justify-between gap-4">
							<div className="text-2xl font-bold">128</div>
							<div className="text-xs">64%</div>
						</CardContent>
						<CardFooter>
							<Progress className="h-1" value={64} />
						</CardFooter>
					</Card>
					<Card>
						<CardHeader className="text-muted-foreground text-xs">
							Shadow Tracked ✨
						</CardHeader>
						<CardContent className="flex items-end justify-between gap-4">
							<div className="text-2xl font-bold">32</div>
							<div className="text-xs">4%</div>
						</CardContent>
						<CardFooter>
							<Progress className="h-1" value={4} />
						</CardFooter>
					</Card>
					<Card>
						<CardHeader className="text-muted-foreground text-xs">
							Purified Tracked ✨
						</CardHeader>
						<CardContent className="flex items-end justify-between gap-4">
							<div className="text-2xl font-bold">44</div>
							<div className="text-xs">8%</div>
						</CardContent>
						<CardFooter>
							<Progress className="h-1" value={8} />
						</CardFooter>
					</Card>
					<Card>
						<CardHeader className="text-muted-foreground text-xs">
							Lucky Tracked ✨
						</CardHeader>
						<CardContent className="flex items-end justify-between gap-4">
							<div className="text-2xl font-bold">54</div>
							<div className="text-xs">11%</div>
						</CardContent>
						<CardFooter>
							<Progress className="h-1" value={11} />
						</CardFooter>
					</Card>
					<Card>
						<CardHeader className="text-muted-foreground text-xs">
							Hundo Tracked ✨
						</CardHeader>
						<CardContent className="flex items-end justify-between gap-4">
							<div className="text-2xl font-bold">32</div>
							<div className="text-xs">6%</div>
						</CardContent>
						<CardFooter>
							<Progress className="h-1" value={6} />
						</CardFooter>
					</Card>
					<Card>
						<CardHeader className="text-muted-foreground text-xs">
							Nundo Tracked ✨
						</CardHeader>
						<CardContent className="flex items-end justify-between gap-4">
							<div className="text-2xl font-bold">0</div>
							<div className="text-xs">0%</div>
						</CardContent>
						<CardFooter>
							<Progress className="h-1" value={0} />
						</CardFooter>
					</Card>
				</div>
			</div>
			<div className="grid lg:grid-cols-2 gap-4">
				<Card>
					<CardHeader>
						<CardTitle>Main Stats</CardTitle>
						<CardDescription>
							Overview of your base species state tracking progress.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<ChartContainer className="min-h-64 w-full" config={chartConfig}>
							<BarChart accessibilityLayer data={chartData}>
								<CartesianGrid vertical={false} />
								<XAxis
									axisLine={false}
									dataKey="month"
									tickFormatter={(value) => value.slice(0, 3)}
									tickLine={false}
									tickMargin={10}
								/>
								<ChartTooltip
									content={<ChartTooltipContent className="rounded-[2px]!" />}
								/>
								<ChartLegend content={<ChartLegendContent />} />
								<Bar dataKey="tracked" fill="var(--color-tracked)" radius={4} />
								<Bar dataKey="missing" fill="var(--color-missing)" radius={4} />
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Variant Scope</CardTitle>
						<CardDescription>
							Define which variants count toward your collection.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex w-full flex-col gap-4">
							{[
								"Base Pokémon",
								"Regional forms",
								"Costume variants",
								"Female variants",
								"Temp. evolutions",
							].map((v, i) => (
								<Fragment key={v}>
									{i !== 0 && <Separator />}
									<dl className="flex items-center justify-between">
										<dt className="flex items-center">
											<p className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
												{v}
											</p>
										</dt>
										<dd className="flex items-center gap-4">
											<Progress className="w-16 h-1" value={64} />
											<p className="text-right text-muted-foreground font-semibold tracking-wider">
												847 / 1,025
											</p>
										</dd>
									</dl>
								</Fragment>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="grid lg:grid-cols-[1fr_360px] gap-4 items-start">
				<div className="flex flex-col gap-4">
					<Card>
						<CardHeader>
							<CardTitle>By Region</CardTitle>
							<CardDescription>
								Quick view of your tracked pokemon by region.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid grid-cols-2 lg:grid-cols-5 gap-4">
							{[
								"Kanto",
								"Johto",
								"Hoenn",
								"Sinnoh",
								"Unova",
								"Kalos",
								"Alola",
								"Galar",
								"Hisui",
								"Paldea",
							].map((r) => (
								<Card className="rounded-sm" key={r}>
									<CardHeader>
										<CardTitle className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
											{r}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Field>
											<div className="flex items-end justify-between gap-4 uppercase text-muted-foreground text-xs tracking-widest">
												<FieldLabel className="text-xs">148/151</FieldLabel>
												{/* <span>98%</span> */}
											</div>
											<Progress className="h-1" value={76} />
										</Field>
									</CardContent>
								</Card>
							))}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Personal Goals</CardTitle>
							<CardDescription>
								Track what you're hunting. Set targets, measure progress.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex w-full flex-col gap-4">
								<dl className="flex items-center justify-between">
									<dt className="flex items-center">
										<div className="flex items-center gap-3">
											<div className="text-3xl">🏆</div>
											<div>
												<p className="font-semibold tracking-wider">
													Complete National Dex
												</p>
												<span className="text-xs text-muted-foreground">
													178 species remaining
												</span>
											</div>
										</div>
									</dt>
									<dd className="text-muted-foreground">
										<div className="text-right">
											<p className="font-semibold tracking-wider">82.6%</p>
											<span className="text-xs text-muted-foreground font-mono">
												847 / 1,025
											</span>
										</div>
									</dd>
								</dl>
								<Separator />
								<dl className="flex items-center justify-between">
									<dt className="flex items-center">
										<div className="flex items-center gap-3">
											<div className="text-3xl">✨</div>
											<div>
												<p className="font-semibold tracking-wider">
													Full Shiny Dex
												</p>
												<span className="text-xs text-muted-foreground">
													713 remaining
												</span>
											</div>
										</div>
									</dt>
									<dd className="text-muted-foreground">
										<div className="text-right">
											<p className="font-semibold tracking-wider">30.4%</p>
											<span className="text-xs text-muted-foreground font-mono">
												312 / 1,025
											</span>
										</div>
									</dd>
								</dl>
								<Separator />
								<dl className="flex items-center justify-between">
									<dt className="flex items-center">
										<div className="flex items-center gap-3">
											<div className="text-3xl">💯</div>
											<div>
												<p className="font-semibold tracking-wider">
													Hundo Hunt
												</p>
												<span className="text-xs text-muted-foreground">
													868 remaining
												</span>
											</div>
										</div>
									</dt>
									<dd className="text-muted-foreground">
										<div className="text-right">
											<p className="font-semibold tracking-wider">15.3%</p>
											<span className="text-xs text-muted-foreground font-mono">
												157 / 1,025
											</span>
										</div>
									</dd>
								</dl>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="flex flex-col-reverse lg:flex-col gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Your Team</CardTitle>
							<CardDescription>Pick your allegiance, Trainer!</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-3 gap-4">
								<div className="flex flex-col items-center justify-center py-2 px-3 bg-red-50 border border-red-500 ring-2 ring-red-500/25 text-red-950 rounded">
									<div className="text-lg">🔥</div>
									<div className="text-xs font-semibold uppercase tracking-widers">
										Valor
									</div>
								</div>
								<div className="flex flex-col items-center justify-center py-2 px-3 bg-blue-50 border border-blue-500/10 text-blue-950 rounded">
									<div className="text-lg">❄️</div>
									<div className="text-xs font-semibold uppercase tracking-widers">
										Mystic
									</div>
								</div>
								<div className="flex flex-col items-center justify-center py-2 px-3 bg-yellow-50 border border-yellow-500/10 text-yellow-950 rounded">
									<div className="text-lg">⚡</div>
									<div className="text-xs font-semibold uppercase tracking-widers">
										Instinct
									</div>
								</div>
							</div>
						</CardContent>
						<Separator />
						<CardFooter>
							<div className="flex items-center gap-2">
								<Avatar className="ring ring-primary-foreground" size="default">
									<AvatarImage alt="Ash Ketchum" src="/pp.jpeg" />
								</Avatar>
								<div className="flex flex-col gap-0">
									<span className="font-bold text-sm">Ash Ketchum</span>
									<span className="text-xs text-muted-foreground">
										ash@pokemon.com • Team Valor
									</span>
								</div>
							</div>
						</CardFooter>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Spotlight Catch</CardTitle>
							<CardDescription>
								Your last valuable tracked state.
							</CardDescription>
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
										<Avatar size="lg">
											<AvatarImage />
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
						<Separator />
						<CardFooter>
							<p className="text-muted-foreground text-xs">Activity logged</p>
							<small className="text-[10px] ml-auto text-muted-foreground">
								5/20/2026, 11:40:52 AM
							</small>
						</CardFooter>
					</Card>
				</div>
			</div>
		</Container>
	);
}
