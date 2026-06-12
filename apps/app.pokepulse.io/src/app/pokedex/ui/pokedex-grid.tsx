import { cn } from "@/lib/utils";

interface PokedexGridProps extends React.PropsWithChildren {
	loading?: boolean;
}

export function PokedexGrid({ children, loading }: PokedexGridProps) {
	return (
		<div
			className={cn(
				"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-4",
				"px-4 py-6 md:py-8",
				loading && "animate-pulse duration-300",
			)}
		>
			{children}
		</div>
	);
}
