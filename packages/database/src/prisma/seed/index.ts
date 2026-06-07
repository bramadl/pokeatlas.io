import { prisma } from "#prisma-client";
import { FormCategory } from "#prisma-client/enums.ts";
import type { PokemonModelWhereInput } from "#prisma-client/models.ts";

const TRAINER_ID = "00000000-0000-0000-0000-000000000001";

const NUNDO_TRIO_LAKE_DEX = [480, 481, 482];
const NUNDO_GALARIAN_BIRDS_DEX = [144, 145, 146];

const REGIONS = [
	"KANTO",
	"JOHTO",
	"HOENN",
	"SINNOH",
	"UNOVA",
	"KALOS",
	"ALOLA",
	"GALAR",
	"HISUI",
	"PALDEA",
	"UNREGISTERED",
] as const;

const SPECIES_WHERE: PokemonModelWhereInput = {
	isCostume: false,
	isFemale: false,
	isTemporaryEvolution: false,
	isTrackable: true,
	OR: [
		{ formCategory: FormCategory.BASE_FORM },
		{ formCategory: FormCategory.ALTERNATE_FORM, isDefaultForm: true },
		{ formCategory: FormCategory.REGIONAL_FORM },
	],
};

async function computeTotals() {
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
								formCategory: FormCategory.REGIONAL_FORM,
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
						{ formCategory: FormCategory.REGIONAL_FORM },
						{ ref: { contains: "HISUIAN" } },
					],
				},
			},
		}),
		prisma.pokemonModel.count({
			where: {
				formCategory: FormCategory.REGIONAL_FORM,
				isFemale: false,
				isTrackable: true,
				ref: { contains: "HISUIAN" },
			},
		}),
		prisma.pokemonModel.count({
			where: {
				formCategory: FormCategory.ALTERNATE_FORM,
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
		prisma.pokemonModel.count({ where: { isFemale: true, isTrackable: true } }),
		prisma.pokemonModel.count({
			where: { isTemporaryEvolution: true, isTrackable: true },
		}),
	]);

	const regionMap: Record<string, number> = {};
	for (const row of regionalTotals) {
		regionMap[row.region] = row._count.region;
	}
	regionMap.HISUI = hisuiTotal;

	return {
		altFormTotal,
		costumeTotal,
		femaleTotal,
		luckyTotal,
		nundoTotal,
		regionMap,
		shadowOrPurifiedTotal,
		shinyTotal,
		speciesOrHundoTotal,
		tempEvoTotal,
	};
}

/**
 * Reconstruct projection counters from existing TrackedPokemonModel rows.
 * Applies the same counting rules as the event handlers.
 */
async function reconstructTracked(trainerId: string) {
	const trackedPokemons = await prisma.trackedPokemonModel.findMany({
		select: {
			pokemon: {
				select: {
					formCategory: true,
					isCostume: true,
					isDefaultForm: true,
					isFemale: true,
					isShadowAvailable: true,
					isTemporaryEvolution: true,
					isTradable: true,
					pokedexNumber: true,
					pokemonClassification: true,
					ref: true,
					region: true,
				},
			},
			trackedStates: true,
		},
		where: { trainerId },
	});

	let speciesTracked = 0;
	const regionTracked: Record<string, number> = {};
	const trackingTracked: Record<string, number> = {};
	const variantTracked: Record<string, number> = {};

	for (const { pokemon: p, trackedStates } of trackedPokemons) {
		const hasBase = trackedStates.includes("BASE");

		if (hasBase) {
			const isSpecies =
				!p.isCostume &&
				!p.isFemale &&
				!p.isTemporaryEvolution &&
				(p.formCategory === "BASE_FORM" ||
					p.formCategory === "REGIONAL_FORM" ||
					(p.formCategory === "ALTERNATE_FORM" && p.isDefaultForm));

			if (isSpecies) {
				speciesTracked++;
				const region =
					p.formCategory === "REGIONAL_FORM" && p.ref.includes("HISUIAN")
						? "HISUI"
						: p.region;
				regionTracked[region] = (regionTracked[region] ?? 0) + 1;
			}

			if (
				p.formCategory === "ALTERNATE_FORM" &&
				!p.isDefaultForm &&
				!p.isCostume &&
				!p.isFemale &&
				!p.isTemporaryEvolution
			) {
				variantTracked.alternateForm = (variantTracked.alternateForm ?? 0) + 1;
			}
			if (p.isCostume)
				variantTracked.costume = (variantTracked.costume ?? 0) + 1;
			if (p.isFemale) variantTracked.gender = (variantTracked.gender ?? 0) + 1;
			if (p.isTemporaryEvolution)
				variantTracked.temporaryEvolution =
					(variantTracked.temporaryEvolution ?? 0) + 1;
		}

		for (const sig of trackedStates) {
			if (sig === "BASE") continue;
			let qualifies = false;
			switch (sig) {
				case "SHINY":
				case "HUNDO":
					qualifies = true;
					break;
				case "SHADOW":
				case "PURIFIED":
					qualifies = p.isShadowAvailable;
					break;
				case "LUCKY":
					qualifies = p.isTradable;
					break;
				case "NUNDO":
					qualifies =
						p.pokemonClassification === null ||
						NUNDO_TRIO_LAKE_DEX.includes(p.pokedexNumber) ||
						(p.formCategory === "REGIONAL_FORM" &&
							NUNDO_GALARIAN_BIRDS_DEX.includes(p.pokedexNumber));
					break;
			}
			if (qualifies) {
				trackingTracked[sig] = (trackingTracked[sig] ?? 0) + 1;
			}
		}
	}

	return { regionTracked, speciesTracked, trackingTracked, variantTracked };
}

