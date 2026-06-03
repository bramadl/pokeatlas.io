import pkg from "../../package.json";
import type { SyncError, SyncErrorKind } from "../game/types/error.types";
import type {
	PipelineEvent,
	StepProgressEvent,
} from "../game/types/event.types";
import type { RunSummary } from "../game/types/runner.types";

// ----- ANSI helpers ---------------------------------------------------------

const ESC = "\x1b[";
const R = `${ESC}0m`;

const c = {
	bold: (s: string) => `${ESC}1m${s}${R}`,
	cyan: (s: string) => `${ESC}36m${s}${R}`,
	dim: (s: string) => `${ESC}2m${s}${R}`,
	green: (s: string) => `${ESC}32m${s}${R}`,
	red: (s: string) => `${ESC}31m${s}${R}`,
	redBg: (s: string) => `${ESC}41;97m${s}${R}`,
	white: (s: string) => `${ESC}97m${s}${R}`,
	yellow: (s: string) => `${ESC}33m${s}${R}`,
	yellowBg: (s: string) => `${ESC}43;30m${s}${R}`,
};

const SYMBOLS = {
	arrow: "↳",
	bug: "🐛",
	check: "✔",
	cross: "✖",
	dash: "─",
	diamond: "◆",
	dot: "●",
	info: "ℹ",
	skip: "⊘",
	warn: "⚠",
};

const HR = c.dim(SYMBOLS.dash.repeat(50));

// ----- Formatters -----------------------------------------------------------

function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
	const m = Math.floor(ms / 60_000);
	const s = Math.round((ms % 60_000) / 1000);
	return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatCount(n: number, inserted: number, updated: number): string {
	const parts: string[] = [];
	if (inserted > 0) parts.push(c.green(`+${inserted} new`));
	if (updated > 0) parts.push(c.yellow(`±${updated} changed`));
	if (parts.length === 0) parts.push(c.dim("no changes"));
	return `${c.white(String(n))} ${c.dim(`(${parts.join(", ")})`)}`;
}

