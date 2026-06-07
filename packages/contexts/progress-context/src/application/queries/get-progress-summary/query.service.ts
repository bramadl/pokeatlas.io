import type {
	GetProgressSummaryInput,
	GetProgressSummaryOutput,
} from "./query";

export interface IProgressSummaryQueryService {
	get(input: GetProgressSummaryInput): Promise<GetProgressSummaryOutput>;
}
