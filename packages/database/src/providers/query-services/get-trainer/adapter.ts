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
			select: { id: true },
			where: { authId: input.authId },
		});

		if (!row) return null;
		return { trainerId: row.id };
	}
}
