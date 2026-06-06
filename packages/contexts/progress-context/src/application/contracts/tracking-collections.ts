import type { TrackableState } from "@context/game";

import type { SummaryStat } from "./summary-stat";

export type TrackingCollections = Record<TrackableState, SummaryStat>;
