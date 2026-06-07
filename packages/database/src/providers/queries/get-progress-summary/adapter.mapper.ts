import type { PokemonRegion, TrackableState, VariantKey } from "@context/game";
import type { ProgressSummary } from "@context/progress";

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

export function toProgressSummary(
	summary: GetProgressSummaryQueryResult,
): ProgressSummary {
	// ── Species Completion ──────────────────────────────────────────────────────
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

	// ── Regional Collections ────────────────────────────────────────────────────
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

	// ── Tracking Collections ────────────────────────────────────────────────────
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

	// ── Variant Collections ─────────────────────────────────────────────────────
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

	// ── Latest Acquisition ──────────────────────────────────────────────────────
	const latestAcquisition = summary.latestAcquisition
		? {
				dexNumber: `#${summary.latestAcquisition.dexNumber.toString().padStart(3, "0")}`,
				name: summary.latestAcquisition.pokemonName,
				region: summary.latestAcquisition.region,
				sprite: summary.latestAcquisition.sprite,
				timestamp: summary.latestAcquisition.occurredAt,
				trackedStates: summary.latestAcquisition.trackedStates,
				types: [
					summary.latestAcquisition.primaryType,
					...(summary.latestAcquisition.secondaryType
						? [summary.latestAcquisition.secondaryType]
						: []),
				],
			}
		: null;

	return {
		latestAcquisition,
		regionalCollections,
		speciesCompletion,
		trackingCollections,
		variantCollections,
	};
}
