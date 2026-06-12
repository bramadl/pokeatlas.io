"use client";

import { cn } from "@/lib/utils";

export type TrainerTeam = "MYSTIC" | "VALOR" | "INSTINCT" | null;

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
	onTeamChange: (team: TrainerTeam) => void;
	team: TrainerTeam;
}

export function TeamSection({ onTeamChange, team }: TeamSectionProps) {
	return (
		<div className="grid grid-cols-3 gap-2">
			{TEAMS.map((t) => {
				const isSelected = team === t.value;
				return (
					<button
						aria-pressed={isSelected}
						className={cn(
							"group/team flex flex-col items-center gap-2 rounded-lg border border-border/50 p-3",
							"transition-all hover:bg-muted/50",
							isSelected && "ring-1",
						)}
						data-selected={isSelected ? "" : undefined}
						key={t.value}
						onClick={() => onTeamChange(isSelected ? null : t.value)}
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
