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

/**
 * "Species" = trackable, non-variant, non-costume, non-female, non-temp-evo.
 * Includes BASE_FORM, default ALTERNATE_FORM, and REGIONAL_FORM.
 * Reused as base filter across species/regional/hundo/shiny/shadow/lucky/nundo totals.
 */
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
		// Species = Hundo (no exceptions, all species can be hundo)
		prisma.pokemonModel.count({ where: SPECIES_WHERE }),

		// Shiny: species that have a shiny sprite released
		prisma.pokemonModel.count({
			where: { ...SPECIES_WHERE, shinySprite: { not: null } },
		}),

		// Shadow = Purified (both gated by isShadowAvailable)
		prisma.pokemonModel.count({
			where: { ...SPECIES_WHERE, isShadowAvailable: true },
		}),

		// Lucky: must be tradable
		prisma.pokemonModel.count({
			where: { ...SPECIES_WHERE, isTradable: true },
		}),

		// Nundo: STANDARD classification + Lake Trio + Galarian Birds exceptions.
		// Uses AND wrapper to avoid OR field collision when spreading SPECIES_WHERE.
		prisma.pokemonModel.count({
			where: {
				...SPECIES_WHERE,
				AND: [
					{
						OR: [
							{ pokemonClassification: null }, // STANDARD
							{ pokedexNumber: { in: NUNDO_TRIO_LAKE_DEX } }, // Lake Trio
							{
								// Galarian Birds specifically (REGIONAL_FORM of 144/145/146)
								formCategory: FormCategory.REGIONAL_FORM,
								pokedexNumber: { in: NUNDO_GALARIAN_BIRDS_DEX },
							},
						],
					},
				],
			},
		}),

		// Regional: groupBy region, excluding Hisui (handled separately below)
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

		// Hisui: REGIONAL_FORM with HISUIAN in ref, exclude female variants
		prisma.pokemonModel.count({
			where: {
				formCategory: FormCategory.REGIONAL_FORM,
				isFemale: false,
				isTrackable: true,
				ref: { contains: "HISUIAN" },
			},
		}),

		// Variant: non-default Alternate Forms only (default = counted as species)
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

		// Variant: Costume
		prisma.pokemonModel.count({
			where: { isCostume: true, isTrackable: true },
		}),

		// Variant: Female
		prisma.pokemonModel.count({
			where: { isFemale: true, isTrackable: true },
		}),

		// Variant: Temporary Evolution
		prisma.pokemonModel.count({
			where: { isTemporaryEvolution: true, isTrackable: true },
		}),
	]);

	// Merge groupBy results into a map, then inject Hisui separately
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

async function initializeTrainerProgress(trainerId: string) {
	const t = await computeTotals();

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

	// Seed is destructive by intent — delete then recreate is cleaner than upsert loops
	await prisma.$transaction(async (tx) => {
		// TrainerProgress (parent row — upsert to preserve speciesTracked if re-seeding)
		await tx.trainerProgress.upsert({
			create: {
				completionPercentage: 0,
				speciesTotal: t.speciesOrHundoTotal,
				speciesTracked: 0,
				trainerId,
			},
			update: { speciesTotal: t.speciesOrHundoTotal },
			where: { trainerId },
		});

		// TrainerTrackingProgress
		await tx.trainerTrackingProgress.deleteMany({ where: { trainerId } });
		await tx.trainerTrackingProgress.createMany({
			data: trackingStates.map(({ state, total }) => ({
				completionPercentage: 0,
				speciesTotal: total,
				speciesTracked: 0,
				trackingState: state,
				trainerId,
			})),
		});

		// TrainerRegionalProgress
		await tx.trainerRegionalProgress.deleteMany({ where: { trainerId } });
		await tx.trainerRegionalProgress.createMany({
			data: REGIONS.map((region) => ({
				completionPercentage: 0,
				region,
				speciesTotal: t.regionMap[region] ?? 0,
				speciesTracked: 0,
				trainerId,
			})),
		});

		// TrainerVariantProgress
		await tx.trainerVariantProgress.deleteMany({ where: { trainerId } });
		await tx.trainerVariantProgress.createMany({
			data: variantKeys.map(({ key, total }) => ({
				percent: 0,
				total,
				tracked: 0,
				trainerId,
				variantKey: key,
			})),
		});
	});
}

async function main() {
	console.log("🚀 Seeding...");

	await prisma.trainerModel.upsert({
		create: { id: TRAINER_ID, name: "Ash Ketchum" },
		update: { name: "Ash Ketchum" },
		where: { id: TRAINER_ID },
	});
	console.log("✅ Trainer seeded");

	await initializeTrainerProgress(TRAINER_ID);
	console.log("✅ Trainer progress initialized");

	console.log("🎉 Done!");
}

main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error("❌", e);
		await prisma.$disconnect();
		process.exit(1);
	});
