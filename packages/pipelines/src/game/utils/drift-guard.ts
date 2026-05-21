/**
 * @description
 * Tiny, dependency-free guards that produce actionable error messages when
 * PokéMiners payloads drift (missing fields, renamed keys, etc.).
 *
 * @example
 * Error shape:
 * ```bash
 *   PokemonFormTransformer
 *
 *   Missing:
 *   pokemonSettings.stats.baseAttack
 *
 *   Template:
 *   V0250_POKEMON_HO_OH
 * ```
 */
export interface DriftError extends Error {
	readonly isDriftError: true;
	readonly missingPath: string;
	readonly templateId: string;
	readonly transformer: string;
}

/**
 * @description
 * Throws a descriptive DriftError when `obj[field]` is null/undefined.
 *
 * Use at the top of a builder function to catch shape changes early.
 *
 * @example
 * ```ts
 * assertField("PokemonFormTransformer", templateId, settings, "stats")
 * ```
 */
export function assertField<T extends object>(
	transformer: string,
	templateId: string,
	obj: T,
	field: keyof T,
	parentPath = "pokemonSettings",
): void {
	if (obj[field] === undefined || obj[field] === null) {
		const fullPath = `${parentPath}.${String(field)}`;
		const message = [
			transformer,
			"",
			"Missing:",
			fullPath,
			"",
			"Template:",
			templateId,
		].join("\n");

		const err = Object.assign(new Error(message), {
			isDriftError: true as const,
			missingPath: fullPath,
			templateId,
			transformer,
		}) as DriftError;

		throw err;
	}
}

/**
 * @description
 * Safely read a dot-path from an object, returning `fallback` if any
 * segment is missing. Never throws.
 *
 * @example
 * ```ts
 * safeGet(settings, "stats.baseAttack", 0)
 * ```
 */
export function safeGet<T>(obj: unknown, path: string, fallback: T): T {
	const parts = path.split(".");
	let current: unknown = obj;

	for (const part of parts) {
		if (
			current === null ||
			current === undefined ||
			typeof current !== "object"
		) {
			return fallback;
		}
		current = (current as Record<string, unknown>)[part];
	}

	if (current === undefined || current === null) return fallback;
	return current as T;
}

/**
 * @description
 * Type-guard for downstream error handling (e.g. in error-classifier.ts).
 */
export function isDriftError(err: unknown): err is DriftError {
	return (
		err instanceof Error && (err as Partial<DriftError>).isDriftError === true
	);
}
