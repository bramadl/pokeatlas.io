import type { PokemonRegion, TrackableState, VariantKey } from "@context/game";
import type { PokemonMetadata } from "./pokedex-metadata-provider";

export type ProgressDimension =
	| { type: "GLOBAL_SPECIES" }
	| { type: "REGIONAL"; region: PokemonRegion | "HISUI" }
	| { type: "TRACKING"; state: Exclude<TrackableState, "BASE"> }
	| { type: "VARIANT"; key: VariantKey };

export interface DimensionDelta {
	delta: 1 | -1;
	dimension: ProgressDimension;
}

export interface IProgressProjectionStore {
	applyDeltas(trainerId: string, deltas: DimensionDelta[]): Promise<void>;
	updateLatestAcquisition(
		trainerId: string,
		pokemonRef: string,
		metadata: PokemonMetadata,
		trackedStates: string[],
		activityType: "TRACKED" | "UPDATED",
	): Promise<void>;
}
