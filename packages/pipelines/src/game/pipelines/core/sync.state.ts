import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import type { EntityRunStatus } from "../../types/runner.types";

export type ExecutionMode = "normal" | "retry-failed" | "resume";

export interface PipelineStateEntry {
	lastDurationMs?: number;
	status: EntityRunStatus;
}

export type SyncStateRecord = Record<string, PipelineStateEntry>;

export interface SyncState {
	/**
	 * @description
	 * The last game master timestamp we successfully synced.
	 * Comes from PokeMiners' timestamp.txt — a cheap text file (~100 bytes)
	 * that changes every time a new game master is published.
	 *
	 * Used for change detection: if the current timestamp matches this value,
	 * the game master has not changed and we can skip the ETL entirely.
	 *
	 * Null means we have never synced, or the previous run predates this feature.
	 */
	lastGameMasterTimestamp: string | null;
	pipelines: SyncStateRecord;
}

const STATE_FILE = join(process.cwd(), "src/game/states/sync.state.json");

/**
 * @description
 * File-based pipeline state persistence.
 * Reads/writes `src/game/states/sync.state.json`
 *
 * @example
 * ```json
 * {
 *   "lastGameMasterTimestamp": "gm\n1234\n0.123.4\n2025-05-21\n12-00-00",
 *   "pipelines": {
 *     "pokemon-type": { "status": "completed", "lastDurationMs": 4900 },
 *     "pokemon-species": { "status": "completed", "lastDurationMs": 13100 },
 *     "pokemon-form": { "status": "completed", "lastDurationMs": 19700 }
 *   }
 * }
 * ```
 */
export class SyncStateManager {
	private state: SyncState = {
		lastGameMasterTimestamp: null,
		pipelines: {},
	};

	// ----- Load ---------------------------------------------------------------

	public load(): void {
		if (!existsSync(STATE_FILE)) {
			this.state = { lastGameMasterTimestamp: null, pipelines: {} };
			return;
		}

		try {
			const raw = readFileSync(STATE_FILE, "utf-8");
			const parsed = JSON.parse(raw) as unknown;

			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
				const obj = parsed as Record<string, unknown>;

				// ----- Migrate old flat format ----------------------------------------
				// Old format: { "pokemon-type": { status, lastDurationMs }, ... }
				// New format: { lastGameMasterTimestamp, pipelines: { ... } }
				const hasPipelinesKey =
					"pipelines" in obj && typeof obj.pipelines === "object";

				const pipelinesRaw = hasPipelinesKey
					? (obj.pipelines as Record<string, unknown>)
					: obj;

				const pipelines: SyncStateRecord = {};
				for (const [key, value] of Object.entries(pipelinesRaw)) {
					if (key === "lastGameMasterTimestamp") continue;
					if (typeof value === "string") {
						pipelines[key] = { status: value as EntityRunStatus };
					} else if (value && typeof value === "object" && "status" in value) {
						pipelines[key] = value as PipelineStateEntry;
					}
				}

				this.state = {
					lastGameMasterTimestamp:
						typeof obj.lastGameMasterTimestamp === "string"
							? obj.lastGameMasterTimestamp
							: null,
					pipelines,
				};
			}
		} catch {
			this.state = { lastGameMasterTimestamp: null, pipelines: {} };
		}
	}

	// ----- Game master timestamp ----------------------------------------------

	public getLastGameMasterTimestamp(): string | null {
		return this.state.lastGameMasterTimestamp;
	}

	public setLastGameMasterTimestamp(timestamp: string): void {
		this.state.lastGameMasterTimestamp = timestamp;
		this.persist();
	}

	// ----- Pipeline entries ---------------------------------------------------

	public get(name: string): PipelineStateEntry | undefined {
		return this.state.pipelines[name];
	}

	public getStatus(name: string): EntityRunStatus | undefined {
		return this.state.pipelines[name]?.status;
	}

	public getLastDuration(name: string): number | undefined {
		return this.state.pipelines[name]?.lastDurationMs;
	}

	public getAll(): SyncStateRecord {
		return { ...this.state.pipelines };
	}

	public set(name: string, status: EntityRunStatus, durationMs?: number): void {
		const existing = this.state.pipelines[name];
		this.state.pipelines[name] = {
			lastDurationMs: durationMs ?? existing?.lastDurationMs,
			status,
		};
		this.persist();
	}

	// ----- Filter -------------------------------------------------------------

	public filterForMode(names: string[], mode: ExecutionMode): string[] {
		if (mode === "normal") return names;

		return names.filter((name) => {
			const status = this.state.pipelines[name]?.status;

			if (mode === "resume") return status !== "completed";
			if (mode === "retry-failed") {
				return status === "failed" || status === "skipped";
			}

			return true;
		});
	}

	// ----- Persist ------------------------------------------------------------

	private persist(): void {
		try {
			mkdirSync(dirname(STATE_FILE), { recursive: true });
			writeFileSync(
				STATE_FILE,
				`${JSON.stringify(this.state, null, 2)}\n`,
				"utf-8",
			);
		} catch (err) {
			console.error("[SyncState] Failed to write state file: ", err);
		}
	}
}
