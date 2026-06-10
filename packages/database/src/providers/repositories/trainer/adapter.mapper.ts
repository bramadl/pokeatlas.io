import { Trainer } from "@context/auth";
import { Id } from "@pokepulse/toolkit";
import type { TrainerModelGetPayload } from "#prisma-client/models.ts";
import { DataCorruptionError } from "#providers/errors/data-corruption.error.ts";

export type GetTrainerQueryResult = TrainerModelGetPayload<{
	select: {
		authId: true;
		id: true;
	};
}>;

export function toTrainer(from: GetTrainerQueryResult): Trainer {
	const trainer = Trainer.create({
		authId: from.authId as string,
		id: Id(from.id),
	});

	if (trainer.isError()) {
		throw new DataCorruptionError(
			Trainer.name,
			from.authId as string,
			trainer.error(),
		);
	}

	return trainer.value();
}
