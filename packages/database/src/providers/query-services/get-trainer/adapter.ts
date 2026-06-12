import type {
	GetTrainerInput,
	GetTrainerOutput,
	IGetTrainerQueryService,
} from "@context/auth";

import { prisma } from "#prisma-client";

export class PrismaGetTrainerQueryServiceAdapter
	implements IGetTrainerQueryService
{
	public async get(input: GetTrainerInput): Promise<GetTrainerOutput> {
		const row = await prisma.trainerModel.findUnique({
			select: {
				buddyPokemonId: true,
				createdAt: true,
				id: true,
				team: true,
				updatedAt: true,
			},
			where: { authId: input.authId },
		});

		if (!row) return null;
		return {
			buddyPokemonRef: row.buddyPokemonId ?? undefined,
			joinedAt: row.createdAt,
			lastUpdatedAt: row.updatedAt,
			team: row.team ?? undefined,
			trainerId: row.id,
		};
	}
}
