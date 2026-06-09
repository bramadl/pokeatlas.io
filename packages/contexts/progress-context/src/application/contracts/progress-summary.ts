import type { TrainerAchievement } from "./achievement";
import type { LatestAcquisition } from "./latest-acquisition";
import type { RegionalCollections } from "./regional-collections";
import type { SpeciesCompletion } from "./species-completion";
import type { TrackingCollections } from "./tracking-collections";
import type { VariantCollections } from "./variant-collections";

export interface ProgressSummary {
	achievements: TrainerAchievement[];
	latestAcquisition: LatestAcquisition | null;
	regionalCollections: RegionalCollections;
	speciesCompletion: SpeciesCompletion;
	trackingCollections: TrackingCollections;
	variantCollections: VariantCollections;
}
