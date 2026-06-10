import type { TrackingSignatureRef } from "@context/collection";
import {
	POKEMON_REGIONS,
	type PokemonRef,
	type PokemonRegion,
	type PokemonType,
	PokemonTypeRef,
	type TrackableState,
} from "@context/game";

import type {
	CatchOfTheDayEntry,
	CatchOfTheDaySlot,
} from "#progress:application/contracts/catch-of-the-day";

import {
	type CatchOfTheDayScoredCandidate,
	type ExpandedCandidate,
	expandByState,
	type StateCategory,
} from "../rules/scoring-engine";

const SLOT_PLAN: CatchOfTheDaySlot[] = [
	"TYPE_DIVERSITY",
	"TYPE_DIVERSITY",
	"COMPLETION_URGENCY",
	"COMPLETION_URGENCY",
	"RARITY_SPOTLIGHT",
	"RARITY_SPOTLIGHT",
	"REGIONAL_FOCUS",
	"WILDCARD",
];

const MAX_PER_STATE_CATEGORY: Record<StateCategory, number> = {
	ENCOUNTER: 4,
	GRIND: 4,
};

interface SelectionContext {
	featuredRegion: PokemonRegion;
	stateCategoryCounts: Record<StateCategory, number>;
	usedRefs: Set<PokemonRef>;
	usedStates: Set<TrackableState>;
	usedTypes: Set<PokemonType>;
}

function featuredRegionFor(date: string): PokemonRegion {
	const DAYS_IN_MONTH = 31;
	let pointer = 0;
	for (let i = 0; i < date.length; i++) {
		pointer = (pointer * DAYS_IN_MONTH + date.charCodeAt(i)) >>> 0;
	}
	const region = POKEMON_REGIONS[pointer % POKEMON_REGIONS.length];
	if (!region) throw new Error("Failed to resolve featured region");
	return region;
}

function getEffectiveRegion(candidate: ExpandedCandidate): PokemonRegion {
	const { traits } = candidate;
	if (
		traits.formCategory === "REGIONAL_FORM" &&
		traits.ref?.includes("HISUIAN")
	) {
		return "HISUI";
	}
	return traits.region;
}

function passesSlotFilter(
	candidate: ExpandedCandidate,
	slotType: CatchOfTheDaySlot,
	ctx: SelectionContext,
): boolean {
	if (ctx.usedRefs.has(candidate.pokemonRef)) return false;
	if (!candidate.eligibleSlots.includes(slotType)) return false;

	const isRare = candidate.traits.pokemonClassification !== null;
	if (
		!isRare &&
		ctx.stateCategoryCounts[candidate.stateCategory] >=
			MAX_PER_STATE_CATEGORY[candidate.stateCategory]
	)
		return false;

	if (slotType === "TYPE_DIVERSITY") {
		if (ctx.usedTypes.has(candidate.primaryType)) return false;
	}

	if (slotType === "REGIONAL_FOCUS") {
		if (getEffectiveRegion(candidate) !== ctx.featuredRegion) return false;
	}

	return true;
}

function findBest(
	pool: ExpandedCandidate[],
	slotType: CatchOfTheDaySlot,
	ctx: SelectionContext,
	allowStateReuse: boolean,
): ExpandedCandidate | null {
	for (const candidate of pool) {
		if (!allowStateReuse && ctx.usedStates.has(candidate.targetState)) continue;
		if (passesSlotFilter(candidate, slotType, ctx)) return candidate;
	}
	return null;
}

function pickForSlot(
	pool: ExpandedCandidate[],
	slotType: CatchOfTheDaySlot,
	ctx: SelectionContext,
): ExpandedCandidate | null {
	return (
		findBest(pool, slotType, ctx, false) ??
		findBest(pool, "WILDCARD", ctx, false) ??
		findBest(pool, slotType, ctx, true) ??
		findBest(pool, "WILDCARD", ctx, true)
	);
}

function toEntry(
	candidate: ExpandedCandidate,
	slot: CatchOfTheDaySlot,
): CatchOfTheDayEntry {
	return {
		dexNumber: candidate.dexNumber,
		missingSignatures: candidate.missingSignatures,
		name: candidate.name,
		pokemonRef: candidate.pokemonRef,
		primaryType: PokemonTypeRef.from(candidate.primaryType),
		score: candidate.expandedScore,
		secondaryType: candidate.secondaryType
			? PokemonTypeRef.from(candidate.secondaryType)
			: null,
		shinySprite: candidate.shinySprite,
		slot,
		sprite: candidate.sprite,
		targetSignature: candidate.targetState as TrackingSignatureRef,
	};
}

export function selectSlots(
	scored: CatchOfTheDayScoredCandidate[],
	date: string,
): CatchOfTheDayEntry[] {
	const pool = expandByState(scored);
	const ctx: SelectionContext = {
		featuredRegion: featuredRegionFor(date),
		stateCategoryCounts: { ENCOUNTER: 0, GRIND: 0 },
		usedRefs: new Set(),
		usedStates: new Set(),
		usedTypes: new Set(),
	};

	const results: CatchOfTheDayEntry[] = [];

	for (const slotType of SLOT_PLAN) {
		const pick = pickForSlot(pool, slotType, ctx);
		if (!pick) continue;

		ctx.usedRefs.add(pick.pokemonRef);
		ctx.usedStates.add(pick.targetState);
		ctx.stateCategoryCounts[pick.stateCategory]++;
		if (slotType === "TYPE_DIVERSITY") ctx.usedTypes.add(pick.primaryType);

		results.push(toEntry(pick, slotType));
	}

	return results;
}
