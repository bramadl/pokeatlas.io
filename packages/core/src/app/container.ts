import { ContainerBuilder, EventBus } from "@pokepulse/toolkit";

import { PokePulse } from "./client";
import { buildCollectionSlice } from "./container/collection";
import { pipe } from "./container/pipe";
import { buildProgressSlice } from "./container/progress";

const container = pipe(
	ContainerBuilder.create().add(
		"Infrastructure:EventBus",
		() => new EventBus(),
	),
	buildCollectionSlice,
	buildProgressSlice,
)
	.add(
		"pulse",
		(r) =>
			new PokePulse({
				collection: r["Context:Collection"],
				progress: r["Context:Progress"],
			}),
	)
	.build();

export const pulse = container.pulse;
export type pulseClient = typeof pulse;
