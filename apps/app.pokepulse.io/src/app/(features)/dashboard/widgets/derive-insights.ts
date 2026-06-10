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

const VARIANT_LABEL: Record<VariantKey, string> = Object.entries(VARIANT_CONFIG)
	.map(([key, value]) => {
		return [key, value.label];
	})
	.reduce(
		(acc, [key, value]) => {
			if (key && value) acc[key as VariantKey] = value;
			return acc;
		},
		{} as Record<VariantKey, string>,
	);

function seededInt(seed: number, max: number): number {
	let s = seed;
	s += 0x6d2b79f5;
	s = Math.imul(s ^ (s >>> 15), s | 1);
	s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
	const rand = ((s ^ (s >>> 14)) >>> 0) / 4294967296;
	return Math.floor(rand * max);
}

function dailySeed(trainerId: string): number {
	const today = new Date().toISOString().split("T")[0];
	const raw = trainerId + today;
	let hash = 0;
	for (let i = 0; i < raw.length; i++) {
		hash = Math.imul(31, hash) + raw.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

function pickOne<T>(pool: T[], seed: number, offset: number): T {
	return pool[seededInt(seed + offset * 1000, pool.length)] as T;
}

type InsightCandidate = Insight & { score: number };

function closestToCompletion(summary: ProgressSummary): InsightCandidate[] {
	type Entry = {
		key: string;
		label: string;
		remaining: number;
		total: number;
		pct: number;
	};
	const candidates: Entry[] = [];

	for (const [region, stat] of Object.entries(summary.regionalCollections)) {
		if (region === "UNREGISTERED") continue;
		if (stat.total === 0 || stat.completionPercentage >= 100) continue;
		candidates.push({
			key: `closest_regional_${region}`,
			label: REGION_LABEL[region as keyof typeof REGION_LABEL] ?? region,
			pct: stat.completionPercentage,
			remaining: stat.total - stat.tracked,
			total: stat.total,
		});
	}

	for (const [state, stat] of Object.entries(summary.trackingCollections)) {
		if (state === "BASE") continue;
		if (stat.total === 0 || stat.completionPercentage >= 100) continue;
		candidates.push({
			key: `closest_tracking_${state}`,
			label: `${TRACKABLE_STATE_LABEL[state as keyof typeof TRACKABLE_STATE_LABEL] ?? state} Dex`,
			pct: stat.completionPercentage,
			remaining: stat.total - stat.tracked,
			total: stat.total,
		});
	}

	for (const [variantKey, stat] of Object.entries(summary.variantCollections)) {
		if (stat.total === 0 || stat.completionPercentage >= 100) continue;
		candidates.push({
			key: `closest_variant_${variantKey}`,
			label:
				VARIANT_LABEL[variantKey as keyof typeof VARIANT_LABEL] ?? variantKey,
			pct: stat.completionPercentage,
			remaining: stat.total - stat.tracked,
			total: stat.total,
		});
	}

	candidates.sort((a, b) => a.remaining - b.remaining);

	return candidates.slice(0, 5).map((c) => {
		const copies: ((r: number) => string)[] = [
			(r) =>
				`Only ${r} ${r === 1 ? "Pokémon" : "Pokémon"} left to complete the ${c.label}.`,
			(r) => `${r} more and the ${c.label} is yours.`,
			(r) =>
				`The ${c.label} is within reach — just ${r} ${r === 1 ? "slot" : "spots"} to fill.`,
			(r) =>
				`${r} ${r === 1 ? "Pokémon stands" : "Pokémon stand"} between you and a complete ${c.label}.`,
		];
		const label = pickOne(copies, c.remaining + c.total, 0)(c.remaining);
		return {
			key: c.key,
			label,
			score: 100 - c.pct,
			sub: `${c.pct.toFixed(1)}% complete — the finish line is close`,
		};
	});
}

function strongestCollection(summary: ProgressSummary): InsightCandidate[] {
	type Entry = {
		key: string;
		dim: string;
		label: string;
		pct: number;
		tracked: number;
	};
	const candidates: Entry[] = [];

	for (const [region, stat] of Object.entries(summary.regionalCollections)) {
		if (region === "UNREGISTERED") continue;
		if (stat.total === 0 || stat.tracked === 0) continue;
		candidates.push({
			dim: "regional",
			key: `strongest_regional_${region}`,
			label: REGION_LABEL[region as keyof typeof REGION_LABEL] ?? region,
			pct: stat.completionPercentage,
			tracked: stat.tracked,
		});
	}

	for (const [state, stat] of Object.entries(summary.trackingCollections)) {
		if (state === "BASE") continue;
		if (stat.total === 0 || stat.tracked === 0) continue;
		candidates.push({
			dim: "tracking",
			key: `strongest_tracking_${state}`,
			label: `${TRACKABLE_STATE_LABEL[state as keyof typeof TRACKABLE_STATE_LABEL] ?? state} Dex`,
			pct: stat.completionPercentage,
			tracked: stat.tracked,
		});
	}

	for (const [variantKey, stat] of Object.entries(summary.variantCollections)) {
		if (stat.total === 0 || stat.tracked === 0) continue;
		candidates.push({
			dim: "variant",
			key: `strongest_variant_${variantKey}`,
			label:
				VARIANT_LABEL[variantKey as keyof typeof VARIANT_LABEL] ?? variantKey,
			pct: stat.completionPercentage,
			tracked: stat.tracked,
		});
	}

	candidates.sort((a, b) => b.pct - a.pct);

	return candidates.slice(0, 5).map((c) => {
		const regionalCopies = [
			`${c.label} is where you shine brightest — ${c.pct.toFixed(0)}% complete.`,
			`Your ${c.label} game is unmatched. ${c.pct.toFixed(0)}% and counting.`,
			`${c.label} is your strongest region. ${c.tracked} species and still going.`,
		];
		const trackingCopies = [
			`The ${c.label} is your most developed collection — ${c.pct.toFixed(0)}% complete.`,
			`${c.pct.toFixed(0)}% of the ${c.label} done. That's your crown jewel right there.`,
			`${c.tracked} entries in the ${c.label}. Hard to beat.`,
		];
		const variantCopies = [
			`${c.label} is your strongest variant category at ${c.pct.toFixed(0)}%.`,
			`${c.tracked} ${c.label} tracked. That's your most complete variant collection.`,
		];

		const pool =
			c.dim === "regional"
				? regionalCopies
				: c.dim === "tracking"
					? trackingCopies
					: variantCopies;

		return {
			key: c.key,
			label: pickOne(pool, c.tracked, 1),
			score: 100 - c.pct,
			sub: `${c.tracked.toLocaleString()} species tracked — your personal best`,
		};
	});
}

function biggestOpportunity(summary: ProgressSummary): InsightCandidate[] {
	type Entry = { key: string; label: string; tracked: number; pct: number };
	const candidates: Entry[] = [];

	for (const [state, stat] of Object.entries(summary.trackingCollections)) {
		if (state === "BASE") continue;
		if (stat.total === 0 || stat.completionPercentage >= 100) continue;
		if (stat.tracked < 10) continue;
		candidates.push({
			key: `opportunity_tracking_${state}`,
			label: `${TRACKABLE_STATE_LABEL[state as keyof typeof TRACKABLE_STATE_LABEL] ?? state} Dex`,
			pct: stat.completionPercentage,
			tracked: stat.tracked,
		});
	}

	for (const [region, stat] of Object.entries(summary.regionalCollections)) {
		if (region === "UNREGISTERED") continue;
		if (stat.total === 0 || stat.completionPercentage >= 100) continue;
		if (stat.tracked < 10) continue;
		candidates.push({
			key: `opportunity_regional_${region}`,
			label: `${REGION_LABEL[region as keyof typeof REGION_LABEL] ?? region} Dex`,
			pct: stat.completionPercentage,
			tracked: stat.tracked,
		});
	}

	candidates.sort((a, b) => b.tracked - a.tracked);

	return candidates.slice(0, 3).map((c) => {
		const copies = [
			`You've tracked ${c.tracked.toLocaleString()} ${c.label} entries — ${c.pct.toFixed(0)}% done. This one's your biggest adventure.`,
			`${c.tracked.toLocaleString()} in the ${c.label} and still not done. The dedication is real.`,
			`The ${c.label} is your longest journey — ${c.tracked.toLocaleString()} caught, ${c.pct.toFixed(0)}% complete.`,
		];
		return {
			key: c.key,
			label: pickOne(copies, c.tracked, 2),
			score: c.pct,
			sub: `${(100 - c.pct).toFixed(0)}% still left to discover`,
		};
	});
}

function trainerArchetype(summary: ProgressSummary): InsightCandidate[] {
	const tracking = summary.trackingCollections;
	const validStates = (
		["SHINY", "SHADOW", "LUCKY", "HUNDO", "NUNDO", "PURIFIED"] as const
	)
		.map((state) => ({
			pct: tracking[state]?.completionPercentage ?? 0,
			state,
		}))
		.filter((s) => s.pct > 0);

	if (validStates.length === 0) return [];

	const top = validStates.sort((a, b) => b.pct - a.pct)[0];
	if (!top) return [];

	const variantAvg =
		Object.values(summary.variantCollections).reduce(
			(sum, v) => sum + v.completionPercentage,
			0,
		) / Math.max(Object.values(summary.variantCollections).length, 1);

	const regionalValues = Object.entries(summary.regionalCollections)
		.filter(([k]) => k !== "UNREGISTERED")
		.map(([, v]) => v.completionPercentage);

	const regionalAvg =
		regionalValues.reduce((sum, v) => sum + v, 0) /
		Math.max(regionalValues.length, 1);

	const isExplorer =
		regionalAvg > 40 &&
		Math.max(...regionalValues) - Math.min(...regionalValues) < 25;

	if (isExplorer) {
		return [
			{
				key: "archetype_explorer",
				label:
					"You're a Regional Explorer — your Pokédex spans every corner of the world.",
				score: 50,
				sub: "Even coverage across all regions",
			},
		];
	}

	if (variantAvg > top.pct && variantAvg > 30) {
		return [
			{
				key: "archetype_collector",
				label:
					"You're a Form Collector — alternate forms and variants are your obsession.",
				score: 50,
				sub: "Variant completion leads the way",
			},
		];
	}

	const archetypeMap: Record<string, { name: string; copies: string[] }> = {
		HUNDO: {
			copies: [
				"You're a Perfectionist — only 4-star Pokémon make the cut.",
				"IV perfection is your standard. The Hundo hunt never stops.",
				"You're a Hundo Hunter. 100% or nothing.",
			],
			name: "Perfectionist",
		},
		LUCKY: {
			copies: [
				"You're a Lucky Hunter — fortune favors you, Trainer.",
				"Luck is your specialty. The Lucky Dex doesn't build itself.",
				"You're all about Lucky trades. Smart and efficient.",
			],
			name: "Lucky Hunter",
		},
		NUNDO: {
			copies: [
				"You're a Nundo Collector — chasing perfection at 0% is its own art form.",
				"The rarest of rare. A true Nundo Seeker.",
				"0 IV or bust. You walk a different path, Trainer.",
			],
			name: "Nundo Seeker",
		},
		PURIFIED: {
			copies: [
				"You're a Purifier — turning shadows into light, one Pokémon at a time.",
				"Team Rocket doesn't stand a chance. You're a Shadow Purger.",
				"The Purified Dex is your mission. Noble work, Trainer.",
			],
			name: "Purifier",
		},
		SHADOW: {
			copies: [
				"You're a Shadow Collector — darkness suits you, Trainer.",
				"Team Rocket's loss is your gain. The Shadow hunt is strong with you.",
				"You're a Shadow Tamer. The darker the better.",
			],
			name: "Shadow Collector",
		},
		SHINY: {
			copies: [
				"You're a Shiny Chaser — the sparkle never gets old.",
				"The odds don't scare you. A true Shiny Hunter.",
				"Shiny hunting is your calling. The grind is the reward.",
			],
			name: "Shiny Chaser",
		},
	};

	const meta = archetypeMap[top.state];
	if (!meta) return [];

	return [
		{
			key: `archetype_${top.state.toLowerCase()}`,
			label: pickOne(meta.copies, Math.floor(top.pct), 3),
			score: 50,
			sub: `${TRACKABLE_STATE_LABEL[top.state as keyof typeof TRACKABLE_STATE_LABEL]} is your dominant collection`,
		},
	];
}

function overallSnapshot(summary: ProgressSummary): InsightCandidate[] {
	const { tracked, total, completionPercentage } = summary.speciesCompletion;
	if (tracked === 0) return [];

	const remaining = total - tracked;
	const copies = [
		`${tracked.toLocaleString()} of ${total.toLocaleString()} species tracked — ${completionPercentage.toFixed(1)}% of the National Dex.`,
		`The Pokédex is ${completionPercentage.toFixed(0)}% complete. ${remaining.toLocaleString()} species still out there.`,
		`You've registered ${tracked.toLocaleString()} species. ${remaining.toLocaleString()} more to go before Professor Oak is impressed.`,
		`${completionPercentage.toFixed(0)}% of all known Pokémon — not bad, Trainer. Not bad at all.`,
	];

	return [
		{
			key: "snapshot_overall",
			label: pickOne(copies, tracked + total, 4),
			score: 75,
			sub: `${tracked.toLocaleString()} / ${total.toLocaleString()} species`,
		},
	];
}

const INSIGHT_LIMIT = 5;

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

	const seen = new Set<string>();
	const unique = allCandidates.filter((c) => {
		if (seen.has(c.key)) return false;
		seen.add(c.key);
		return true;
	});

	const shuffled = [...unique];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = seededInt(seed + i * 777, i + 1);
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] as [
			InsightCandidate,
			InsightCandidate,
		];
	}

	const priority: InsightCandidate[] = [];
	const rest: InsightCandidate[] = [];

	const hasClosest = shuffled.some((c) => c.key.startsWith("closest_"));
	const hasArchetype = shuffled.some((c) => c.key.startsWith("archetype_"));

	for (const c of shuffled) {
		const isClosest = c.key.startsWith("closest_");
		const isArchetype = c.key.startsWith("archetype_");

		if (
			(isClosest &&
				hasClosest &&
				!priority.some((p) => p.key.startsWith("closest_"))) ||
			(isArchetype &&
				hasArchetype &&
				!priority.some((p) => p.key.startsWith("archetype_")))
		) {
			priority.push(c);
		} else {
			rest.push(c);
		}
	}

	return [...priority, ...rest]
		.slice(0, INSIGHT_LIMIT)
		.map(({ key, label, sub }) => ({ key, label, sub }));
}
