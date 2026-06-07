import type { GetCatchOfTheDayInput, GetCatchOfTheDayOutput } from "./query";

export interface IGetCatchOfTheDayQueryService {
	fetch(input: GetCatchOfTheDayInput): Promise<GetCatchOfTheDayOutput>;
}