function pad(s: string, width: number): string {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: skip
	const plainLen = s.replace(/\x1b\[[0-9;]*m/g, "").length;
	return s + " ".repeat(Math.max(0, width - plainLen));
}

function clearLine(): void {
	process.stdout.write(`${" ".repeat(72)}\r`);
}

// 10-char wide bar, filled with █ and empty with ░
function progressBar(pct: number, width = 10): string {
	const filled = Math.round((pct / 100) * width);
	const empty = width - filled;
	return c.green("█".repeat(filled)) + c.dim("░".repeat(empty));
}

// ----- Phase label map ------------------------------------------------------

const PHASE_LABEL: Record<string, string> = {
	extracting: "Extracting",
	loading: "Loading",
	transforming: "Transforming",
};

// ----- Error kind display ---------------------------------------------------

const ERROR_KIND_DISPLAY: Record<
	SyncErrorKind,
	{ label: string; icon: string }
> = {
	CONNECTION_ERROR: { icon: SYMBOLS.cross, label: "Connection error" },
	CONNECTION_TIMEOUT: { icon: SYMBOLS.warn, label: "Connection timed out" },
	FETCH_ERROR: { icon: SYMBOLS.cross, label: "Failed to fetch upstream data" },
	LOAD_BUG: { icon: SYMBOLS.bug, label: "Bug in loader" },
	TRANSFORM_BUG: { icon: SYMBOLS.bug, label: "Bug in transformer" },
	UNKNOWN: { icon: SYMBOLS.cross, label: "Unexpected error" },
};

// ----- Public renderer ------------------------------------------------------

export class CliRenderer {
	private readonly isDryRun: boolean;
	private readonly isForce: boolean;
	private readonly isVerbose: boolean;

	constructor(
		opts: { dryRun?: boolean; force?: boolean; verbose?: boolean } = {},
	) {
		this.isDryRun = opts.dryRun ?? false;
		this.isForce = opts.force ?? false;
		this.isVerbose = opts.verbose ?? false;
	}

	// ----- Header -------------------------------------------------------------
	printHeader(): void {
		const titleText = `${SYMBOLS.diamond} PokePulse Sync v${pkg.version}`;
		const dryRunText = `• Dry Run: ${this.isDryRun ? "True" : "False"}`;
		const verboseText = `• Verbose: ${this.isVerbose ? "True" : "False"}`;
		const forceText = `• Force:   ${this.isForce ? "True" : "False"}`;

		const maxTextLength = Math.max(
			titleText.length,
			dryRunText.length,
			verboseText.length,
			forceText.length,
		);

		const innerWidth = maxTextLength + 4;
		const borderLine = "─".repeat(innerWidth);
		const indent = "\x20";

		console.log(`${indent}╭${borderLine}╮`);

		const styledTitle = `${c.cyan(SYMBOLS.diamond)}\x20${c.bold("PokePulse Sync")}\x20${c.dim(`v${pkg.version}`)}`;
		const titlePadding = innerWidth - titleText.length - 2;
		console.log(
			`${indent}${c.cyan("│")}\x20\x20${styledTitle}${"\x20".repeat(titlePadding)}${c.cyan("│")}`,
		);

		console.log(
			`${indent}${c.cyan("│")}${c.dim("─".repeat(innerWidth))}${c.cyan("│")}`,
		);

		const dryRunVal = this.isDryRun ? c.yellow("True") : "False";
		const styledDryRun = `${c.dim("•")}\x20Dry Run:\x20${dryRunVal}`;
		const dryRunPadding = innerWidth - dryRunText.length - 2;
		console.log(
			`${indent}${c.cyan("│")}\x20\x20${styledDryRun}${"\x20".repeat(dryRunPadding)}${c.cyan("│")}`,
		);

		const verboseVal = this.isVerbose ? c.green("True") : "False";
		const styledVerbose = `${c.dim("•")}\x20Verbose:\x20${verboseVal}`;
		const verbosePadding = innerWidth - verboseText.length - 2;
		console.log(
			`${indent}${c.cyan("│")}\x20\x20${styledVerbose}${"\x20".repeat(verbosePadding)}${c.cyan("│")}`,
		);

		// Force row — only shown when active, to avoid visual noise on normal runs
		if (this.isForce) {
			const styledForce = `${c.dim("•")}\x20Force:  \x20${c.yellow("True")}`;
			const forcePadding = innerWidth - forceText.length - 2;
			console.log(
				`${indent}${c.cyan("│")}\x20\x20${styledForce}${"\x20".repeat(forcePadding)}${c.cyan("│")}`,
			);
		}

		console.log(`${indent}╰${borderLine}╯`);
	}

	// ----- Event handler ------------------------------------------------------
	onEvent(event: PipelineEvent): void {
		switch (event.kind) {
			case "phase:start":
				this.printPhaseHeader(PHASE_LABEL[event.phase] ?? event.phase);
				break;

			case "step":
				if (event.status === "running") {
					this.printStepRunning(event.step, event.phase);
				} else if (event.status === "done") {
					this.printStepDone(
						event.step,
						event.phase,
						event.count ?? 0,
						event.inserted ?? 0,
						event.updated ?? 0,
						event.durationMs ?? 0,
					);
				} else if (event.status === "failed") {
					this.printStepFailed(event.step);
				} else if (event.status === "skipped") {
					this.printStepSkipped(event.step, "");
				}
				break;

			case "step:progress":
				this.printStepProgress(event);
				break;

			case "entity:start":
				this.printEntityStart(event.pipeline, event.lastDurationMs);
				break;

			case "entity:done":
				this.printEntityDone(event.pipeline, event.durationMs);
				break;

			case "entity:failed":
				this.printEntityFailed(event.pipeline, event.durationMs);
				break;

			case "entity:skipped":
				this.printEntitySkipped(event.pipeline, event.reason);
				break;

			case "pipeline:done":
				this.printSummary(event.summary, event.durationMs);
				break;

			case "pipeline:failed":
				this.printError(event.error, event.durationMs);
				break;

			case "pipeline:up-to-date":
				this.printUpToDate(event.timestamp, event.durationMs);
				break;
		}
	}

	// ----- Phase header -------------------------------------------------------
	private printPhaseHeader(label: string): void {
		console.log();
		console.log(`  ${c.cyan(SYMBOLS.dot)} ${c.bold(label)}`);
	}

	// ----- Entity-level lines -------------------------------------------------
	private printEntityStart(name: string, lastDurationMs?: number): void {
		console.log();
		const etaHint =
			lastDurationMs != null
				? c.dim(`  est. ~${formatDuration(lastDurationMs)} from last run`)
				: "";
		console.log(`  ${c.cyan(SYMBOLS.diamond)} ${c.bold(name)}${etaHint}`);
	}

	private printEntityDone(name: string, durationMs: number): void {
		console.log(
			`  ${c.green(SYMBOLS.check)} ${pad(c.white(name), 24)}  ${c.green("completed")}  ${c.dim(formatDuration(durationMs))}`,
		);
	}

	private printEntityFailed(name: string, durationMs: number): void {
		clearLine();
		console.log(
			`  ${c.red(SYMBOLS.cross)} ${pad(c.white(name), 24)}  ${c.red("failed")}  ${c.dim(formatDuration(durationMs))}`,
		);
	}

	private printEntitySkipped(name: string, reason: string): void {
		console.log(
			`  ${c.yellow(SYMBOLS.skip)} ${pad(c.white(name), 24)}  ${c.yellow("skipped")}  ${c.dim(reason)}`,
		);
	}

	// ----- Step lines ---------------------------------------------------------
	private printStepRunning(step: string, phase: string): void {
		process.stdout.write(
			`    ${c.dim(SYMBOLS.arrow)} ${c.dim(PHASE_LABEL[phase] ?? phase)} › ${pad(c.white(step), 20)}  ${c.dim("running…")}${" ".repeat(20)}\r`,
		);
	}

	private printStepProgress(e: StepProgressEvent): void {
		const pct = Math.round((e.itemsDone / e.itemsTotal) * 100);
		const bar = progressBar(pct);
		const batchLabel = c.dim(`batch ${e.batchDone}/${e.batchTotal}`);
		const pctLabel = c.white(`${pct}%`);
		const etaLabel =
			e.etaMs != null
				? c.dim(`~${formatDuration(e.etaMs)} left`)
				: c.dim(`${formatDuration(e.elapsedMs)} elapsed`);
		const phaseLabel = c.dim(PHASE_LABEL[e.phase] ?? e.phase);

		process.stdout.write(
			`    ${c.dim(SYMBOLS.arrow)} ${phaseLabel} › ${pad(c.white(e.step), 20)}  ${bar}  ${pctLabel}  ${batchLabel}  ${etaLabel}${" ".repeat(10)}\r`,
		);
	}

	private printStepDone(
		step: string,
		phase: string,
		count: number,
		inserted: number,
		updated: number,
		durationMs: number,
	): void {
		clearLine();

		const phaseTag = c.dim(`${PHASE_LABEL[phase] ?? phase}`);
		const countStr = this.isDryRun
			? c.yellow(`${count} (would write)`)
			: formatCount(count, inserted, updated);

		console.log(
			`    ${c.green(SYMBOLS.arrow)} ${phaseTag} › ${pad(c.white(step), 20)}  ${c.green(SYMBOLS.check)}  ${countStr}  ${c.dim(formatDuration(durationMs))}`,
		);
	}

	private printStepFailed(step: string): void {
		clearLine();
		console.log(
			`    ${c.red(SYMBOLS.arrow)} ${pad(c.white(step), 20)}  ${c.red(SYMBOLS.cross)}`,
		);
	}

	private printStepSkipped(step: string, reason: string): void {
		console.log(
			`    ${c.yellow(SYMBOLS.arrow)} ${pad(c.white(step), 20)}  ${c.yellow(SYMBOLS.skip)}  ${c.dim(reason)}`,
		);
	}

	// ----- Up-to-date notice --------------------------------------------------

	private printUpToDate(timestamp: string, durationMs: number): void {
		const parts = timestamp.split("\n");
		const date = parts[3] ?? "";
		const time = (parts[4] ?? "").replace(/-/g, ":");
		const apk = parts[2] ?? "";

		console.log();
		console.log(`  ${HR}`);
		console.log();
		console.log(
			`  ${c.cyan(SYMBOLS.info)}  ${c.bold("Game Master is up to date")} — no sync needed`,
		);
		if (date) {
			console.log(
				`     ${c.dim("Last update:")} ${c.white(`${date} ${time}`)}  ${c.dim(`APK ${apk}`)}`,
			);
		}
		console.log(`     ${c.dim(`Checked in ${formatDuration(durationMs)}`)}`);
		console.log(
			`     ${c.dim(`Run with ${c.white("--force")} to sync anyway`)}`,
		);
		console.log();
	}

	// ----- Success summary ----------------------------------------------------

	private printSummary(_: RunSummary, durationMs: number): void {
		console.log();
		console.log(`  ${HR}`);

		if (this.isDryRun) {
			console.log(
				`  ${c.yellow(SYMBOLS.info)}  ${c.yellow("Dry run complete.")} No data was written.`,
			);
		} else {
			console.log(
				`  ${c.green(SYMBOLS.check)} ${c.bold("Sync completed")}  ${c.dim(`in ${formatDuration(durationMs)}`)}`,
			);
		}

		console.log();
	}

	// ----- Error display ------------------------------------------------------

	private printError(err: SyncError, durationMs: number): void {
		const { label, icon } = ERROR_KIND_DISPLAY[err.kind];

		clearLine();

		console.log();
		console.log(`  ${HR}`);
		console.log();

		console.log(
			`  ${c.red(icon)}  ${c.redBg(` ${err.kind} `)}  ${c.red(c.bold(label))}`,
		);

		if (err.step) {
			console.log(`     ${c.dim("Failed at step:")} ${c.white(err.step)}`);
		}

		console.log();
		console.log(`     ${c.red(err.message)}`);

		if (err.hint) {
			console.log();
			console.log(`     ${c.yellow(`${SYMBOLS.warn}  ${err.hint}`)}`);
		}

		if (this.isVerbose && err.cause instanceof Error && err.cause.stack) {
			console.log();
			console.log(c.dim(`  ── Stack trace ${SYMBOLS.dash.repeat(34)}`));
			for (const line of err.cause.stack.split("\n").slice(1, 8)) {
				console.log(c.dim(`     ${line.trim()}`));
			}
		}

		console.log();
		console.log(
			`  ${c.dim(`${SYMBOLS.cross}  Sync failed`)}  ${c.dim(`after ${formatDuration(durationMs)}`)}`,
		);
		console.log();
	}
}
