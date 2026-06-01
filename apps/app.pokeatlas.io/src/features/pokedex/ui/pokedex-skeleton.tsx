import { CardSkeleton } from "../../pokemon/card/ui/card-skeleton";

export function PokedexSkeleton({ count = 18 }: { count?: number }) {
	return Array.from({ length: count }, (_, i) => (
		<CardSkeleton key={i.toString()} />
	));
}
