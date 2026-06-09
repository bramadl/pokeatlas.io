import type {
	GetProgressSummaryInput,
	GetProgressSummaryOutput,
	IGetProgressSummaryQueryService,
} from "@context/progress";

import { prisma } from "#prisma-client";
import { DataCorruptionError } from "#providers/errors/data-corruption.error.ts";

import { toProgressSummary } from "./adapter.mapper";

const ACHIEVEMENTS_LIMIT = 5;

export class PrismaGetProgressSummaryQueryServiceAdapter
	implements IGetProgressSummaryQueryService
{
	public async get(
		input: GetProgressSummaryInput,
	): Promise<GetProgressSummaryOutput> {
		const [summary, achievements] = await Promise.all([
			prisma.progressProjection.findUnique({
				select: {
					completedAt: true,
					completionPercentage: true,
					latestAcquisition: {
						select: {
							activityType: true,
							dexNumber: true,
							occurredAt: true,
							pokemonName: true,
							primaryType: true,
							region: true,
							secondaryType: true,
							sprite: true,
							trackedStates: true,
						},
					},
					regionalProgress: {
						select: {
							completedAt: true,
							completionPercentage: true,
							region: true,
							speciesTotal: true,
							speciesTracked: true,
						},
					},
					speciesTotal: true,
					speciesTracked: true,
					trackingProgress: {
						select: {
							completedAt: true,
							completionPercentage: true,
							speciesTotal: true,
							speciesTracked: true,
							trackingState: true,
						},
					},
					variantProgress: {
						select: {
							completedAt: true,
							completionPercentage: true,
							speciesTotal: true,
							speciesTracked: true,
							variantKey: true,
						},
					},
				},
				where: { trainerId: input.trainerId },
			}),
			prisma.trainerAchievementProjection.findMany({
				orderBy: { achievedAt: "desc" },
				select: { achievedAt: true, metadata: true, type: true },
				take: ACHIEVEMENTS_LIMIT,
				where: { trainerId: input.trainerId },
			}),
		]);

		if (!summary) {
			throw new DataCorruptionError("ProgressSummary", input.trainerId);
		}

		return toProgressSummary(summary, achievements);
	}
}
