import type { ITrainerRepository, Trainer } from "@context/auth";

import { prisma } from "#prisma-client";

import { toTrainer } from "./adapter.mapper";

export class PrismaTrainerRepositoryAdapter implements ITrainerRepository {
	public async findByAuthId(authId: string): Promise<Trainer | null> {
		const row = await prisma.trainerModel.findUnique({
			select: { authId: true, id: true },
			where: { authId },
		});

		if (!row) return null;
		return toTrainer(row);
	}

	public async save(trainer: Trainer): Promise<void> {
		await prisma.trainerModel.upsert({
			create: {
				authId: trainer.get("authId"),
				id: trainer.id.value(),
			},
			update: {},
			where: { authId: trainer.get("authId") },
		});
	}
}
