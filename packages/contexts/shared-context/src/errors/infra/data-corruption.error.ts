import type { DomainError } from "@pokeatlas/toolkit";

export class DataCorruptionError extends Error {
	constructor(aggregateName: string, id: string, cause: DomainError) {
		super(
			`[Data Corruption] Failed to reconstitute \`${aggregateName}\` for identifier: ${id}.`,
		);
		this.name = "DataCorruptionError";
		this.cause = cause.message;
	}
}
