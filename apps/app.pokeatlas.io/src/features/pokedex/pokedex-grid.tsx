import { cn } from "@/lib/utils";

export function PokedexGrid({
	children,
	isFetchingNewQuery,
}: {
	children: React.ReactNode;
	isFetchingNewQuery?: boolean;
}) {
	return (
		<div className={cn(isFetchingNewQuery && "animate-pulse duration-300")}>
			<div className="min-h-120 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-4 items-start px-4 py-6 md:py-8">
				{children}
			</div>
		</div>
	);
}
