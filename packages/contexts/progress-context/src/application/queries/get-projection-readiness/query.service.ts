import type {
	GetProjectionReadinessInput,
	GetProjectionReadinessOutput,
} from "./query";

export interface IGetProjectionReadinessQueryService {
	get(
		input: GetProjectionReadinessInput,
	): Promise<GetProjectionReadinessOutput>;
}
