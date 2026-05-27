import type { PokedexStatus } from "@pokeatlas/core/types";

const EMPTY_MESSAGES: Record<PokedexStatus | "default", string> = {
	default: "Try a different name, number, or family search",
	MISSING: "You've caught them all!",
	TRACKED: "You haven't tracked any Pokémon yet",
};

export function PokedexEmpty({ status }: { status?: PokedexStatus }) {
	const message = EMPTY_MESSAGES[status ?? "default"];
	return (
		<div className="col-span-full min-h-120 flex flex-col items-center justify-center gap-4 text-center">
			<div className="text-6xl select-none">🌿</div>
			<div>
				<p className="font-semibold text-foreground">No Pokémon found</p>
				<p className="text-sm text-muted-foreground mt-1">{message}</p>
			</div>
		</div>
	);
}
