import {
	type ProgressSummary,
	REGION_LABEL,
	TRACKABLE_STATE_LABEL,
	VARIANT_CONFIG,
	type VariantKey,
} from "@pokepulse/core";

export interface Insight {
	key: string;
	label: string;
	sub: string;
}

interface InsightCandidate extends Insight {
	score: number;
	topic: string;
}

const INSIGHT_LIMIT = 5;
const MIN_TRACKED = 10;

const VARIANT_LABEL: Record<VariantKey, string> = Object.fromEntries(
	Object.entries(VARIANT_CONFIG).map(([key, value]) => [key, value.label]),
) as Record<VariantKey, string>;

function dailySeed(trainerId: string): number {
	const today = new Date().toISOString().split("T")[0];
	let hash = 0;
	for (const char of trainerId + today) {
		hash = Math.imul(31, hash) + char.charCodeAt(0);
		hash |= 0;
	}
	return Math.abs(hash);
}

function seededInt(seed: number, max: number): number {
	let s = seed + 0x6d2b79f5;
	s = Math.imul(s ^ (s >>> 15), s | 1);
	s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
	return Math.floor((((s ^ (s >>> 14)) >>> 0) / 4294967296) * max);
}

function pickOne<T>(pool: T[], seed: number, offset: number): T {
	return pool[seededInt(seed + offset * 1000, pool.length)] as T;
}

function closestSub(pct: number): string {
	if (pct >= 80) return `${pct.toFixed(1)}% complete — almost there`;
	return `${pct.toFixed(1)}% complete — the finish line is close`;
}

function humanizeKey(key: string): string {
	return key
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase())
		.trim();
}

const COPIES = {
	archetype: {
		HUNDO: [
			"You're a Perfectionist — only 4-star Pokémon make the cut.",
			"IV perfection is your standard. The Hundo hunt never stops.",
			"You're a Hundo Hunter. 100% or nothing.",
		],
		LUCKY: [
			"You're a Lucky Hunter — fortune favors you, Trainer.",
			"Luck is your specialty. The Lucky Dex doesn't build itself.",
			"You're all about Lucky trades. Smart and efficient.",
		],
		NUNDO: [
			"You're a Nundo Collector — chasing perfection at 0% is its own art form.",
			"The rarest of rare. A true Nundo Seeker.",
			"0 IV or bust. You walk a different path, Trainer.",
		],
		PURIFIED: [
			"You're a Purifier — turning shadows into light, one Pokémon at a time.",
			"Team Rocket doesn't stand a chance. You're a Shadow Purger.",
			"The Purified Dex is your mission. Noble work, Trainer.",
		],
		SHADOW: [
			"You're a Shadow Collector — darkness suits you, Trainer.",
			"Team Rocket's loss is your gain. The Shadow hunt is strong with you.",
			"You're a Shadow Tamer. The darker the better.",
		],
		SHINY: [
			"You're a Shiny Chaser — the sparkle never gets old.",
			"The odds don't scare you. A true Shiny Hunter.",
			"Shiny hunting is your calling. The grind is the reward.",
		],
	} as Record<string, string[]>,

	closest: (label: string) => [
		(r: number) => `Only ${r} Pokémon left to complete the ${label}.`,
		(r: number) => `${r} more and the ${label} is yours.`,
		(r: number) =>
			`The ${label} is within reach — just ${r} ${r === 1 ? "slot" : "spots"} to fill.`,
		(r: number) =>
			`${r} ${r === 1 ? "Pokémon stands" : "Pokémon stand"} between you and a complete ${label}.`,
	],

	opportunity: (label: string, pct: number, tracked: number) => [
		`You've tracked ${tracked.toLocaleString()} ${label} entries — ${pct.toFixed(0)}% done. This one's your biggest adventure.`,
		`${tracked.toLocaleString()} in the ${label} and still not done. The dedication is real.`,
		`The ${label} is your longest journey — ${tracked.toLocaleString()} caught, ${pct.toFixed(0)}% complete.`,
	],

	snapshot: (tracked: number, total: number, pct: number) => [
		`${tracked.toLocaleString()} of ${total.toLocaleString()} species tracked — ${pct.toFixed(1)}% of the National Dex.`,
		`The Pokédex is ${pct.toFixed(0)}% complete. ${(total - tracked).toLocaleString()} species still out there.`,
		`You've registered ${tracked.toLocaleString()} species. ${(total - tracked).toLocaleString()} more to go before Professor Oak is impressed.`,
		`${pct.toFixed(0)}% of all known Pokémon — not bad, Trainer. Not bad at all.`,
	],

	strongest: {
		regional: (label: string, pct: number, tracked: number) => [
			`${label} is where you shine brightest — ${pct.toFixed(0)}% complete.`,
			`Your ${label} game is unmatched. ${pct.toFixed(0)}% and counting.`,
			`${label} is your strongest region. ${tracked} species and still going.`,
		],
		tracking: (label: string, pct: number, tracked: number) => [
			`The ${label} is your most developed collection — ${pct.toFixed(0)}% complete.`,
			`${pct.toFixed(0)}% of the ${label} done. That's your crown jewel right there.`,
			`${tracked} entries in the ${label}. Hard to beat.`,
		],
		variant: (label: string, pct: number, tracked: number) => [
			`${label} is your strongest variant category at ${pct.toFixed(0)}%.`,
			`${tracked} ${label} tracked. That's your most complete variant collection.`,
		],
	},
} as const;

