export class TrainerNotFoundError extends Error {
	public constructor(identifier: string) {
		super(`Trainer not found: ${identifier}`);
	}
}
