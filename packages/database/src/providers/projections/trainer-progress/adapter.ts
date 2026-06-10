import {
	POKEMON_REGIONS,
	TRACKABLE_STATE,
	VARIANT_CONFIG,
} from "@context/game";
import {
	checkCountMilestones,
	checkFirstTrack,
	checkRegionalCompletion,
	checkTrackingCompletion,
	checkVariantCompletion,
	type DimensionDelta,
	type ITrainerAchievementProjection,
	type ITrainerProgressProjection,
	type PokemonMetadata,
} from "@context/progress";

import { prisma } from "#prisma-client";
import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

export class PrismaTrainerProgressProjectionAdapter
	implements ITrainerProgressProjection
{
	public constructor(
		private readonly achievements: ITrainerAchievementProjection,
	) {}

	public async applyDeltas(
		trainerId: string,
		deltas: DimensionDelta[],
		context: { pokemonRef: string; pokemonName: string },
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
						select: {
							completedAt: true,
							region: true,
							speciesTotal: true,
							speciesTracked: true,
						},
						where: { region: { in: affectedRegions }, trainerId },
					})
				: [],
			affectedStates.length > 0
				? prisma.trackingProgressProjection.findMany({
						select: {
							completedAt: true,
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
							completedAt: true,
							speciesTotal: true,
							speciesTracked: true,
							variantKey: true,
						},
						where: { trainerId, variantKey: { in: affectedVariants } },
					})
				: [],
		]);

		const now = new Date();

		type RegionalRow = {
			region: string;
			speciesTracked: number;
			speciesTotal: number;
			completedAt: Date | null;
		};
		type TrackingRow = {
			trackingState: string;
			speciesTracked: number;
			speciesTotal: number;
			completedAt: Date | null;
		};
		type VariantRow = {
			variantKey: string;
			speciesTracked: number;
			speciesTotal: number;
			completedAt: Date | null;
		};

		await prisma.$transaction(
			[
				...(global && global.speciesTotal > 0
					? [
							prisma.progressProjection.update({
								data: {
									completionPercentage:
										(global.speciesTracked / global.speciesTotal) * 100,

									...(global.speciesTracked >= global.speciesTotal
										? { completedAt: now }
										: {}),
								},
								where: { trainerId },
							}),
						]
					: []),
				...(regional as RegionalRow[])
					.filter((r) => r.speciesTotal > 0)
					.map((r) =>
						prisma.regionalProgressProjection.update({
							data: {
								completionPercentage: (r.speciesTracked / r.speciesTotal) * 100,

								...(r.speciesTracked >= r.speciesTotal && r.completedAt === null
									? { completedAt: now }
									: {}),
							},
							where: { trainerId_region: { region: r.region, trainerId } },
						}),
					),
				...(tracking as TrackingRow[])
					.filter((t) => t.speciesTotal > 0)
					.map((t) =>
						prisma.trackingProgressProjection.update({
							data: {
								completionPercentage: (t.speciesTracked / t.speciesTotal) * 100,
								...(t.speciesTracked >= t.speciesTotal && t.completedAt === null
									? { completedAt: now }
									: {}),
							},
							where: {
								trainerId_trackingState: {
									trackingState: t.trackingState,
									trainerId,
								},
							},
						}),
					),
				...(variant as VariantRow[])
					.filter((v) => v.speciesTotal > 0)
					.map((v) =>
						prisma.variantProgressProjection.update({
							data: {
								completionPercentage: (v.speciesTracked / v.speciesTotal) * 100,
								...(v.speciesTracked >= v.speciesTotal && v.completedAt === null
									? { completedAt: now }
									: {}),
							},
							where: {
								trainerId_variantKey: { trainerId, variantKey: v.variantKey },
							},
						}),
					),
			],
			{ timeout: 15000 },
		);

		await Promise.all([
			globalDelta === 1 && global
				? checkFirstTrack(
						trainerId,
						global.speciesTracked - 1,
						this.achievements,
						context.pokemonName,
						context.pokemonRef,
					)
				: Promise.resolve(),

			globalDelta !== 0 && global
				? checkCountMilestones(
						trainerId,
						global.speciesTracked - globalDelta,
						global.speciesTracked,
						this.achievements,
					)
				: Promise.resolve(),

			...(regional as RegionalRow[])
				.filter(
					(r) =>
						r.speciesTotal > 0 &&
						r.speciesTracked >= r.speciesTotal &&
						r.completedAt === null,
				)
				.map((r) =>
					checkRegionalCompletion(
						trainerId,
						r.region,
						r.speciesTracked,
						r.speciesTotal,
						this.achievements,
					),
				),

			...(tracking as TrackingRow[])
				.filter(
					(t) =>
						t.speciesTotal > 0 &&
						t.speciesTracked >= t.speciesTotal &&
						t.completedAt === null,
				)
				.map((t) =>
					checkTrackingCompletion(
						trainerId,
						t.trackingState,
						t.speciesTracked,
						t.speciesTotal,
						this.achievements,
					),
				),

			...(variant as VariantRow[])
				.filter(
					(v) =>
						v.speciesTotal > 0 &&
						v.speciesTracked >= v.speciesTotal &&
						v.completedAt === null,
				)
				.map((v) =>
					checkVariantCompletion(
						trainerId,
						v.variantKey,
						v.speciesTracked,
						v.speciesTotal,
						this.achievements,
					),
				),
		]);
	}

	public async initializeForTrainer(trainerId: string): Promise<void> {
		const NUNDO_TRIO_LAKE_DEX = [480, 481, 482];
		const NUNDO_GALARIAN_BIRDS_DEX = [144, 145, 146];

		const SPECIES_WHERE: PokemonModelWhereInput = {
			isCostume: false,
			isFemale: false,
			isTemporaryEvolution: false,
			isTrackable: true,
			OR: [
				{ formCategory: "BASE_FORM" },
				{ formCategory: "ALTERNATE_FORM", isDefaultForm: true },
				{ formCategory: "REGIONAL_FORM" },
			],
		};

		const [
			speciesOrHundoTotal,
			shinyTotal,
			shadowOrPurifiedTotal,
			luckyTotal,
			nundoTotal,
			regionalTotals,
			hisuiTotal,
			altFormTotal,
			costumeTotal,
			femaleTotal,
			tempEvoTotal,
		] = await Promise.all([
			prisma.pokemonModel.count({ where: SPECIES_WHERE }),
			prisma.pokemonModel.count({
				where: { ...SPECIES_WHERE, shinySprite: { not: null } },
			}),
			prisma.pokemonModel.count({
				where: { ...SPECIES_WHERE, isShadowAvailable: true },
			}),
			prisma.pokemonModel.count({
				where: { ...SPECIES_WHERE, isTradable: true },
			}),
			prisma.pokemonModel.count({
				where: {
					...SPECIES_WHERE,
					AND: [
						{
							OR: [
								{ pokemonClassification: null },
								{ pokedexNumber: { in: NUNDO_TRIO_LAKE_DEX } },
								{
									formCategory: "REGIONAL_FORM",
									pokedexNumber: { in: NUNDO_GALARIAN_BIRDS_DEX },
								},
							],
						},
					],
				},
			}),
			prisma.pokemonModel.groupBy({
				_count: { region: true },
				by: ["region"],
				where: {
					...SPECIES_WHERE,
					NOT: {
						AND: [
							{ formCategory: "REGIONAL_FORM" },
							{ ref: { contains: "HISUIAN" } },
						],
					},
				},
			}),
			prisma.pokemonModel.count({
				where: {
					formCategory: "REGIONAL_FORM",
					isFemale: false,
					isTrackable: true,
					ref: { contains: "HISUIAN" },
				},
			}),
			prisma.pokemonModel.count({
				where: {
					formCategory: "ALTERNATE_FORM",
					isCostume: false,
					isDefaultForm: false,
					isFemale: false,
					isTemporaryEvolution: false,
					isTrackable: true,
				},
			}),
			prisma.pokemonModel.count({
				where: { isCostume: true, isTrackable: true },
			}),
			prisma.pokemonModel.count({
				where: { isFemale: true, isTrackable: true },
			}),
			prisma.pokemonModel.count({
				where: { isTemporaryEvolution: true, isTrackable: true },
			}),
		]);

		const regionMap: Record<string, number> = {};
		for (const row of regionalTotals) {
			regionMap[row.region] = row._count.region;
		}
		regionMap.HISUI = hisuiTotal;

		const trackingMap: Record<string, number> = {
			HUNDO: speciesOrHundoTotal,
			LUCKY: luckyTotal,
			NUNDO: nundoTotal,
			PURIFIED: shadowOrPurifiedTotal,
			SHADOW: shadowOrPurifiedTotal,
			SHINY: shinyTotal,
		};

		const variantMap: Record<string, number> = {
			alternateForm: altFormTotal,
			costume: costumeTotal,
			gender: femaleTotal,
			temporaryEvolution: tempEvoTotal,
		};

		await prisma.$transaction(
			async (tx) => {
				await tx.progressProjection.create({
					data: {
						completionPercentage: 0,
						speciesTotal: speciesOrHundoTotal,
						speciesTracked: 0,
						trainerId,
					},
				});
				await tx.regionalProgressProjection.createMany({
					data: POKEMON_REGIONS.map((region) => ({
						completionPercentage: 0,
						region,
						speciesTotal: regionMap[region] ?? 0,
						speciesTracked: 0,
						trainerId,
					})),
					skipDuplicates: true,
				});
				await tx.trackingProgressProjection.createMany({
					data: Object.keys(TRACKABLE_STATE).map((state) => ({
						completionPercentage: 0,
						speciesTotal: trackingMap[state] ?? 0,
						speciesTracked: 0,
						trackingState: state,
						trainerId,
					})),
					skipDuplicates: true,
				});
				await tx.variantProgressProjection.createMany({
					data: Object.values(VARIANT_CONFIG).map((v) => ({
						completionPercentage: 0,
						speciesTotal: variantMap[v.key] ?? 0,
						speciesTracked: 0,
						trainerId,
						variantKey: v.key,
					})),
					skipDuplicates: true,
				});
			},
			{ timeout: 15000 },
		);
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