function closestToCompletion(summary: ProgressSummary): InsightCandidate[] {
	const candidates = [
		...Object.entries(summary.regionalCollections)
			.filter(
				([region, s]) =>
					region !== "UNREGISTERED" &&
					s.total > 0 &&
					s.completionPercentage >= 50 &&
					s.completionPercentage < 100,
			)
			.map(([region, s]) => ({
				key: `closest_regional_${region}`,
				label: REGION_LABEL[region as keyof typeof REGION_LABEL] ?? region,
				pct: s.completionPercentage,
				remaining: s.total - s.tracked,
				topic: region,
				total: s.total,
			})),

		...Object.entries(summary.trackingCollections)
			.filter(
				([state, s]) =>
					state !== "BASE" &&
					s.total > 0 &&
					s.completionPercentage >= 50 &&
					s.completionPercentage < 100,
			)
			.map(([state, s]) => ({
				key: `closest_tracking_${state}`,
				label: `${TRACKABLE_STATE_LABEL[state as keyof typeof TRACKABLE_STATE_LABEL] ?? state} Dex`,
				pct: s.completionPercentage,
				remaining: s.total - s.tracked,
				topic: state,
				total: s.total,
			})),

		...Object.entries(summary.variantCollections)
			.filter(
				([, s]) =>
					s.total > 0 &&
					s.completionPercentage >= 50 &&
					s.completionPercentage < 100,
			)
			.map(([variantKey, s]) => ({
				key: `closest_variant_${variantKey}`,
				label:
					VARIANT_LABEL[variantKey as VariantKey] ?? humanizeKey(variantKey),
				pct: s.completionPercentage,
				remaining: s.total - s.tracked,
				topic: variantKey,
				total: s.total,
			})),
	];

	return candidates
		.sort((a, b) => a.remaining - b.remaining)
		.slice(0, 5)
		.map((c) => ({
			key: c.key,
			label: pickOne(
				COPIES.closest(c.label),
				c.remaining + c.total,
				0,
			)(c.remaining),
			score: 100 - c.pct,
			sub: closestSub(c.pct),
			topic: c.topic,
		}));
}

