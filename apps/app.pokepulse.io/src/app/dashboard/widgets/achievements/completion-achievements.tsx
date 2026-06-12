"use client";

import { TrophyIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment } from "react/jsx-runtime";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { progressQueries } from "../../api/progress.query";
import { ACHIEVEMENT_META } from "./achievement-meta";

const COLOR_MAP: Record<
	string,
	{ badge: string; card: string; text: string; sub: string }
> = {
	amber: {
		badge: "border-amber-500 ring-amber-500/25 bg-amber-100",
		card: "border-amber-300 bg-amber-50 text-amber-500",
		sub: "text-amber-400",
		text: "text-amber-500",
	},
	green: {
		badge: "border-green-500 ring-green-500/25 bg-green-100",
		card: "border-green-300 bg-green-50 text-green-500",
		sub: "text-green-400",
		text: "text-green-500",
	},
	indigo: {
		badge: "border-indigo-500 ring-indigo-500/25 bg-indigo-100",
		card: "border-indigo-300 bg-indigo-50 text-indigo-500",
		sub: "text-indigo-400",
		text: "text-indigo-500",
	},
	pink: {
		badge: "border-pink-500 ring-pink-500/25 bg-pink-100",
		card: "border-pink-300 bg-pink-50 text-pink-500",
		sub: "text-pink-400",
		text: "text-pink-500",
	},
	purple: {
		badge: "border-purple-500 ring-purple-500/25 bg-purple-100",
		card: "border-purple-300 bg-purple-50 text-purple-500",
		sub: "text-purple-400",
		text: "text-purple-500",
	},
	sky: {
		badge: "border-sky-500 ring-sky-500/25 bg-sky-100",
		card: "border-sky-300 bg-sky-50 text-sky-500",
		sub: "text-sky-400",
		text: "text-sky-500",
	},
	teal: {
		badge: "border-teal-500 ring-teal-500/25 bg-teal-100",
		card: "border-teal-300 bg-teal-50 text-teal-500",
		sub: "text-teal-400",
		text: "text-teal-500",
	},
	yellow: {
		badge: "border-yellow-500 ring-yellow-500/25 bg-yellow-100",
		card: "border-yellow-300 bg-yellow-50 text-yellow-500",
		sub: "text-yellow-400",
		text: "text-yellow-500",
	},
};

interface CompletionAchievementsProps {
	trainerId: string;
}

export function CompletionAchievements({
	trainerId,
}: CompletionAchievementsProps) {
	const { data } = useSuspenseQuery(progressQueries.getSummary({ trainerId }));
	const achievements = data.summary.achievements;

	if (achievements.length === 0) {
		return (
			<Card>
				<CardContent>
					<div className="flex flex-col items-center gap-4 py-4 px-8 text-center text-muted-foreground">
						<div className="flex items-center justify-center size-16 rounded-full border bg-slate-50">
							<TrophyIcon className="size-6" />
						</div>
						<div className="flex flex-col gap-1">
							<p className="font-medium text-xsm">No achievements yet</p>
							<p className="text-xs">
								Track your first Pokémon, complete a regional dex, or catch your
								first Shiny to unlock achievements.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
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
						const colors = meta ? COLOR_MAP[meta.color] : COLOR_MAP.indigo;

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
			</Card>
		</Fragment>
	);
}