async function initializeTrainerProgress(trainerId: string, wipe: boolean) {
	if (wipe) {
		await prisma.trackedPokemonModel.deleteMany({ where: { trainerId } });
		await prisma.latestAcquisitionProjection.deleteMany({
			where: { trainerId },
		});
		console.log("🗑️  Tracked Pokémon wiped");
	}

	const [t, tracked] = await Promise.all([
		computeTotals(),
		reconstructTracked(trainerId),
	]);

	const trackingStates = [
		{ state: "SHINY", total: t.shinyTotal },
		{ state: "SHADOW", total: t.shadowOrPurifiedTotal },
		{ state: "PURIFIED", total: t.shadowOrPurifiedTotal },
		{ state: "LUCKY", total: t.luckyTotal },
		{ state: "HUNDO", total: t.speciesOrHundoTotal },
		{ state: "NUNDO", total: t.nundoTotal },
	];

	const variantKeys = [
		{ key: "alternateForm", total: t.altFormTotal },
		{ key: "costume", total: t.costumeTotal },
		{ key: "gender", total: t.femaleTotal },
		{ key: "temporaryEvolution", total: t.tempEvoTotal },
	];

	await prisma.$transaction(async (tx) => {
		await tx.progressProjection.upsert({
			create: {
				completionPercentage:
					t.speciesOrHundoTotal > 0
						? (tracked.speciesTracked / t.speciesOrHundoTotal) * 100
						: 0,
				speciesTotal: t.speciesOrHundoTotal,
				speciesTracked: tracked.speciesTracked,
				trainerId,
			},
			update: {
				completionPercentage:
					t.speciesOrHundoTotal > 0
						? (tracked.speciesTracked / t.speciesOrHundoTotal) * 100
						: 0,
				speciesTotal: t.speciesOrHundoTotal,
				speciesTracked: tracked.speciesTracked,
			},
			where: { trainerId },
		});

		await tx.trackingProgressProjection.deleteMany({ where: { trainerId } });
		await tx.trackingProgressProjection.createMany({
			data: trackingStates.map(({ state, total }) => {
				const speciesTracked = tracked.trackingTracked[state] ?? 0;
				return {
					completionPercentage: total > 0 ? (speciesTracked / total) * 100 : 0,
					speciesTotal: total,
					speciesTracked,
					trackingState: state,
					trainerId,
				};
			}),
		});

		await tx.regionalProgressProjection.deleteMany({ where: { trainerId } });
		await tx.regionalProgressProjection.createMany({
			data: REGIONS.map((region) => {
				const total = t.regionMap[region] ?? 0;
				const speciesTracked = tracked.regionTracked[region] ?? 0;
				return {
					completionPercentage: total > 0 ? (speciesTracked / total) * 100 : 0,
					region,
					speciesTotal: total,
					speciesTracked,
					trainerId,
				};
			}),
		});

		await tx.variantProgressProjection.deleteMany({ where: { trainerId } });
		await tx.variantProgressProjection.createMany({
			data: variantKeys.map(({ key, total }) => {
				const speciesTracked = tracked.variantTracked[key] ?? 0;
				return {
					completionPercentage: total > 0 ? (speciesTracked / total) * 100 : 0,
					speciesTotal: total,
					speciesTracked,
					trainerId,
					variantKey: key,
				};
			}),
		});
	});
}

async function main() {
	console.log("🚀 Seeding...");

	// Run with WIPE=true to also delete all tracked pokemon
	// bun db:seed (preserve existing) | WIPE=true bun db:seed (fresh start)
	const WIPE = process.env.WIPE === "true";

	await prisma.trainerModel.upsert({
		create: { id: TRAINER_ID, name: "Ash Ketchum" },
		update: { name: "Ash Ketchum" },
		where: { id: TRAINER_ID },
	});
	console.log("✅ Trainer seeded");

	await initializeTrainerProgress(TRAINER_ID, WIPE);
	console.log("✅ Trainer progress initialized");

	if (WIPE) {
		console.log("⚠️  All tracked Pokémon wiped. Fresh start!");
	} else {
		console.log("ℹ️  Projection reconstructed from existing tracked data.");
		console.log("ℹ️  Run with WIPE=true to delete all tracked data.");
	}

	console.log("🎉 Done!");
}

main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error("❌", e);
		await prisma.$disconnect();
		process.exit(1);
	});
