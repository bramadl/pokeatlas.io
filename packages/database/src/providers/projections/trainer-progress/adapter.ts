import type {
	DimensionDelta,
	ITrainerProgressProjection,
	PokemonMetadata,
} from "@context/progress";

import { prisma } from "#prisma-client";

export class PrismaTrainerProgressProjectionAdapter
	implements ITrainerProgressProjection
{
	public async applyDeltas(
		trainerId: string,
		deltas: DimensionDelta[],
	): Promise<void> {
		let globalDelta = 0;
		const regionalDeltas = new Map<string, number>();
		const trackingDeltas = new Map<string, number>();
		const variantDeltas = new Map<string, number>();

		for (const { dimension, delta } of deltas) {
			switch (dimension.type) {
				case "GLOBAL_SPECIES":
					globalDelta += delta;
					break;
				case "REGIONAL":
					regionalDeltas.set(
						dimension.region,
						(regionalDeltas.get(dimension.region) ?? 0) + delta,
					);
					break;
				case "TRACKING":
					trackingDeltas.set(
						dimension.state,
						(trackingDeltas.get(dimension.state) ?? 0) + delta,
					);
					break;
				case "VARIANT":
					variantDeltas.set(
						dimension.key,
						(variantDeltas.get(dimension.key) ?? 0) + delta,
					);
					break;
			}
		}

		await prisma.$transaction([
			...(globalDelta !== 0
				? [
						prisma.progressProjection.update({
							data: { speciesTracked: { increment: globalDelta } },
							where: { trainerId },
						}),
					]
				: []),
			...[...regionalDeltas.entries()].map(([region, delta]) =>
				prisma.regionalProgressProjection.update({
					data: { speciesTracked: { increment: delta } },
					where: { trainerId_region: { region, trainerId } },
				}),
			),
			...[...trackingDeltas.entries()].map(([state, delta]) =>
				prisma.trackingProgressProjection.update({
					data: { speciesTracked: { increment: delta } },
					where: {
						trainerId_trackingState: { trackingState: state, trainerId },
					},
				}),
			),
			...[...variantDeltas.entries()].map(([key, delta]) =>
				prisma.variantProgressProjection.update({
					data: { speciesTracked: { increment: delta } },
					where: { trainerId_variantKey: { trainerId, variantKey: key } },
				}),
			),
		]);

		const affectedRegions = [...regionalDeltas.keys()];
		const affectedStates = [...trackingDeltas.keys()];
		const affectedVariants = [...variantDeltas.keys()];

		const [global, regional, tracking, variant] = await Promise.all([
			globalDelta !== 0
				? prisma.progressProjection.findUnique({
						select: { speciesTotal: true, speciesTracked: true },
						where: { trainerId },
					})
				: null,
			affectedRegions.length > 0
				? prisma.regionalProgressProjection.findMany({
						select: { region: true, speciesTotal: true, speciesTracked: true },
						where: { region: { in: affectedRegions }, trainerId },
					})
				: [],
			affectedStates.length > 0
				? prisma.trackingProgressProjection.findMany({
						select: {
							speciesTotal: true,
							speciesTracked: true,
							trackingState: true,
						},
						where: { trackingState: { in: affectedStates }, trainerId },
					})
				: [],
			affectedVariants.length > 0
				? prisma.variantProgressProjection.findMany({
						select: {
							speciesTotal: true,
							speciesTracked: true,
							variantKey: true,
						},
						where: { trainerId, variantKey: { in: affectedVariants } },
					})
				: [],
		]);

		await prisma.$transaction([
			...(global && global.speciesTotal > 0
				? [
						prisma.progressProjection.update({
							data: {
								completionPercentage:
									(global.speciesTracked / global.speciesTotal) * 100,
							},
							where: { trainerId },
						}),
					]
				: []),
			...(
				regional as {
					region: string;
					speciesTracked: number;
					speciesTotal: number;
				}[]
			)
				.filter((r) => r.speciesTotal > 0)
				.map((r) =>
					prisma.regionalProgressProjection.update({
						data: {
							completionPercentage: (r.speciesTracked / r.speciesTotal) * 100,
						},
						where: { trainerId_region: { region: r.region, trainerId } },
					}),
				),
			...(
				tracking as {
					trackingState: string;
					speciesTracked: number;
					speciesTotal: number;
				}[]
			)
				.filter((t) => t.speciesTotal > 0)
				.map((t) =>
					prisma.trackingProgressProjection.update({
						data: {
							completionPercentage: (t.speciesTracked / t.speciesTotal) * 100,
						},
						where: {
							trainerId_trackingState: {
								trackingState: t.trackingState,
								trainerId,
							},
						},
					}),
				),
			...(
				variant as {
					variantKey: string;
					speciesTracked: number;
					speciesTotal: number;
				}[]
			)
				.filter((v) => v.speciesTotal > 0)
				.map((v) =>
					prisma.variantProgressProjection.update({
						data: {
							completionPercentage: (v.speciesTracked / v.speciesTotal) * 100,
						},
						where: {
							trainerId_variantKey: { trainerId, variantKey: v.variantKey },
						},
					}),
				),
		]);
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

		await prisma.latestAcquisitionProjection.upsert({
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
