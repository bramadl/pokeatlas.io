import type { SyncError, SyncErrorKind } from "./types/error.types";
import { isDriftError } from "./utils/drift-guard";

const CONNECTION_PATTERNS = [
	/ECONNREFUSED/i,
	/ENOTFOUND/i,
	/connection refused/i,
	/could not connect/i,
	/no pg_hba\.conf entry/i,
	/role .+ does not exist/i,
	/password authentication failed/i,
];

const TIMEOUT_PATTERNS = [
	/ETIMEDOUT/i,
	/connection timed out/i,
	/statement timeout/i,
	/idle-in-transaction timeout/i,
	/Can't reach database server/i,
];

const FETCH_ERROR_PATTERNS = [
	/Failed to fetch .+: HTTP \d{3}/i,
	/fetch failed/i,
	/ENOTFOUND/i,
];

function classify(err: unknown): SyncErrorKind {
	if (isDriftError(err)) return "TRANSFORM_BUG";

	const msg = err instanceof Error ? err.message : String(err);

	if (TIMEOUT_PATTERNS.some((p) => p.test(msg))) return "CONNECTION_TIMEOUT";
	if (CONNECTION_PATTERNS.some((p) => p.test(msg))) return "CONNECTION_ERROR";
	if (FETCH_ERROR_PATTERNS.some((p) => p.test(msg))) return "FETCH_ERROR";
	if (err instanceof TypeError || err instanceof ReferenceError)
		return "TRANSFORM_BUG";

	return "UNKNOWN";
}

const HINTS: Record<SyncErrorKind, string> = {
	CONNECTION_ERROR:
		"Check that `DATABASE_URL` is correct in `.env` and `PostgreSQL` is running.",
	CONNECTION_TIMEOUT:
		"Inserting large batches can exceed the statement timeout. Try lowering `BATCH_SIZE` or raising `statement_timeout` in `PostgreSQL`.",
	FETCH_ERROR:
		"Could not reach the `PokeMiners` data source. Check your internet connection, or the upstream URL may have changed.",
	LOAD_BUG:
		"Something went wrong while writing to the database. Make sure your schema migrations are up-to-date.",
	TRANSFORM_BUG:
		"Unexpected field shape from `game_master`. Check the failing transformer and open an issue.",
	UNKNOWN:
		"Unrecognised error. Re-run with `--verbose` for the full stack trace.",
};

export function classifyError(err: unknown, step?: string): SyncError {
	const kind = classify(err);
	const message = err instanceof Error ? err.message : String(err);

	return {
		cause: err,
		hint: HINTS[kind],
		kind,
		message,
		step,
	};
}
