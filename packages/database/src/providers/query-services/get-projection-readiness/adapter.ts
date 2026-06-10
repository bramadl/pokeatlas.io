import type {
	GetProjectionReadinessInput,
	GetProjectionReadinessOutput,
	IGetProjectionReadinessQueryService,
} from "@context/progress";

import { prisma } from "#prisma-client";

export class PrismaGetProjectionReadinessQueryServiceAdapter
	implements IGetProjectionReadinessQueryService
{
	public async get(
		input: GetProjectionReadinessInput,
	): Promise<GetProjectionReadinessOutput> {
		const row = await prisma.progressProjection.findUnique({
			select: { trainerId: true },
			where: { trainerId: input.trainerId },
		});

		return { ready: row !== null };
	}
}
