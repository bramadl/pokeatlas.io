import { TrainerID } from "@context/game";

import { selectSlots } from "./policies/slot-selector";
import type { ICatchOfTheDayProjection } from "./ports/projection";
import type { IPokemonSource } from "./ports/sources/pokemon-source";
import {
	type CatchOfTheDayScoredCandidate,
	getRelevantSignatures,
	scoreCandidates,
} from "./rules/scoring-engine";

export interface CatchOfTheDayTrigger {
	date: string;
	trainerId: string;
}

export class CatchOfTheDayResetHandler {
	public constructor(
		private readonly source: IPokemonSource,
		private readonly projection: ICatchOfTheDayProjection,
	) {}

	public async handle({
		trainerId,
		date,
	}: CatchOfTheDayTrigger): Promise<void> {
		const existing = await this.projection.findByTrainer(trainerId);
		if (existing && existing.date === date) return;

		const rows = await this.source.fetchCandidates(trainerId);
		const candidates = rows.filter((c) => {
			const relevant = getRelevantSignatures(c.traits);
			return relevant.some((sig) => !c.ownedSignatures.has(sig));
		});

		const scored: CatchOfTheDayScoredCandidate[] = scoreCandidates(
			candidates,
			TrainerID(trainerId),
			date,
		);

		await this.projection.save({
			date,
			generatedAt: new Date(),
			slots: selectSlots(scored, date),
			trainerId,
		});
	}
}
