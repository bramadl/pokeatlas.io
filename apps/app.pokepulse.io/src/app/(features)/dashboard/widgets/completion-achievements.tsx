"use client";

import { TrophyIcon } from "@phosphor-icons/react";
import { Fragment } from "react/jsx-runtime";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// TODO: Connect to real data — derive from completedAt fields in projection tables
// const ACHIEVEMENTS = [
//   { color: "green", icon: "🌎", label: "Kanto Dex Completed", completedAt: "23 February 2026" },
//   { color: "indigo", icon: "🧬", label: "Costume Completed", completedAt: "23 February 2026" },
//   { color: "sky", icon: "✨", label: "Shadow Dex Completed", completedAt: "23 February 2026" },
//   { color: "indigo", icon: "🧬", label: "Temp. Evolution Completed", completedAt: "23 February 2026" },
// ];
const ACHIEVEMENTS: {
	color: string;
	icon: string;
	label: string;
	completedAt: string;
}[] = [];

const COLOR_MAP: Record<
	string,
	{ badge: string; card: string; text: string; sub: string }
> = {
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
	sky: {
		badge: "border-sky-500 ring-sky-500/25 bg-sky-100",
		card: "border-sky-300 bg-sky-50 text-sky-500",
		sub: "text-sky-400",
		text: "text-sky-500",
	},
};

export function CompletionAchievements() {
	return (
		<Card>
			{ACHIEVEMENTS.length === 0 ? (
				<CardContent>
					<div className="flex flex-col items-center gap-4 py-4 px-8 text-center text-muted-foreground">
						<div className="flex items-center justify-center size-16 rounded-full border bg-slate-50">
							<TrophyIcon className="size-6" />
						</div>
						<div className="flex flex-col gap-1">
							<p className="font-medium text-xsm">No achievements yet</p>
							<p className="text-xs">
								Complete a regional dex or tracking collection to unlock your
								first achievement.
							</p>
						</div>
					</div>
				</CardContent>
			) : (
				<Fragment>
					<CardHeader>
						<CardTitle>Completion Achievements</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						{ACHIEVEMENTS.map((achievement) => {
							const colors = COLOR_MAP[achievement.color] ?? COLOR_MAP.indigo;
							return (
								<Card className={colors?.card} key={achievement.label}>
									<CardContent className="flex items-center gap-4">
										<div
											className={cn(
												"flex items-center justify-center rounded-full p-2 shadow border ring-2 size-8",
												colors?.badge,
											)}
										>
											{achievement.icon}
										</div>
										<div>
											<div className={colors?.text}>{achievement.label}</div>
											<p className={cn("text-xs", colors?.sub)}>
												Completed: {achievement.completedAt}
											</p>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</CardContent>
				</Fragment>
			)}
		</Card>
	);
}
