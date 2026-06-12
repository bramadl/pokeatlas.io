"use client";

import { useProgress } from "@bprogress/next";
import type { TeamOption } from "@pokepulse/core";
import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";

import { updateTeam } from "../api/profile.actions";

const TEAMS = [
	{
		color:
			"group-data-[selected]/team:bg-blue-50 group-data-[selected]/team:border-blue-400 dark:group-data-[selected]/team:bg-blue-950/30 dark:group-data-[selected]/team:border-blue-500",
		description: "Wisdom",
		emoji: "❄️",
		label: "Mystic",
		value: "MYSTIC" as const,
	},
	{
		color:
			"group-data-[selected]/team:bg-red-50 group-data-[selected]/team:border-red-400 dark:group-data-[selected]/team:bg-red-950/30 dark:group-data-[selected]/team:border-red-500",
		description: "Strength",
		emoji: "🔥",
		label: "Valor",
		value: "VALOR" as const,
	},
	{
		color:
			"group-data-[selected]/team:bg-yellow-50 group-data-[selected]/team:border-yellow-400 dark:group-data-[selected]/team:bg-yellow-950/30 dark:group-data-[selected]/team:border-yellow-500",
		description: "Intuition",
		emoji: "⚡",
		label: "Instinct",
		value: "INSTINCT" as const,
	},
] as const;

interface TeamSectionProps {
	currentTeam?: string;
	trainerId: string;
}

export function TeamSection({ currentTeam, trainerId }: TeamSectionProps) {
	const [isPending, startTransaction] = useTransition();
	const [team, setTeam] = useState<TeamOption | undefined>(
		currentTeam as TeamOption,
	);

	const progress = useProgress();
	const handleSelect = (value: TeamOption) => {
		const next = team === value ? undefined : value;
		if (!next) return;

		progress.start();
		startTransaction(async () => {
			setTeam(next);
			await updateTeam(trainerId, next);
			progress.stop();
		});
	};

	return (
		<div className="grid grid-cols-3 gap-2 h-full">
			{TEAMS.map((t) => {
				const isSelected = team === t.value;
				return (
					<button
						aria-pressed={isSelected}
						className={cn(
							"group/team flex flex-col items-center justify-center gap-2 rounded-lg border border-border/50 p-3",
							"transition-all hover:bg-muted/50 disabled:opacity-50 disabled:animate-pulse",
							isSelected && "border border-primary ring-2 ring-primary/50",
						)}
						data-selected={isSelected ? "" : undefined}
						disabled={isPending}
						key={t.value}
						onClick={() => handleSelect(t.value)}
						type="button"
					>
						<span
							className={cn(
								"flex size-12 items-center justify-center rounded-full text-2xl",
								"bg-muted/60 transition-colors",
								t.color,
							)}
						>
							{t.emoji}
						</span>
						<div className="flex flex-col items-center gap-0">
							<span className="text-sm font-semibold">{t.label}</span>
							<span className="text-xs text-muted-foreground">
								{t.description}
							</span>
						</div>
					</button>
				);
			})}
		</div>
	);
}
