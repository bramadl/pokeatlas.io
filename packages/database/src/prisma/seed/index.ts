import { prisma } from "#prisma-client";

async function main() {
	console.log("🚀 Seeding...");

	const TRAINER_ID = "00000000-0000-0000-0000-000000000001";

	await prisma.trainerModel.upsert({
		create: { id: TRAINER_ID, name: "Ash Ketchum" },
		update: { name: "Ash Ketchum" },
		where: { id: TRAINER_ID },
	});

	console.log("✅ Trainer seeded");

	console.log("🎉 Done!");
}

main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error("❌", e);
		await prisma.$disconnect();
		process.exit(1);
	});
