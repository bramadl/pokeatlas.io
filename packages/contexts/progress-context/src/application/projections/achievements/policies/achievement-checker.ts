import type { PokemonRegion, TrackableState, VariantKey } from "@context/game";

import {
	ACHIEVEMENT_TYPE,
	type AchievementType,
} from "#progress:application/contracts/achievement.ts";

import type { ITrainerAchievementProjection } from "../ports/projection";

const COUNT_MILESTONES: Array<{ threshold: number; type: AchievementType }> = [
	{ threshold: 10, type: ACHIEVEMENT_TYPE.TRACKED_10 },
	{ threshold: 100, type: ACHIEVEMENT_TYPE.TRACKED_100 },
	{ threshold: 500, type: ACHIEVEMENT_TYPE.TRACKED_500 },
	{ threshold: 1000, type: ACHIEVEMENT_TYPE.TRACKED_1000 },
];

const FIRST_CATCH_MAP: Record<string, AchievementType> = {
	HUNDO: ACHIEVEMENT_TYPE.FIRST_HUNDO,
	LUCKY: ACHIEVEMENT_TYPE.FIRST_LUCKY,
	NUNDO: ACHIEVEMENT_TYPE.FIRST_NUNDO,
	PURIFIED: ACHIEVEMENT_TYPE.FIRST_PURIFIED,
	SHADOW: ACHIEVEMENT_TYPE.FIRST_SHADOW,
	SHINY: ACHIEVEMENT_TYPE.FIRST_SHINY,
};

const REGIONAL_ACHIEVEMENT_MAP: Partial<
	Record<PokemonRegion, AchievementType>
> = {
	ALOLA: ACHIEVEMENT_TYPE.REGIONAL_ALOLA,
	GALAR: ACHIEVEMENT_TYPE.REGIONAL_GALAR,
	HISUI: ACHIEVEMENT_TYPE.REGIONAL_HISUI,
	HOENN: ACHIEVEMENT_TYPE.REGIONAL_HOENN,
	JOHTO: ACHIEVEMENT_TYPE.REGIONAL_JOHTO,
	KALOS: ACHIEVEMENT_TYPE.REGIONAL_KALOS,
	KANTO: ACHIEVEMENT_TYPE.REGIONAL_KANTO,
	PALDEA: ACHIEVEMENT_TYPE.REGIONAL_PALDEA,
	SINNOH: ACHIEVEMENT_TYPE.REGIONAL_SINNOH,
	UNOVA: ACHIEVEMENT_TYPE.REGIONAL_UNOVA,
	// UNREGISTERED intentionally omitted — not a real dex
};

const TRACKING_ACHIEVEMENT_MAP: Partial<
	Record<TrackableState, AchievementType>
> = {
	HUNDO: ACHIEVEMENT_TYPE.TRACKING_HUNDO,
	LUCKY: ACHIEVEMENT_TYPE.TRACKING_LUCKY,
	NUNDO: ACHIEVEMENT_TYPE.TRACKING_NUNDO,
	PURIFIED: ACHIEVEMENT_TYPE.TRACKING_PURIFIED,
	SHADOW: ACHIEVEMENT_TYPE.TRACKING_SHADOW,
	SHINY: ACHIEVEMENT_TYPE.TRACKING_SHINY,
};

const VARIANT_ACHIEVEMENT_MAP: Partial<Record<VariantKey, AchievementType>> = {
	alternateForm: ACHIEVEMENT_TYPE.VARIANT_ALTERNATE_FORM,
	costume: ACHIEVEMENT_TYPE.VARIANT_COSTUME,
	gender: ACHIEVEMENT_TYPE.VARIANT_GENDER,
	temporaryEvolution: ACHIEVEMENT_TYPE.VARIANT_TEMP_EVOLUTION,
};

export async function checkCountMilestones(
	trainerId: string,
	previousCount: number,
	newCount: number,
	achievements: ITrainerAchievementProjection,
): Promise<void> {
	const now = new Date();
	const crossed = COUNT_MILESTONES.filter(
		({ threshold }) => previousCount < threshold && newCount >= threshold,
	);

	await Promise.all(
		crossed.map(({ type }) => achievements.award(trainerId, type, now)),
	);
}

export async function checkFirstCatchByState(
	trainerId: string,
	addedStates: string[],
	achievements: ITrainerAchievementProjection,
	pokemonName: string,
	pokemonRef: string,
): Promise<void> {
	const now = new Date();
	const awards = addedStates
		.map((state) => FIRST_CATCH_MAP[state])
		.filter((type): type is AchievementType => type !== undefined);

	await Promise.all(
		awards.map((type) =>
			achievements.award(trainerId, type, now, { pokemonName, pokemonRef }),
		),
	);
}

export async function checkFirstTrack(
	trainerId: string,
	previousCount: number,
	achievements: ITrainerAchievementProjection,
	pokemonName: string,
	pokemonRef: string,
): Promise<void> {
	if (previousCount !== 0) return;

	await achievements.award(
		trainerId,
		ACHIEVEMENT_TYPE.FIRST_TRACKED,
		new Date(),
		{ pokemonName, pokemonRef },
	);
}

export async function checkRegionalCompletion(
	trainerId: string,
	region: string,
	tracked: number,
	total: number,
	achievements: ITrainerAchievementProjection,
): Promise<Date | null> {
	if (total === 0 || tracked < total) return null;

	const type = REGIONAL_ACHIEVEMENT_MAP[region as PokemonRegion];
	if (!type) return null;

	const now = new Date();
	await achievements.award(trainerId, type, now);
	return now;
}

export async function checkTrackingCompletion(
	trainerId: string,
	state: string,
	tracked: number,
	total: number,
	achievements: ITrainerAchievementProjection,
): Promise<Date | null> {
	if (total === 0 || tracked < total) return null;

	const type = TRACKING_ACHIEVEMENT_MAP[state as TrackableState];
	if (!type) return null;

	const now = new Date();
	await achievements.award(trainerId, type, now);
	return now;
}

export async function checkVariantCompletion(
	trainerId: string,
	variantKey: string,
	tracked: number,
	total: number,
	achievements: ITrainerAchievementProjection,
): Promise<Date | null> {
	if (total === 0 || tracked < total) return null;

	const type = VARIANT_ACHIEVEMENT_MAP[variantKey as VariantKey];
	if (!type) return null;

	const now = new Date();
	await achievements.award(trainerId, type, now);
	return now;
}
