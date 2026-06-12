export interface GetTrainerInput {
	authId: string;
}

export type GetTrainerOutput = {
	trainerId: string;
	buddyPokemonRef?: string;
	team?: string;
	joinedAt: Date;
	lastUpdatedAt?: Date;
} | null;

export class GetTrainerQuery {
	public constructor(public readonly input: GetTrainerInput) {}
}
