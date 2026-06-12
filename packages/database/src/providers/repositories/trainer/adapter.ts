import type { ITrainerRepository, Trainer } from "@context/auth";

import { prisma } from "#prisma-client";
import type { Team } from "#prisma-client/enums.ts";
import { toTrainer } from "./adapter.mapper";

export class PrismaTrainerRepositoryAdapter implements ITrainerRepository {
	public async findByAuthId(authId: string): Promise<Trainer | null> {
		const row = await prisma.trainerModel.findUnique({
			select: {
				authId: true,
				buddyPokemonId: true,
				createdAt: true,
				id: true,
				team: true,
				updatedAt: true,
			},
			where: { authId },
		});

		if (!row) return null;
		return toTrainer(row);
	}

	public async findByTrainerId(trainerId: string): Promise<Trainer | null> {
		const row = await prisma.trainerModel.findUnique({
			select: {
				authId: true,
				buddyPokemonId: true,
				createdAt: true,
				id: true,
				team: true,
				updatedAt: true,
			},
			where: { id: trainerId },
		});

		if (!row) return null;
		return toTrainer(row);
	}

	public async save(trainer: Trainer): Promise<void> {
		await prisma.trainerModel.upsert({
			create: {
				authId: trainer.get("authId"),
				buddyPokemonId: trainer.get("buddyPokemonRef"),
				id: trainer.id.value(),
				team: trainer.get("team") as Team,
			},
			update: {
				buddyPokemonId: trainer.get("buddyPokemonRef"),
				team: trainer.get("team") as Team,
			},
			where: { authId: trainer.get("authId") },
		});
	}
}
