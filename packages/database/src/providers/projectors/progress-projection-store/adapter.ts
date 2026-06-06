import type {
	DimensionDelta,
	IProgressProjectionStore,
	PokemonMetadata,
} from "@context/progress/contracts";

import { prisma } from "#prisma-client";

export class PrismaProgressProjectionStore implements IProgressProjectionStore {
	public async applyDeltas(
		trainerId: string,
		deltas: DimensionDelta[],
	): Promise<void> {
		await prisma.$transaction(async (tx) => {
			for (const { dimension, delta } of deltas) {
				switch (dimension.type) {
					case "GLOBAL_SPECIES": {
						await tx.trainerProgress.update({
							data: { speciesTracked: { increment: delta } },
							where: { trainerId },
						});
						const row = await tx.trainerProgress.findUnique({
							select: { speciesTotal: true, speciesTracked: true },
							where: { trainerId },
						});
						if (row && row.speciesTotal > 0) {
							await tx.trainerProgress.update({
								data: {
									completionPercentage:
										(row.speciesTracked / row.speciesTotal) * 100,
								},
								where: { trainerId },
							});
						}
						break;
					}

					case "REGIONAL": {
						await tx.trainerRegionalProgress.update({
							data: { speciesTracked: { increment: delta } },
							where: {
								trainerId_region: { region: dimension.region, trainerId },
							},
						});
						const row = await tx.trainerRegionalProgress.findUnique({
							select: { speciesTotal: true, speciesTracked: true },
							where: {
								trainerId_region: { region: dimension.region, trainerId },
							},
						});
						if (row && row.speciesTotal > 0) {
							await tx.trainerRegionalProgress.update({
								data: {
									completionPercentage:
										(row.speciesTracked / row.speciesTotal) * 100,
								},
								where: {
									trainerId_region: { region: dimension.region, trainerId },
								},
							});
						}
						break;
					}

					case "TRACKING": {
						await tx.trainerTrackingProgress.update({
							data: { speciesTracked: { increment: delta } },
							where: {
								trainerId_trackingState: {
									trackingState: dimension.state,
									trainerId,
								},
							},
						});
						const row = await tx.trainerTrackingProgress.findUnique({
							select: { speciesTotal: true, speciesTracked: true },
							where: {
								trainerId_trackingState: {
									trackingState: dimension.state,
									trainerId,
								},
							},
						});
						if (row && row.speciesTotal > 0) {
							await tx.trainerTrackingProgress.update({
								data: {
									completionPercentage:
										(row.speciesTracked / row.speciesTotal) * 100,
								},
								where: {
									trainerId_trackingState: {
										trackingState: dimension.state,
										trainerId,
									},
								},
							});
						}
						break;
					}

					case "VARIANT": {
						await tx.trainerVariantProgress.update({
							data: { tracked: { increment: delta } },
							where: {
								trainerId_variantKey: { trainerId, variantKey: dimension.key },
							},
						});
						const row = await tx.trainerVariantProgress.findUnique({
							select: { total: true, tracked: true },
							where: {
								trainerId_variantKey: { trainerId, variantKey: dimension.key },
							},
						});
						if (row && row.total > 0) {
							await tx.trainerVariantProgress.update({
								data: { percent: (row.tracked / row.total) * 100 },
								where: {
									trainerId_variantKey: {
										trainerId,
										variantKey: dimension.key,
									},
								},
							});
						}
						break;
					}
				}
			}
		});
	}

	public async updateLatestAcquisition(
		trainerId: string,
		pokemonRef: string,
		metadata: PokemonMetadata,
		trackedStates: string[],
		activityType: "TRACKED" | "UPDATED",
	): Promise<void> {
		const hasShiny = trackedStates.some((s) => s.includes("SHINY"));
		const sprite =
			hasShiny && metadata.sprite.shiny
				? metadata.sprite.shiny
				: metadata.sprite.url;

		await prisma.trainerLatestAcquisition.upsert({
			create: {
				activityType,
				dexNumber: metadata.dexNumber,
				occurredAt: new Date(),
				pokemonName: metadata.name,
				pokemonRef,
				primaryType: metadata.primaryType,
				region: metadata.region,
				secondaryType: metadata.secondaryType,
				sprite,
				trackedStates,
				trainerId,
			},
			update: {
				activityType,
				dexNumber: metadata.dexNumber,
				occurredAt: new Date(),
				pokemonName: metadata.name,
				pokemonRef,
				primaryType: metadata.primaryType,
				region: metadata.region,
				secondaryType: metadata.secondaryType,
				sprite,
				trackedStates,
			},
			where: { trainerId },
		});
	}
}
