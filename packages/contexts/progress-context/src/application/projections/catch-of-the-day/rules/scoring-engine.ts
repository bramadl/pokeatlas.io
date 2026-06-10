import { TrackingSignatureRef } from "@context/collection";
import {
	type PokemonRef,
	TRACKABLE_STATE,
	type TrackableState,
	type TrainerID,
} from "@context/game";

import type { CatchOfTheDaySlot } from "#progress:application/contracts/catch-of-the-day";
import {
	type PokemonTraits,
	TraitRules,
} from "#progress:application/contracts/pokemon-traits";

import type { CatchOfTheDayCandidate } from "../ports/sources/pokemon-source";

export type StateCategory = "ENCOUNTER" | "GRIND";

export interface CatchOfTheDayScoredCandidate extends CatchOfTheDayCandidate {
	eligibleSlots: CatchOfTheDaySlot[];
	missingSignatures: TrackingSignatureRef[];
	score: number;
}

export interface ExpandedCandidate extends CatchOfTheDayScoredCandidate {
	expandedScore: number;
	stateCategory: StateCategory;
	targetState: TrackableState;
}

const ALL_NON_BASE_STATES = Object.values(TRACKABLE_STATE).filter(
	(s) => s !== "BASE",
) as Exclude<TrackableState, "BASE">[];

const ENCOUNTER_STATES = new Set<TrackableState>([
	"BASE",
	"PURIFIED",
	"SHADOW",
	"SHINY",
]);

const GRIND_STATES = new Set<TrackableState>(["HUNDO", "LUCKY", "NUNDO"]);

const STATE_SCORE_BONUS: Record<TrackableState, number> = {
	BASE: 0,
	HUNDO: 10,
	LUCKY: 6,
	NUNDO: 12,
	PURIFIED: 3,
	SHADOW: 5,
	SHINY: 8,
};

const RARITY_SCORE: Partial<
	Record<NonNullable<PokemonTraits["pokemonClassification"]>, number>
> = {
	LEGENDARY: 25,
	MYTHIC: 20,
	ULTRA_BEAST: 15,
};

export function getStateCategory(state: TrackableState): StateCategory {
	if (ENCOUNTER_STATES.has(state)) return "ENCOUNTER";
	if (GRIND_STATES.has(state)) return "GRIND";
	throw new Error(`Unknown state category: ${state}`);
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

function getEligibleSlots(
	candidate: CatchOfTheDayCandidate,
): CatchOfTheDaySlot[] {
	const { traits, ownedSignatures } = candidate;
	const signatures = getRelevantSignatures(traits);
	const owned = signatures.filter((s) => ownedSignatures.has(s)).length;
	const completionRatio = owned / signatures.length;
	const isRare = traits.pokemonClassification !== null;

	const slots: CatchOfTheDaySlot[] = [];

	if (isRare) {
		slots.push("RARITY_SPOTLIGHT");
	} else {
		if (completionRatio < 1) slots.push("COMPLETION_URGENCY");
		slots.push("REGIONAL_FOCUS", "TYPE_DIVERSITY");
	}

	slots.push("WILDCARD");
	return slots;
}

export function scoreCandidate(
	candidate: CatchOfTheDayCandidate,
	trainerId: TrainerID,
	date: string,
): { missingSignatures: TrackingSignatureRef[]; score: number } {
	const { traits, ownedSignatures } = candidate;
	const signatures = getRelevantSignatures(traits);
	const missing = signatures.filter((sig) => !ownedSignatures.has(sig));

	if (missing.length === 0) return { missingSignatures: [], score: -1 };

	const rarity =
		(traits.pokemonClassification
			? (RARITY_SCORE[traits.pokemonClassification] ?? 0)
			: 0) +
		(traits.formCategory === "REGIONAL_FORM" && !traits.pokemonClassification
			? 10
			: 0) +
		(traits.formCategory === "ALTERNATE_FORM" && !traits.pokemonClassification
			? 5
			: 0) +
		(!traits.isTradable ? 8 : 0) +
		(traits.isShadowAvailable ? 4 : 0);

	const owned = signatures.length - missing.length;
	const urgency = Math.round((owned / signatures.length) * 30);
	const offset = dailyOffset(candidate.pokemonRef, trainerId, date);

	return { missingSignatures: missing, score: rarity + urgency + offset };
}

export function scoreCandidates(
	candidates: CatchOfTheDayCandidate[],
	trainerId: TrainerID,
	date: string,
): CatchOfTheDayScoredCandidate[] {
	return candidates
		.map((c) => {
			const { score, missingSignatures } = scoreCandidate(c, trainerId, date);
			return {
				...c,
				eligibleSlots: score >= 0 ? getEligibleSlots(c) : [],
				missingSignatures,
				score,
			};
		})
		.filter((c) => c.score >= 0)
		.sort((a, b) => b.score - a.score);
}

export function expandByState(
	scored: CatchOfTheDayScoredCandidate[],
): ExpandedCandidate[] {
	const expanded: ExpandedCandidate[] = [];

	for (const candidate of scored) {
		for (const sig of candidate.missingSignatures) {
			const state = sig as TrackableState;
			expanded.push({
				...candidate,
				expandedScore: candidate.score + (STATE_SCORE_BONUS[state] ?? 0),
				stateCategory: getStateCategory(state),
				targetState: state,
			});
		}
	}

	return expanded.sort((a, b) => b.expandedScore - a.expandedScore);
}
