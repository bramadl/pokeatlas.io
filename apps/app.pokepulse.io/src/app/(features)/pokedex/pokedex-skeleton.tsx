import type React from "react";

import { PokedexGrid } from "./pokedex-grid";

interface PokedexSkeletonProps {
	content: () => React.JSX.Element;
	count?: number;
}

export function PokedexSkeleton({
	content: Component,
	count = 18,
}: PokedexSkeletonProps) {
	return (
		<PokedexGrid>
			{Array.from({ length: count }, (_, i) => (
				<Component key={i.toString()} />
			))}
		</PokedexGrid>
	);
}
