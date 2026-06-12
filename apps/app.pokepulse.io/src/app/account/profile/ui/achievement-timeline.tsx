"use client";

import { TrophyIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment } from "react/jsx-runtime";

import { progressQueries } from "@/app/dashboard/api/progress.query";
import {
	ACHIEVEMENT_COLOR_MAP,
	ACHIEVEMENT_META,
} from "@/app/dashboard/widgets/achievements/achievement-utils";
import { EmptyWidget } from "@/app/dashboard/widgets/empty-widget";
import { cn } from "@/lib/utils";

interface AchievementTimelineProps {
	trainerId: string;
}

export function AchievementTimeline({ trainerId }: AchievementTimelineProps) {
	const { data } = useSuspenseQuery(progressQueries.getSummary({ trainerId }));

	const achievements = [...data.summary.achievements].sort(
		(a, b) => b.achievedAt.getTime() - a.achievedAt.getTime(),
	);

	if (achievements.length === 0) {
		return (
			<EmptyWidget
				description="Track Pokémon, complete regions, catch shinies — they all count."
				Icon={TrophyIcon}
				title="No achievements yet"
			/>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto px-1 max-h-60">
			<div className="flex flex-col">
				{achievements.map((achievement, i, achievements) => {
					const meta = ACHIEVEMENT_META[achievement.type];
					const colors = meta
						? ACHIEVEMENT_COLOR_MAP[meta.color]
						: ACHIEVEMENT_COLOR_MAP.indigo;

					const opacity = Math.max(0.25, 1 - i * 0.25);

					return (
						<Fragment key={achievement.type}>
							<div
								className="relative flex items-center gap-3 h-14"
								style={{ opacity }}
							>
								{i !== achievements.length && (
									<div
										className={cn(
											"absolute left-4 -translate-x-1/2 top-full -translate-y-3.5 w-px h-7 -z-1",
											colors?.badge,
										)}
									/>
								)}

								<div
									className={cn(
										"relative z-10 flex shrink-0 items-center justify-center rounded-full p-1.5 shadow border ring-2 size-8",
										colors?.badge,
									)}
								>
									{meta?.icon}
								</div>

								{/* Content */}
								<div className="flex flex-col gap-0 pt-0.5 min-w-0">
									<span
										className={cn(
											"text-sm font-semibold leading-tight",
											colors?.text,
										)}
									>
										{meta?.label ?? achievement.type}
									</span>
									<span className="text-xs text-muted-foreground">
										{achievement.achievedAt.toLocaleDateString("en-GB", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
								</div>

								{/* "LATEST" pill on the most recent one */}
								{i === 0 && (
									<span className="ml-auto shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
										LATEST
									</span>
								)}
							</div>

							{/* Connector between items — skip after last */}
							{i < achievements.length - 1 && (
								<div aria-hidden className="ml-3.75 h-0 border-0" />
							)}
						</Fragment>
					);
				})}
			</div>
		</div>
	);
}
