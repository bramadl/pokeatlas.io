"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProgressBar } from "@/hooks/use-progress-bar";
import { progressQueries } from "../progress.query";

type GreetingContext = {
	tracked: number;
	missing: number;
	percentage: number;
};

type GreetingTier = {
	max: number;
	pool: ((ctx: GreetingContext) => string)[];
};

const GREETING_TIERS: GreetingTier[] = [
	{
		max: 1,
		pool: [
			() =>
				"Your journey begins! Every legend starts with a single Pokémon. Go catch 'em all!",
			() =>
				"A new adventure awaits! The world is full of Pokémon waiting to be discovered.",
			() =>
				"Welcome, Trainer! Your Pokédex is empty — for now. Let the hunt begin.",
			() =>
				"The path to becoming a Pokémon Master starts with your very first catch. Ready?",
		],
	},
	{
		max: 26,
		pool: [
			({ tracked }) =>
				`${tracked} species and counting! You're just warming up, Trainer.`,
			({ missing }) =>
				`Still ${missing} species out there. The wild is calling!`,
			({ tracked }) =>
				`${tracked} down, a whole world to go. Every catch counts!`,
			() => "Early days, but every master had to start somewhere. Keep it up!",
		],
	},
	{
		max: 51,
		pool: [
			({ percentage }) =>
				`${percentage.toFixed(0)}% done — you're finding your rhythm, Trainer!`,
			({ tracked }) => `${tracked} species! The Pokédex is filling up nicely.`,
			({ missing }) => `${missing} species left to hunt. You've got this.`,
			() =>
				"Quarter of the way there! The rarest ones are still out there waiting.",
		],
	},
	{
		max: 76,
		pool: [
			({ percentage }) =>
				`${percentage.toFixed(0)}% complete — you're past the halfway mark! Impressive.`,
			({ tracked, missing }) =>
				`${tracked} caught, ${missing} to go. The grind is real and so are you.`,
			() =>
				"More than half the Pokédex conquered. The legendaries are calling your name.",
			() =>
				"You're deep in the dex now. Regionals, shinies, shadows — bring it on!",
		],
	},
	{
		max: 100,
		pool: [
			({ missing }) =>
				`Only ${missing} species left! You can smell the finish line, Trainer.`,
			({ percentage }) =>
				`${percentage.toFixed(0)}% — you're in the endgame now. No turning back!`,
			({ tracked }) =>
				`${tracked} species! The final stretch is the hardest. Push through!`,
			() =>
				"So close to completing the National Dex. Legends are made in moments like these.",
		],
	},
	{
		max: Number.POSITIVE_INFINITY,
		pool: [
			() => "National Dex complete. You are a true Pokémon Master. 🏆",
			() =>
				"Every species caught. Every region conquered. You're a living legend.",
			() => "Gotta catch 'em all? Done. What's next, Trainer?",
			() => "The Pokédex is complete. Professor Oak is in tears. You did it.",
		],
	},
];

function pickGreeting(ctx: GreetingContext): string {
	const tier =
		GREETING_TIERS.find((t) => ctx.percentage < t.max) ?? GREETING_TIERS.at(-1);

	if (!tier) throw new Error("No greeting tier found");
	const pick = tier.pool[Math.floor(Math.random() * tier.pool.length)];

	if (!pick) throw new Error("No greeting pick found");
	return pick(ctx);
}

export function TrainerCard({ trainerId }: { trainerId: string }) {
	const { data, isFetching } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary.speciesCompletion,
	});

	const ctx: GreetingContext = {
		missing: data.total - data.tracked,
		percentage: data.completionPercentage,
		tracked: data.tracked,
	};

	const greeting = pickGreeting(ctx);
	useProgressBar({ show: { when: isFetching } });

	return (
		<Card className="bg-linear-to-br from-background to-primary/5 border-primary/10 justify-between">
			<CardContent className="flex items-start gap-4">
				<div className="flex-1 flex items-center gap-2">
					<Avatar className="ring ring-primary-foreground" size="default">
						<AvatarImage alt="Ash Ketchum" src="/pp.jpeg" />
						<AvatarFallback>A</AvatarFallback>
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
				<CardTitle>
					{ctx.percentage >= 100
						? "You did it!"
						: ctx.tracked === 0
							? "Welcome, Trainer!"
							: "Welcome Back!"}
				</CardTitle>
				<CardDescription>{greeting}</CardDescription>
			</CardHeader>
			<CardContent className="space-x-2">
				<Button>Open Pokédex</Button>
				<Button className="hover:bg-primary/5" variant="ghost">
					Read User Guides
					<ArrowRightIcon />
				</Button>
			</CardContent>
		</Card>
	);
}
