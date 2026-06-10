export interface GetTrainerInput {
	authId: string;
}

export type GetTrainerOutput = {
	trainerId: string;
} | null;

export class GetTrainerQuery {
	public constructor(public readonly input: GetTrainerInput) {}
}