function strongestCollection(summary: ProgressSummary): InsightCandidate[] {
	const candidates = [
		...Object.entries(summary.regionalCollections)
			.filter(
				([region, s]) =>
					region !== "UNREGISTERED" && s.total > 0 && s.tracked >= MIN_TRACKED,
			)
			.map(([region, s]) => ({
				dim: "regional" as const,
				key: `strongest_regional_${region}`,
				label: REGION_LABEL[region as keyof typeof REGION_LABEL] ?? region,
				pct: s.completionPercentage,
				topic: region,
				tracked: s.tracked,
			})),

		...Object.entries(summary.trackingCollections)
			.filter(
				([state, s]) =>
					state !== "BASE" && s.total > 0 && s.tracked >= MIN_TRACKED,
			)
			.map(([state, s]) => ({
				dim: "tracking" as const,
				key: `strongest_tracking_${state}`,
				label: `${TRACKABLE_STATE_LABEL[state as keyof typeof TRACKABLE_STATE_LABEL] ?? state} Dex`,
				pct: s.completionPercentage,
				topic: state,
				tracked: s.tracked,
			})),

		...Object.entries(summary.variantCollections)
			.filter(([, s]) => s.total > 0 && s.tracked >= MIN_TRACKED)
			.map(([variantKey, s]) => ({
				dim: "variant" as const,
				key: `strongest_variant_${variantKey}`,
				label:
					VARIANT_LABEL[variantKey as VariantKey] ?? humanizeKey(variantKey),
				pct: s.completionPercentage,
				topic: variantKey,
				tracked: s.tracked,
			})),
	];

	return candidates
		.sort((a, b) => b.pct - a.pct)
		.slice(0, 5)
		.map((c) => ({
			key: c.key,
			label: pickOne(
				COPIES.strongest[c.dim](c.label, c.pct, c.tracked),
				c.tracked,
				1,
			),
			score: 100 - c.pct,
			sub: `${c.tracked.toLocaleString()} species tracked — your personal best`,
			topic: c.topic,
		}));
}

function biggestOpportunity(summary: ProgressSummary): InsightCandidate[] {
	const candidates = [
		...Object.entries(summary.trackingCollections)
			.filter(
				([state, s]) =>
					state !== "BASE" &&
					s.total > 0 &&
					s.completionPercentage < 100 &&
					s.tracked >= MIN_TRACKED,
			)
			.map(([state, s]) => ({
				key: `opportunity_tracking_${state}`,
				label: `${TRACKABLE_STATE_LABEL[state as keyof typeof TRACKABLE_STATE_LABEL] ?? state} Dex`,
				pct: s.completionPercentage,
				topic: state,
				tracked: s.tracked,
			})),

		...Object.entries(summary.regionalCollections)
			.filter(
				([region, s]) =>
					region !== "UNREGISTERED" &&
					s.total > 0 &&
					s.completionPercentage < 100 &&
					s.tracked >= MIN_TRACKED,
			)
			.map(([region, s]) => ({
				key: `opportunity_regional_${region}`,
				label: `${REGION_LABEL[region as keyof typeof REGION_LABEL] ?? region} Dex`,
				pct: s.completionPercentage,
				topic: region,
				tracked: s.tracked,
			})),
	];

	return candidates
		.sort((a, b) => b.tracked - a.tracked)
		.slice(0, 3)
		.map((c) => ({
			key: c.key,
			label: pickOne(
				COPIES.opportunity(c.label, c.pct, c.tracked),
				c.tracked,
				2,
			),
			score: c.pct,
			sub: `${(100 - c.pct).toFixed(0)}% still left to discover`,
			topic: c.topic,
		}));
}

