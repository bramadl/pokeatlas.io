import type {
	GetProgressSummaryInput,
	GetProgressSummaryOutput,
} from "./query";

export interface IGetProgressSummaryQueryService {
	get(input: GetProgressSummaryInput): Promise<GetProgressSummaryOutput>;
}
