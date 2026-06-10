import type { Trainer } from "./trainer";

export interface ITrainerRepository {
	findByAuthId(authId: string): Promise<Trainer | null>;
	save(trainer: Trainer): Promise<void>;
}
