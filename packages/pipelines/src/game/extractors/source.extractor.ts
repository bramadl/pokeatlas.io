import type { AppContext } from "../pipelines/core/app-context";
import type { ExtractedSources } from "../types/contract.types";
import { fetchGameMaster } from "./fetchers/game-master.fetcher";
import {
	fetchI18nEntries,
	fetchSpriteFilenames,
} from "./fetchers/pogo-assets.fetcher";

export async function extractSources(
	ctx: AppContext,
): Promise<ExtractedSources> {
	if (ctx.cache.sources) return ctx.cache.sources;

	const [gameMaster, i18n, spriteIndex] = await Promise.all([
		fetchGameMaster(),
		fetchI18nEntries(),
		fetchSpriteFilenames(),
	]);

	const sources: ExtractedSources = { gameMaster, i18n, spriteIndex };
	ctx.cache.sources = sources;

	return sources;
}
