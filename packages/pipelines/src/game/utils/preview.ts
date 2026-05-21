import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PREVIEW_DIR = join(process.cwd(), "src/game/previews");

export function writePreview(name: string, data: unknown): void {
	try {
		mkdirSync(PREVIEW_DIR, { recursive: true });
		writeFileSync(
			join(PREVIEW_DIR, `${name}.json`),
			`${JSON.stringify(data, null, 2)}\n`,
			"utf-8",
		);
	} catch (err) {
		console.warn(`[preview] Failed to write ${name}.json:`, err);
	}
}