function trainerArchetype(summary: ProgressSummary): InsightCandidate[] {
	const TRACKED_STATES = [
		"SHINY",
		"SHADOW",
		"LUCKY",
		"HUNDO",
		"NUNDO",
		"PURIFIED",
	] as const;

	const validStates = TRACKED_STATES.map((state) => ({
		pct: summary.trackingCollections[state]?.completionPercentage ?? 0,
		state,
	}))
		.filter((s) => s.pct >= 75)
		.sort((a, b) => b.pct - a.pct);

	const regionalValues = Object.entries(summary.regionalCollections)
		.filter(([k]) => k !== "UNREGISTERED")
		.map(([, v]) => v.completionPercentage);

	const regionalAvg =
		regionalValues.reduce((s, v) => s + v, 0) /
		Math.max(regionalValues.length, 1);
	const regionalSpread =
		Math.max(...regionalValues) - Math.min(...regionalValues);

	if (regionalAvg >= 75 && regionalSpread < 25) {
		return [
			{
				key: "archetype_explorer",
				label:
					"You're a Regional Explorer — your Pokédex spans every corner of the world.",
				score: 50,
				sub: "Even coverage across all regions",
				topic: "archetype_explorer",
			},
		];
	}

	const variantValues = Object.values(summary.variantCollections).map(
		(v) => v.completionPercentage,
	);
	const variantAvg =
		variantValues.reduce((s, v) => s + v, 0) /
		Math.max(variantValues.length, 1);

	const topStatePct = validStates[0]?.pct ?? 0;
	if (variantAvg >= 75 && variantAvg > topStatePct) {
		return [
			{
				key: "archetype_collector",
				label:
					"You're a Form Collector — alternate forms and variants are your obsession.",
				score: 50,
				sub: "Variant completion leads the way",
				topic: "archetype_collector",
			},
		];
	}

	if (validStates.length === 0) return [];

	const top = validStates[0];
	if (!top) return [];

	const copies = COPIES.archetype[top.state];
	if (!copies) return [];

	return [
		{
			key: `archetype_${top.state.toLowerCase()}`,
			label: pickOne(copies, Math.floor(top.pct), 3),
			score: 50,
			sub: `${TRACKABLE_STATE_LABEL[top.state]} is your dominant collection`,
			topic: top.state,
		},
	];
}

function overallSnapshot(summary: ProgressSummary): InsightCandidate[] {
	const { tracked, total, completionPercentage } = summary.speciesCompletion;
	if (tracked < MIN_TRACKED) return [];

	return [
		{
			key: "snapshot_overall",
			label: pickOne(
				COPIES.snapshot(tracked, total, completionPercentage),
				tracked + total,
				4,
			),
			score: 75,
			sub: `${tracked.toLocaleString()} / ${total.toLocaleString()} species`,
			topic: "overall",
		},
	];
}

export function deriveInsights(
	summary: ProgressSummary,
	trainerId: string,
): Insight[] {
	const seed = dailySeed(trainerId);

	const allCandidates: InsightCandidate[] = [
		...closestToCompletion(summary),
		...strongestCollection(summary),
		...biggestOpportunity(summary),
		...trainerArchetype(summary),
		...overallSnapshot(summary),
	];

	if (allCandidates.length === 0) return [];

	const shuffled = [...allCandidates];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = seededInt(seed + i * 777, i + 1);
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] as [
			InsightCandidate,
			InsightCandidate,
		];
	}

	const seenTopics = new Set<string>();
	const unique = shuffled.filter(
		(c) => !seenTopics.has(c.topic) && seenTopics.add(c.topic),
	);

	const priority: InsightCandidate[] = [];
	const rest: InsightCandidate[] = [];

	const wantClosest = unique.some((c) => c.key.startsWith("closest_"));
	const wantArchetype = unique.some((c) => c.key.startsWith("archetype_"));

	for (const c of unique) {
		const pinAsClosest =
			wantClosest &&
			c.key.startsWith("closest_") &&
			!priority.some((p) => p.key.startsWith("closest_"));
		const pinAsArchetype =
			wantArchetype &&
			c.key.startsWith("archetype_") &&
			!priority.some((p) => p.key.startsWith("archetype_"));

		if (pinAsClosest || pinAsArchetype) {
			priority.push(c);
		} else {
			rest.push(c);
		}
	}

	return [...priority, ...rest]
		.slice(0, INSIGHT_LIMIT)
		.map(({ key, label, sub }) => ({ key, label, sub }));
}
