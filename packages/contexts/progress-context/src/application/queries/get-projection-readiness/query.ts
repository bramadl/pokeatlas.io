export interface GetProjectionReadinessInput {
	trainerId: string;
}

export interface GetProjectionReadinessOutput {
	ready: boolean;
}

export class GetProjectionReadinessQuery {
	public constructor(public readonly input: GetProjectionReadinessInput) {}
}
