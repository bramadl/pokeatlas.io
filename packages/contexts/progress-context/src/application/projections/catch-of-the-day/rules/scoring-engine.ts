import { TrackingSignatureRef } from "@context/collection";
import {
	type PokemonRef,
	TRACKABLE_STATE,
	type TrainerID,
} from "@context/game";

import type { CatchOfTheDaySlot } from "#progress:application/contracts/catch-of-the-day.ts";
import {
	type PokemonTraits,
	TraitRules,
} from "#progress:application/contracts/pokemon-traits.ts";

import type { CatchOfTheDayCandidate } from "../ports/sources/pokemon-source";

export interface CatchOfTheDayScoredCandidate extends CatchOfTheDayCandidate {
	eligibleSlots: CatchOfTheDaySlot[];
	missingSignatures: TrackingSignatureRef[];
	score: number;
}

const ALL_NON_BASE_STATES = Object.values(TRACKABLE_STATE).filter(
	(s) => s !== "BASE",
);

export function getEligibleSlots(
	candidate: CatchOfTheDayCandidate,
): CatchOfTheDaySlot[] {
	const { traits, ownedSignatures } = candidate;
	const signatures = getRelevantSignatures(traits);
	const owned =
		signatures.length -
		signatures.filter((s) => !ownedSignatures.has(s)).length;

	const completionRatio = owned / signatures.length;
	const slots: CatchOfTheDaySlot[] = [];

	const partiallyCompleted = completionRatio > 0 && completionRatio < 1;
	if (partiallyCompleted) slots.push("COMPLETION_URGENCY");
	if (traits.pokemonClassification !== null) slots.push("RARITY_SPOTLIGHT");

	slots.push("REGIONAL_FOCUS");
	slots.push("TYPE_DIVERSITY");
	slots.push("WILDCARD");

	return slots;
}

export function getRelevantSignatures(
	traits: PokemonTraits,
): TrackingSignatureRef[] {
	const sigs: TrackingSignatureRef[] = [TrackingSignatureRef.from("BASE")];
	for (const state of ALL_NON_BASE_STATES) {
		if (TraitRules.canTrack(state, traits)) {
			sigs.push(state as TrackingSignatureRef);
		}
	}
	return sigs;
}

function dailyOffset(
	pokemonRef: PokemonRef,
	trainerId: TrainerID,
	date: string,
): number {
	const seed = `${trainerId.value()}:${date}:${pokemonRef}`;
	let h = 5381;
	for (let i = 0; i < seed.length; i++) {
		h = ((h << 5) + h) ^ seed.charCodeAt(i);
		h = h >>> 0;
	}
	return h % 20;
}

export function scoreCandidate(
	candidate: CatchOfTheDayCandidate,
	trainerId: TrainerID,
	date: string,
): { score: number; missingSignatures: TrackingSignatureRef[] } {
	const { traits, ownedSignatures } = candidate;
	const signatures = getRelevantSignatures(traits);
	const missing = signatures.filter((sig) => !ownedSignatures.has(sig));
	if (missing.length === 0) return { missingSignatures: [], score: -1 };

	let rarity = 0;
	if (traits.pokemonClassification === "LEGENDARY") rarity = 25;
	else if (traits.pokemonClassification === "MYTHIC") rarity = 20;
	else if (traits.pokemonClassification === "ULTRA_BEAST") rarity = 15;
	else if (traits.formCategory === "REGIONAL_FORM") rarity = 10;
	else if (traits.formCategory === "ALTERNATE_FORM") rarity = 5;

	if (!traits.isTradable) rarity += 8;
	if (traits.isShadowAvailable) rarity += 4;

	const owned = signatures.length - missing.length;
	const urgency =
		signatures.length > 0 ? Math.round((owned / signatures.length) * 30) : 0;

	const offset = dailyOffset(candidate.pokemonRef, trainerId, date);
	const score = rarity + urgency + offset;

	return { missingSignatures: missing, score };
}

export function scoreCandidates(
	candidates: CatchOfTheDayCandidate[],
	trainerId: TrainerID,
	date: string,
): CatchOfTheDayScoredCandidate[] {
	return candidates
		.map((c) => {
			const { score, missingSignatures } = scoreCandidate(c, trainerId, date);
			const eligibleSlots = score >= 0 ? getEligibleSlots(c) : [];
			return { ...c, eligibleSlots, missingSignatures, score };
		})
		.filter((c) => c.score >= 0)
		.sort((a, b) => b.score - a.score);
}
