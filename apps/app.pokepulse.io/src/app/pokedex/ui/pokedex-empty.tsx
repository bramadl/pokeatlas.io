import type { TrackingStatus } from "@pokepulse/core";

import { Badge } from "@/components/ui/badge";

import { parseSignature } from "../workspace/tracking/tracking-signature.utils";

const EMPTY_MESSAGES: Record<
	TrackingStatus,
	(context?: React.ReactNode) => React.ReactNode
> = {
	ALL: () => "Try a different filters or keywords!",
	MISSING: () => "You've caught them all!",
	TRACKED: (context) => (
		<span>
			You haven't tracked any {context ?? "Pokémon"} {context ? "Pokémon " : ""}
			yet!
		</span>
	),
};

export function PokedexEmpty({
	signature,
	status,
}: {
	status?: TrackingStatus;
	signature?: string;
}) {
	const badge =
		signature && signature !== "BASE" ? (
			<Badge className="capitalize font-semibold mx-px" variant="secondary">
				{parseSignature(signature)}
			</Badge>
		) : null;

	const message = EMPTY_MESSAGES[status ?? "ALL"](badge);
	return (
		<div className="min-h-160 md:min-h-120 col-span-full flex flex-col items-center justify-center gap-4 text-center">
			<div className="text-6xl select-none">🌿</div>
			<div>
				<p className="font-semibold text-foreground">No result here</p>
				<p className="text-sm text-muted-foreground mt-1">{message}</p>
			</div>
		</div>
	);
}
