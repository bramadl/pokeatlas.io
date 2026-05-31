import { cn } from "@/lib/utils";

interface PokedexGridProps {
	children: React.ReactNode;
	isLoading?: boolean;
}

export function PokedexGrid({ children, isLoading }: PokedexGridProps) {
	return (
		<div
			className={cn(
				"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-4",
				"min-h-160 md:min-h-120 px-4 py-6 md:py-8 items-start justify-center",
				isLoading && "animate-pulse duration-300 pointer-events-none",
			)}
		>
			{children}
		</div>
	);
}
