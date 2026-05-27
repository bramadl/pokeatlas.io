import type { DomainError } from "@pokeatlas/toolkit";

export class DataCorruptionError extends Error {
	constructor(name: string, id?: string, cause?: DomainError) {
		super(
			`[Data Corruption] Failed to reconstitute \`${name}\`${id ? ` for identifier: ${id}.` : "."}`,
		);
		this.name = "DataCorruptionError";
		if (cause) this.cause = cause.message;
	}
}
