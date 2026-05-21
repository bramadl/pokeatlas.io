export interface SyncError {
	cause?: unknown;
	hint?: string;
	kind: SyncErrorKind;
	message: string;
	step?: string;
}

export type SyncErrorKind =
	| "CONNECTION_ERROR"
	| "CONNECTION_TIMEOUT"
	| "FETCH_ERROR"
	| "LOAD_BUG"
	| "TRANSFORM_BUG"
	| "UNKNOWN";
