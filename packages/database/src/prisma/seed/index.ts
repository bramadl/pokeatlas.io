import { prisma } from "#prisma-client";
import { FormCategory } from "#prisma-client/enums";
import type {
	PokedexProjectionCreateManyInput,
	PokemonFormModelGetPayload,
} from "#prisma-client/models";

function getFormPriority({
	formCategory,
	isDefaultForm,
	isFemale,
	isCostume,
	isTemporaryEvolution,
}: PokemonFormModelGetPayload<{ include: { species: true } }>): number {
	if (isDefaultForm && formCategory === FormCategory.BASE_FORM) return 0;
	if (isCostume) return isFemale ? 7 : 6;
	if (isTemporaryEvolution) return 5;

	switch (formCategory) {
		case FormCategory.BASE_FORM:
			return isFemale ? 1 : 0;
		case FormCategory.ALTERNATE_FORM:
			return isFemale ? 4 : isDefaultForm ? 2 : 3;
		case FormCategory.REGIONAL_FORM:
			return isFemale ? 5 : 4;
		default:
			return 9;
	}
}

async function main() {
	console.log("🚀 Seeding...");

	const TRAINER_ID = "00000000-0000-0000-0000-000000000001";

	await prisma.trainerModel.upsert({
		create: { id: TRAINER_ID, name: "Ash Ketchum" },
		update: { name: "Ash Ketchum" },
		where: { id: TRAINER_ID },
	});

	console.log("✅ Trainer seeded");

	const allForms = await prisma.pokemonFormModel.findMany({
		include: { primaryType: true, secondaryType: true, species: true },
	});

	if (allForms.length === 0) {
		console.error("❌ PokemonFormModel empty — please sync the game first!");
		process.exit(1);
	}

	console.log(`📦 ${allForms.length} forms found`);

	await prisma.pokedexProjection.deleteMany({
		where: { trainerRef: TRAINER_ID },
	});

	const rows: PokedexProjectionCreateManyInput[] = allForms.map((form) => ({
		classification: form.species.pokemonClassification,
		dexNumber: form.species.pokedexNumber,
		familyId: form.species.familyId,
		form: form.form,
		formCategory:
			form.formCategory === FormCategory.ALTERNATE_FORM && form.isDefaultForm
				? FormCategory.BASE_FORM
				: form.formCategory,
		formPriority: getFormPriority(form),
		imageUrl: form.regularSprite,
		isCostume: form.isCostume,
		isFemale: form.isFemale,
		isTemporaryEvolution: form.isTemporaryEvolution,
		pokemonName: form.name,
		pokemonRef: form.form,
		primaryType: form.primaryType.name,
		secondaryType: form.secondaryType?.name ?? null,
		shinyImageUrl: form.shinySprite,
		sortGroup: form.formCategory === FormCategory.REGIONAL_FORM ? 1 : 0,
		trackedStates: [],
		trainerRef: TRAINER_ID,
	}));

	await prisma.pokedexProjection.createMany({ data: rows });
	console.log(`✅ ${rows.length} projection rows inserted`);

	console.log("🎉 Done!");
}

main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error("❌", e);
		await prisma.$disconnect();
		process.exit(1);
	});
