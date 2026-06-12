import { TeamRef, Trainer } from "@context/auth";
import { PokemonRef } from "@context/game";
import { Id } from "@pokepulse/toolkit";
import type { TrainerModelGetPayload } from "#prisma-client/models.ts";
import { DataCorruptionError } from "#providers/errors/data-corruption.error.ts";

export type GetTrainerQueryResult = TrainerModelGetPayload<{
	select: {
		authId: true;
		id: true;
		buddyPokemonId: true;
		team: true;
		createdAt: true;
		updatedAt: true;
	};
}>;

export function toTrainer(from: GetTrainerQueryResult): Trainer {
	const trainer = Trainer.create({
		authId: from.authId as string,
		buddyPokemonRef: from.buddyPokemonId
			? PokemonRef.from(from.buddyPokemonId)
			: undefined,
		createdAt: from.createdAt,
		id: Id(from.id),
		team: from.team ? TeamRef.from(from.team) : undefined,
		updatedAt: from.updatedAt,
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
