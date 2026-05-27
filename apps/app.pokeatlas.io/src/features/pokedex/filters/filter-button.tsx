"use client";

import { FadersIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterButtonProps extends React.ComponentProps<"button"> {
	activeFilterCount: number;
	isOpen: boolean;
}

export function FilterButton({
	activeFilterCount,
	className,
	isOpen,
	onClick,
	...props
}: FilterButtonProps) {
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
				className,
			)}
			onClick={onClick}
			size="icon"
			variant={isOpen ? "default" : "secondary"}
			{...props}
		>
			<FadersIcon />
			{hasActiveFilters && (
				<span
					className={cn(
						"absolute top-0 right-0 flex items-center justify-center",
						"size-3 rounded-full text-[8px] font-bold leading-none",
						"bg-primary text-primary-foreground ring ring-primary ring-offset-1",
						isOpen && "bg-primary-foreground text-primary",
					)}
				>
					{activeFilterCount}
				</span>
			)}
		</Button>
	);
}
