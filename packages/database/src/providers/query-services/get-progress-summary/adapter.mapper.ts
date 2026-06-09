import { TrackingSignatureRef } from "@context/collection";
import {
	type PokemonRegion,
	PokemonRegionRef,
	PokemonTypeRef,
	type TrackableState,
	type VariantKey,
} from "@context/game";
import type {
	AchievementMetadata,
	AchievementType,
	GetProgressSummaryOutput,
	LatestAcquisition,
	ProgressSummary,
	TrainerAchievement,
} from "@context/progress";

import type { ProgressProjectionGetPayload } from "#prisma-client/models.ts";

export type GetProgressSummaryQueryResult = ProgressProjectionGetPayload<{
	select: {
		speciesTracked: true;
		speciesTotal: true;
		completionPercentage: true;
		completedAt: true;
		latestAcquisition: {
			select: {
				dexNumber: true;
				occurredAt: true;
				pokemonName: true;
				primaryType: true;
				region: true;
				secondaryType: true;
				sprite: true;
				trackedStates: true;
				activityType: true;
			};
		};
		regionalProgress: {
			select: {
				region: true;
				speciesTracked: true;
				speciesTotal: true;
				completionPercentage: true;
				completedAt: true;
			};
		};
		trackingProgress: {
			select: {
				trackingState: true;
				speciesTracked: true;
				speciesTotal: true;
				completionPercentage: true;
				completedAt: true;
			};
		};
		variantProgress: {
			select: {
				variantKey: true;
				speciesTracked: true;
				speciesTotal: true;
				completionPercentage: true;
				completedAt: true;
			};
		};
	};
}>;

export type AchievementQueryResult = {
	type: string;
	achievedAt: Date;
	metadata: unknown;
}[];

export function toProgressSummary(
	summary: GetProgressSummaryQueryResult,
	achievementRows: AchievementQueryResult,
): GetProgressSummaryOutput {
	const achievements: TrainerAchievement[] = achievementRows.map((row) => ({
		achievedAt: row.achievedAt,
		metadata: row.metadata as AchievementMetadata | undefined,
		type: row.type as AchievementType,
	}));

	const mostCompleteRegion = summary.regionalProgress.reduce<{
		region: PokemonRegion;
		completionPercentage: number;
	} | null>((best, row) => {
		if (row.completionPercentage === 0) return best;
		if (!best)
			return {
				completionPercentage: row.completionPercentage,
				region: row.region as PokemonRegion,
			};
		return row.completionPercentage > best.completionPercentage
			? {
					completionPercentage: row.completionPercentage,
					region: row.region as PokemonRegion,
				}
			: best;
	}, null);

	const speciesCompletion = {
		completionPercentage: summary.completionPercentage,
		mostCompleteRegion,
		total: summary.speciesTotal,
		tracked: summary.speciesTracked,
	};

	const regionalCollections = Object.fromEntries(
		summary.regionalProgress.map((row) => [
			row.region as PokemonRegion,
			{
				completionPercentage: row.completionPercentage,
				total: row.speciesTotal,
				tracked: row.speciesTracked,
			},
		]),
	) as ProgressSummary["regionalCollections"];

	const trackingCollections = Object.fromEntries(
		summary.trackingProgress.map((row) => [
			row.trackingState as TrackableState,
			{
				completionPercentage: row.completionPercentage,
				total: row.speciesTotal,
				tracked: row.speciesTracked,
			},
		]),
	) as ProgressSummary["trackingCollections"];

	const variantCollections = Object.fromEntries(
		summary.variantProgress.map((row) => [
			row.variantKey as VariantKey,
			{
				completionPercentage: row.completionPercentage,
				total: row.speciesTotal,
				tracked: row.speciesTracked,
			},
		]),
	) as ProgressSummary["variantCollections"];

	const latestAcquisition: LatestAcquisition | null = summary.latestAcquisition
		? {
				dexNumber: summary.latestAcquisition.dexNumber,
				name: summary.latestAcquisition.pokemonName,
				region: PokemonRegionRef.from(summary.latestAcquisition.region),
				sprite: summary.latestAcquisition.sprite,
				status:
					summary.latestAcquisition.trackedStates.length === 0
						? "UNTRACKED"
						: "TRACKED",
				timestamp: summary.latestAcquisition.occurredAt,
				trackedStates: summary.latestAcquisition.trackedStates.map((state) =>
					TrackingSignatureRef.from(state),
				),
				types: [
					PokemonTypeRef.from(summary.latestAcquisition.primaryType),
					...(summary.latestAcquisition.secondaryType
						? [PokemonTypeRef.from(summary.latestAcquisition.secondaryType)]
						: []),
				],
			}
		: null;

	return {
		summary: {
			achievements,
			latestAcquisition,
			regionalCollections,
			speciesCompletion,
			trackingCollections,
			variantCollections,
		},
	};
}
