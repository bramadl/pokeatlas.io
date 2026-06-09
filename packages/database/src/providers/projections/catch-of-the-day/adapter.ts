import type {
	CatchOfTheDayEntry,
	CatchOfTheDayPokemonSnapshot,
	ICatchOfTheDayProjection,
} from "@context/progress";

import { prisma } from "#prisma-client";
import type { InputJsonValue } from "#prisma-client/internal/prismaNamespace";

export class PrismaCatchOfTheDayProjectionAdapter
	implements ICatchOfTheDayProjection
{
	public async findByTrainer(
		trainerId: string,
	): Promise<CatchOfTheDayPokemonSnapshot | null> {
		const row = await prisma.catchOfTheDayProjection.findUnique({
			where: { trainerId },
		});

		if (!row) return null;

		return {
			date: row.date,
			generatedAt: row.generatedAt,
			slots: row.slots as unknown as CatchOfTheDayEntry[],
			trainerId: row.trainerId,
		};
	}

	public async save(snapshot: CatchOfTheDayPokemonSnapshot): Promise<void> {
		await prisma.catchOfTheDayProjection.upsert({
			create: {
				date: snapshot.date,
				generatedAt: snapshot.generatedAt,
				slots: snapshot.slots as unknown as InputJsonValue,
				trainerId: snapshot.trainerId,
			},
			update: {
				date: snapshot.date,
				generatedAt: snapshot.generatedAt,
				slots: snapshot.slots as unknown as InputJsonValue,
			},
			where: { trainerId: snapshot.trainerId },
		});
	}
}
