"use client";

import { TrophyIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { progressQueries } from "../../api/progress.query";
import { EmptyWidget } from "../empty-widget";
import { ACHIEVEMENT_COLOR_MAP, ACHIEVEMENT_META } from "./achievement-utils";

interface CompletionAchievementsProps {
	maxAchievements?: number;
	trainerId: string;
}

export function CompletionAchievements({
	maxAchievements = 3,
	trainerId,
}: CompletionAchievementsProps) {
	const { data } = useSuspenseQuery(progressQueries.getSummary({ trainerId }));

	const achievementCount = data.summary.achievements.length;
	const achievements = [...data.summary.achievements].splice(
		0,
		maxAchievements,
	);

	if (achievements.length === 0) {
		return (
			<EmptyWidget
				description="Track your first Pokémon, complete a regional dex, or catch your first Shiny to unlock achievements."
				Icon={TrophyIcon}
				title="No achievements yet"
			/>
		);
	}

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<CardTitle>Achievements</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4">
					{achievements.map((achievement) => {
						const meta = ACHIEVEMENT_META[achievement.type];
						const colors = meta
							? ACHIEVEMENT_COLOR_MAP[meta.color]
							: ACHIEVEMENT_COLOR_MAP.indigo;

						return (
							<Card className={colors?.card} key={achievement.type}>
								<CardContent className="flex items-center gap-4">
									<div
										className={cn(
											"flex items-center justify-center rounded-full p-2 shadow border ring-2 size-8",
											colors?.badge,
										)}
									>
										{meta?.icon}
									</div>
									<div>
										<div className={colors?.text}>{meta?.label}</div>
										<p className={cn("text-xs", colors?.sub)}>
											{achievement.achievedAt.toLocaleDateString("en-GB", {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
										</p>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</CardContent>
				{achievementCount > maxAchievements && (
					<Fragment>
						<Separator />
						<CardFooter className="relative z-1">
							<Button asChild className="w-full" size="sm" variant="outline">
								<Link href="/account/profile">View Your Achievements</Link>
							</Button>
						</CardFooter>
					</Fragment>
				)}
			</Card>
		</Fragment>
	);
}
