interface PokemonCardBadgeProps {
	hasShinyState?: boolean;
}

export function PokemonCardBadge({ hasShinyState }: PokemonCardBadgeProps) {
	return (
		<aside className="pointer-events-none">
			{hasShinyState && (
				<div className="absolute z-1 top-3 left-3 flex flex-col gap-2">
					<span className="size-4 text-[8px] p-px rounded-full flex items-center justify-center bg-background shadow-sm">
						✨
					</span>
				</div>
			)}
		</aside>
	);
}
