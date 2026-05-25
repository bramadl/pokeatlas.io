import {
	getFormPriority,
	toProjectionFormCategory,
} from "@prisma/providers/queries/pokedex/query.helpers";
import { getPokemonDisplayName } from "@prisma/utils/get-pokemon-display-name";
import { prisma } from "@prisma-client";
import type { PokedexProjectionCreateManyInput } from "@prisma-client/models";

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
		dexNumber: form.species.pokedexNumber,
		formCategory: toProjectionFormCategory(form.formCategory),
		formPriority: getFormPriority(form),
		imageUrl: form.regularSprite,
		isFemale: form.isFemale,
		pokemonName: getPokemonDisplayName(form),
		pokemonRef: form.form,
		primaryType: form.primaryType.name,
		secondaryType: form.secondaryType?.name ?? null,
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
