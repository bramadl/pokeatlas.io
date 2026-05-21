import type { GmTemplate } from "../../types/contract.types";
import { getJson, getText } from "./fetcher";

const GAME_MASTER_URL =
	"https://raw.githubusercontent.com/PokeMiners/game_masters/master/latest/latest.json";

const TIMESTAMP_URL =
	"https://raw.githubusercontent.com/PokeMiners/game_masters/master/latest/timestamp.txt";

export async function fetchGameMaster(): Promise<GmTemplate[]> {
	return getJson<GmTemplate[]>(GAME_MASTER_URL);
}

/**
 * @description
 * Fetches the timestamp string from PokeMiners' timestamp.txt.
 * This is a cheap text fetch (~100 bytes) used for change detection
 * before committing to the full game master download (~10MB).
 *
 * @example
 * "gm\n1234\n0.123.4\n2025-05-21\n12-00-00"
 */
export async function fetchGameMasterTimestamp(): Promise<string> {
	const raw = await getText(TIMESTAMP_URL);
	return raw.trim();
}
