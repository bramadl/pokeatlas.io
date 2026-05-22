import { prisma } from "../../src";

async function main() {
	console.log("Starting trainer data seeding...");

	const TRAINER_ID = "00000000-0000-0000-0000-000000000001";
	await prisma.trainerModel.upsert({
		create: {
			id: TRAINER_ID,
			name: "Ash Ketchum",
			trackedPokemons: {
				create: {
					isHundoTracked: false,
					isLuckyTracked: false,
					isPurifiedTracked: false,
					isShadowTracked: false,
					isShinyHundoTracked: false,
					isShinyLuckyHundoTracked: false,
					isShinyLuckyTracked: false,
					isShinyPurifiedTracked: false,
					isShinyShadowTracked: false,
					isShinyTracked: false,
					pokemonForm: "CHARMANDER_NORMAL",
				},
			},
		},
		include: {
			trackedPokemons: true,
		},
		update: {
			name: "Ash Ketchum",
		},
		where: { id: TRAINER_ID },
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
