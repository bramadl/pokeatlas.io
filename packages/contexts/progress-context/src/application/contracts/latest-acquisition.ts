import type { TrackingSignatureRef } from "@context/collection";
import type { PokemonRegion, PokemonType } from "@context/game";

export interface LatestAcquisition {
	dexNumber: number;
	name: string;
	region: PokemonRegion;
	sprite: string | null;
	status: "TRACKED" | "UNTRACKED";
	timestamp: Date;
	trackedStates: TrackingSignatureRef[];
	types: PokemonType[];
}
