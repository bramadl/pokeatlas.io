import type { TrackingSignatureRef } from "@context/collection";
import {
	POKEMON_REGIONS,
	type PokemonRef,
	type PokemonRegion,
	type PokemonType,
	PokemonTypeRef,
} from "@context/game";
import type {
	CatchOfTheDayEntry,
	CatchOfTheDaySlot,
} from "#progress:application/contracts/catch-of-the-day.ts";
import type { CatchOfTheDayScoredCandidate } from "../rules/scoring-engine";

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

function featuredRegionFor(date: string) {
	const DAYS_IN_MONTH = 31;

	let pointer = 0;
	for (let i = 0; i < date.length; i++) {
		pointer = (pointer * DAYS_IN_MONTH + date.charCodeAt(i)) >>> 0;
	}

	const region = POKEMON_REGIONS[pointer % POKEMON_REGIONS.length];
	if (!region) throw new Error("Failed to find region");

	return region;
}

function findBestSlotFor(
	candidatePool: CatchOfTheDayScoredCandidate[],
	candidateSlotType: CatchOfTheDaySlot,
	previousCandidates: Set<PokemonRef>,
	context: {
		featuredRegion: PokemonRegion;
		previouslyUsedTypes: Set<PokemonType>;
	},
): CatchOfTheDayScoredCandidate | null {
	for (const candidate of candidatePool) {
		if (previousCandidates.has(candidate.pokemonRef)) continue;
		if (!candidate.eligibleSlots.includes(candidateSlotType)) continue;
		if (candidateSlotType === "TYPE_DIVERSITY") {
			if (context.previouslyUsedTypes.has(candidate.primaryType)) continue;
		}

		if (candidateSlotType === "REGIONAL_FOCUS") {
			const effectiveRegion =
				candidate.traits.formCategory === "REGIONAL_FORM" &&
				candidate.traits.ref?.includes("HISUIAN")
					? "HISUI"
					: candidate.traits.region;

			if (effectiveRegion !== context.featuredRegion) continue;
		}

		return candidate;
	}

	return null;
}

function toEntry(
	candidate: CatchOfTheDayScoredCandidate,
	slot: CatchOfTheDaySlot,
	date: string,
): CatchOfTheDayEntry {
	const seed =
		candidate.pokemonRef.length +
		date.split("-").reduce((a, b) => a + Number(b), 0);

	const targetSignature = candidate.missingSignatures[
		seed % candidate.missingSignatures.length
	] as TrackingSignatureRef;

	return {
		dexNumber: candidate.dexNumber,
		missingSignatures: candidate.missingSignatures,
		name: candidate.name,
		pokemonRef: candidate.pokemonRef,
		primaryType: PokemonTypeRef.from(candidate.primaryType),
		score: candidate.score,
		secondaryType: candidate.secondaryType
			? PokemonTypeRef.from(candidate.secondaryType)
			: null,
		shinySprite: candidate.shinySprite,
		slot,
		sprite: candidate.sprite,
		targetSignature,
	};
}

export function selectSlots(
	scored: CatchOfTheDayScoredCandidate[],
	date: string,
): CatchOfTheDayEntry[] {
	const candidatePool = [...scored];
	const previousCandidates = new Set<PokemonRef>();
	const results: CatchOfTheDayEntry[] = [];

	const featuredRegion = featuredRegionFor(date);
	const previouslyUsedTypes = new Set<PokemonType>();

	for (const candidateSlotType of SLOT_PLAN) {
		const pick = findBestSlotFor(
			candidatePool,
			candidateSlotType,
			previousCandidates,
			{ featuredRegion, previouslyUsedTypes },
		);

		if (!pick) continue;

		previousCandidates.add(pick.pokemonRef);
		if (candidateSlotType === "TYPE_DIVERSITY") {
			previouslyUsedTypes.add(pick.primaryType);
		}

		results.push(toEntry(pick, candidateSlotType, date));
	}

	return results;
}
