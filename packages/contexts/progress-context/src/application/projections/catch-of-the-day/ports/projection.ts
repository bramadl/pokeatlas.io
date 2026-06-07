import type { CatchOfTheDayEntry } from "#progress:application/contracts/catch-of-the-day.ts";

export interface CatchOfTheDayPokemonSnapshot {
	date: string;
	generatedAt: Date;
	slots: CatchOfTheDayEntry[];
	trainerId: string;
}

export interface ICatchOfTheDayProjection {
	findByTrainer(
		trainerId: string,
	): Promise<CatchOfTheDayPokemonSnapshot | null>;
	save(snapshot: CatchOfTheDayPokemonSnapshot): Promise<void>;
}
