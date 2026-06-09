import type {
	AchievementMetadata,
	AchievementType,
	ITrainerAchievementProjection,
	TrainerAchievement,
} from "@context/progress";

import { prisma } from "#prisma-client";
import type { InputJsonValue } from "#prisma-client/internal/prismaNamespace.ts";

export class PrismaTrainerAchievementProjectionAdapter
	implements ITrainerAchievementProjection
{
	public async award(
		trainerId: string,
		type: AchievementType,
		achievedAt: Date,
		metadata?: AchievementMetadata,
	): Promise<void> {
		await prisma.trainerAchievementProjection.upsert({
			create: {
				achievedAt,
				metadata: (metadata as InputJsonValue) ?? undefined,
				trainerId,
				type,
			},
			update: {},
			where: { trainerId_type: { trainerId, type } },
		});
	}

	public async getRecent(
		trainerId: string,
		limit: number,
	): Promise<TrainerAchievement[]> {
		const rows = await prisma.trainerAchievementProjection.findMany({
			orderBy: { achievedAt: "desc" },
			select: { achievedAt: true, metadata: true, type: true },
			take: limit,
			where: { trainerId },
		});

		return rows.map((row) => ({
			achievedAt: row.achievedAt,
			metadata: row.metadata as AchievementMetadata | undefined,
			type: row.type as AchievementType,
		}));
	}
}
