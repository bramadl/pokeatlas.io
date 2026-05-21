import type { PrismaClient } from "@pokeatlas/database";

import type { ExtractedSources } from "../../types/contract.types";
import type { PipelineEvent } from "../../types/event.types";

export interface SourceCache {
	sources?: ExtractedSources;
}

/**
 * @description
 * Shared run context injected into every EntityPipeline.run() call.
 */
export interface AppContext {
	cache: SourceCache;

	/**
	 * @description
	 * Whether to skip writes (report only)
	 */
	dryRun: boolean;

	/**
	 * @description
	 * Emit a pipeline event to all registered handlers
	 */
	emit: (event: PipelineEvent) => void;

	/**
	 * @description
	 * Prisma client for all database operations
	 */
	prisma: PrismaClient;
}
