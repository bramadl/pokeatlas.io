import { getFormPriority } from "@prisma/utils/get-form-priority";
import { getPokemonDisplayName } from "@prisma/utils/get-pokemon-display-name";
import { prisma } from "@prisma-client";

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
		include: { species: true },
	});

	if (allForms.length === 0) {
		console.error("❌ PokemonFormModel empty — please sync the game first!");
		process.exit(1);
	}

	console.log(`📦 ${allForms.length} forms found`);

	await prisma.pokedexProjection.deleteMany({
		where: { trainerRef: TRAINER_ID },
	});

	const rows = allForms.map((form) => ({
		dexNumber: form.species.pokedexNumber,
		formPriority: getFormPriority(
			form.form,
			form.isCostume,
			form.isTemporaryEvolution,
		),
		imageUrl: form.regularSprite,
		pokemonName: getPokemonDisplayName(form),
		pokemonRef: form.form,
		shinyImageUrl: form.shinySprite,
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
