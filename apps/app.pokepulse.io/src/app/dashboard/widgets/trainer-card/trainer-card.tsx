"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";

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

import { progressQueries } from "../../api/progress.query";
import {
	dayGreeting,
	type GreetingContext,
	pickGreeting,
} from "./trainer-greetings";

interface TrainerCardProps {
	trainerEmail: string;
	trainerId: string;
	trainerImage?: string | null;
	trainerName: string;
}

export function TrainerCard({
	trainerEmail,
	trainerId,
	trainerImage,
	trainerName,
}: TrainerCardProps) {
	const { data } = useSuspenseQuery({
		...progressQueries.getSummary({ trainerId }),
		select: (data) => data.summary.speciesCompletion,
	});

	const ctx = useMemo<GreetingContext>(
		() => ({
			missing: data.total - data.tracked,
			percentage: data.completionPercentage,
			tracked: data.tracked,
			trainerName: trainerName.split(" ")[0] as string,
		}),
		[data, trainerName],
	);

	const greeting = useMemo(() => pickGreeting(ctx), [ctx]);

	return (
		<Card className="bg-linear-to-br from-background to-primary/5 border-primary/10 justify-between">
			<CardContent className="flex items-start gap-4">
				<div className="flex-1 flex items-center gap-2">
					<Avatar className="ring ring-primary-foreground" size="default">
						<AvatarImage alt={trainerName} src={trainerImage ?? undefined} />
						<AvatarFallback>
							{trainerName
								.split(" ")
								.map((w) => (w[0] as string).toUpperCase())}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col gap-0">
						<span className="font-bold text-sm">{trainerName}</span>
						<span className="text-xs text-muted-foreground">
							{trainerEmail}
						</span>
					</div>
				</div>
				<Badge className="text-xs">Team Valor</Badge>
			</CardContent>
			<Separator />
			<CardHeader>
				<CardTitle>
					{ctx.percentage >= 100 ? "You did it!" : dayGreeting(ctx)}
				</CardTitle>
				<CardDescription>{greeting}</CardDescription>
			</CardHeader>
			<CardContent className="space-x-2">
				<Button asChild>
					<Link href="/pokedex">Open Pokédex</Link>
				</Button>
				<Button asChild className="hover:bg-primary/5" variant="ghost">
					<Link href="/guides">
						Read User Guides
						<ArrowRightIcon />
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
