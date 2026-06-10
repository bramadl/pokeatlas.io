import { ContainerBuilder, EventBus } from "@pokepulse/toolkit";

import { PokePulse } from "./client";
import { buildAuthSlice } from "./container/auth.container";
import { buildCollectionSlice } from "./container/collection.container";
import { buildProgressSlice } from "./container/progress.container";
import { pipe } from "./container/utils/pipe";

const container = pipe(
	ContainerBuilder.create().add(
		"Infrastructure:EventBus",
		() => new EventBus(),
	),
	buildCollectionSlice,
	buildProgressSlice,
	buildAuthSlice,
)
	.add(
		"pulse",
		(r) =>
			new PokePulse({
				auth: r["Context:Auth"],
				collection: r["Context:Collection"],
				progress: r["Context:Progress"],
			}),
	)
	.build();

export const pulse = container.pulse;
export type pulseClient = typeof pulse;
