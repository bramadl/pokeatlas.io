"use client";

import { FadersIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PokedexFilterButtonProps {
	activeFilterCount: number;
	isOpen: boolean;
	onClick: () => void;
}

export function PokedexFilterButton({
	activeFilterCount,
	isOpen,
	onClick,
}: PokedexFilterButtonProps) {
	const hasActiveFilters = activeFilterCount > 0;
	return (
		<Button
			aria-label={
				isOpen
					? "Close filters"
					: `Open filters${hasActiveFilters ? ` (${activeFilterCount} active)` : ""}`
			}
			aria-pressed={isOpen}
			className={cn(
				"relative shrink-0 transition-colors",
				isOpen && "bg-primary text-primary-foreground hover:bg-primary/80",
				hasActiveFilters && !isOpen && "border-primary/40",
			)}
			onClick={onClick}
			size="icon"
			variant={isOpen ? "default" : "secondary"}
		>
			<FadersIcon />
			{hasActiveFilters && (
				<span
					className={cn(
						"absolute -top-1 -right-1 flex items-center justify-center",
						"size-4 rounded-full text-[10px] font-bold leading-none",
						"bg-primary text-primary-foreground",
						isOpen && "bg-primary-foreground text-primary",
					)}
				>
					{activeFilterCount}
				</span>
			)}
		</Button>
	);
}
