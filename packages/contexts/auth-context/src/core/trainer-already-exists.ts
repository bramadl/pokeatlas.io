export class TrainerAlreadyExistsError extends Error {
	public constructor(identifier: string) {
		super(`Trainer already exists: ${identifier}`);
	}
}
