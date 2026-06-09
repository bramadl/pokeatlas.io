import type {
	GetCatchOfTheDayInput,
	GetCatchOfTheDayOutput,
	IGetCatchOfTheDayQueryService,
} from "@context/progress";

import { prisma } from "#prisma-client";
import { DataCorruptionError } from "#providers/errors/data-corruption.error";

import { toCatchOfTheDay } from "./adapter.mapper";

export class PrismaGetCatchOfTheDayQueryServiceAdapter
	implements IGetCatchOfTheDayQueryService
{
	public async fetch(
		input: GetCatchOfTheDayInput,
	): Promise<GetCatchOfTheDayOutput> {
		const row = await prisma.catchOfTheDayProjection.findUnique({
			where: { trainerId: input.trainerId },
		});

		if (!row) throw new DataCorruptionError("CatchOfTheDay", input.trainerId);
		return toCatchOfTheDay(row, input.date);
	}
}
