import type { GetTrainerInput, GetTrainerOutput } from "./query";

export interface IGetTrainerQueryService {
	get(input: GetTrainerInput): Promise<GetTrainerOutput>;
}
