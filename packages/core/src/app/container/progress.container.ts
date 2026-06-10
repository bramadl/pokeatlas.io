import {
	TrainerRegistered,
	type TrainerRegisteredPayload,
} from "@context/auth";
import {
	PokemonTracked,
	type PokemonTrackedPayload,
	TrackingSignatureChanged,
	type TrackingStatesChangedPayload,
} from "@context/collection";
import {
	CatchOfTheDayResetHandler,
	GetCatchOfTheDayHandler,
	GetProgressSummaryHandler,
	GetProjectionReadinessHandler,
	PokemonTrackedHandler,
	ProgressContext,
	TrackingStatesChangedHandler,
	TrainerRegisteredHandler,
} from "@context/progress";
import {
	PrismaCatchOfTheDayProjectionAdapter,
	PrismaGetCatchOfTheDayQueryServiceAdapter,
	PrismaGetProgressSummaryQueryServiceAdapter,
	PrismaGetProjectionReadinessQueryServiceAdapter,
	PrismaPokemonMetadataSourceAdapter,
	PrismaPokemonSourceAdapter,
	PrismaTrainerAchievementProjectionAdapter,
	PrismaTrainerProgressProjectionAdapter,
} from "@pokepulse/database";
import type { ContainerBuilder, EventBus } from "@pokepulse/toolkit";

export function buildProgressSlice<
	Base extends { "Infrastructure:EventBus": () => EventBus },
>(base: ContainerBuilder<Base>) {
	return base
		.add(
			"Adapter:Projection:TrainerAchievementProjection",
			() => new PrismaTrainerAchievementProjectionAdapter(),
		)

		.add(
			"Adapter:Projection:TrainerProgressProjection",
			(r) =>
				new PrismaTrainerProgressProjectionAdapter(
					r["Adapter:Projection:TrainerAchievementProjection"],
				),
		)

		.add(
			"Adapter:Projection:Source:PokemonMetadata",
			() => new PrismaPokemonMetadataSourceAdapter(),
		)

		.add(
			"Adapter:Projection:CatchOfTheDayProjection",
			() => new PrismaCatchOfTheDayProjectionAdapter(),
		)

		.add(
			"Adapter:Projection:Source:Pokemon",
			() => new PrismaPokemonSourceAdapter(),
		)

		.add(
			"QueryService:GetProgressSummary",
			() => new PrismaGetProgressSummaryQueryServiceAdapter(),
		)

		.add(
			"QueryService:GetCatchOfTheDay",
			() => new PrismaGetCatchOfTheDayQueryServiceAdapter(),
		)

		.add(
			"QueryService:GetProjectionReadiness",
			() => new PrismaGetProjectionReadinessQueryServiceAdapter(),
		)

		.add(
			"Handler:Event:TrainerRegisteredHandler",
			(r) =>
				new TrainerRegisteredHandler(
					r["Adapter:Projection:TrainerProgressProjection"],
				),
		)

		.add("Handler:Event:PokemonTrackedHandler", (r) => {
			return new PokemonTrackedHandler(
				r["Adapter:Projection:Source:PokemonMetadata"],
				r["Adapter:Projection:TrainerProgressProjection"],
				r["Adapter:Projection:TrainerAchievementProjection"],
			);
		})

		.add("Handler:Event:TrackingSignatureChangedHandler", (r) => {
			return new TrackingStatesChangedHandler(
				r["Adapter:Projection:Source:PokemonMetadata"],
				r["Adapter:Projection:TrainerProgressProjection"],
				r["Adapter:Projection:TrainerAchievementProjection"],
			);
		})

		.add("Handler:Event:CatchOfTheDayResetHandler", (r) => {
			return new CatchOfTheDayResetHandler(
				r["Adapter:Projection:Source:Pokemon"],
				r["Adapter:Projection:CatchOfTheDayProjection"],
			);
		})

		.add("Handler:Query:GetProgressSummary", (r) => {
			return new GetProgressSummaryHandler(
				r["QueryService:GetProgressSummary"],
			);
		})

		.add("Handler:Query:GetCatchOfTheDay", (r) => {
			return new GetCatchOfTheDayHandler(
				r["Handler:Event:CatchOfTheDayResetHandler"],
				r["QueryService:GetCatchOfTheDay"],
			);
		})

		.add(
			"Handler:Query:GetProjectionReadiness",
			(r) =>
				new GetProjectionReadinessHandler(
					r["QueryService:GetProjectionReadiness"],
				),
		)

		.registerEvent((r) => {
			const bus = r["Infrastructure:EventBus"];

			bus.subscribe<TrainerRegisteredPayload>(
				TrainerRegistered.type,
				(event) => {
					r["Handler:Event:TrainerRegisteredHandler"].handle(event);
				},
			);

			bus.subscribe<PokemonTrackedPayload>(PokemonTracked.type, (event) =>
				r["Handler:Event:PokemonTrackedHandler"].handle(event),
			);

			bus.subscribe<TrackingStatesChangedPayload>(
				TrackingSignatureChanged.type,
				(event) => {
					return r["Handler:Event:TrackingSignatureChangedHandler"].handle(
						event,
					);
				},
			);
		})

		.add("Context:Progress", (r) => {
			return new ProgressContext({
				catchOfTheDay: r["Handler:Query:GetCatchOfTheDay"],
				progressSummary: r["Handler:Query:GetProgressSummary"],
				projectionReadiness: r["Handler:Query:GetProjectionReadiness"],
			});
		});
}
