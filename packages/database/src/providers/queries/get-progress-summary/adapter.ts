import type {
	GetProgressSummaryInput,
	GetProgressSummaryOutput,
	IProgressSummaryQueryService,
} from "@context/progress";

import { prisma } from "#prisma-client";
import { DataCorruptionError } from "#providers/errors/data-corruption.error.ts";
import { toProgressSummary } from "./adapter.mapper";

export class PrismaGetProgressSummaryQueryAdapter
	implements IProgressSummaryQueryService
{
	public async get(
		input: GetProgressSummaryInput,
	): Promise<GetProgressSummaryOutput> {
		const summary = await prisma.progressProjection.findUnique({
			select: {
				completedAt: true,
				completionPercentage: true,
				latestAcquisition: {
					select: {
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
		});

		if (!summary) {
			throw new DataCorruptionError("ProgressSummary", input.trainerId);
		}

		return { summary: toProgressSummary(summary) };
	}
}
