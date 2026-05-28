import { ExitPromptError } from "@inquirer/core";
import { checkbox, select } from "@inquirer/prompts";
import { prisma } from "@pokeatlas/database";

import { classifyError } from "../game/error.classifier";
import type { AppContext } from "../game/pipelines/core/app-context";
import { PipelineRunner } from "../game/pipelines/core/pipeline-runner";
import {
	type ExecutionMode,
	SyncStateManager,
} from "../game/pipelines/core/sync.state";
import type { EntityPipeline } from "../game/pipelines/entity.pipeline";
import { PokemonPipeline } from "../game/pipelines/pokemon.pipeline";
import { PokemonTypePipeline } from "../game/pipelines/pokemon-type.pipeline";
import type { PipelineEvent } from "../game/types/event.types";
import { CliRenderer } from "./renderer";

// ----- All available pipelines ----------------------------------------------

const ALL_PIPELINES: EntityPipeline<AppContext>[] = [
	new PokemonTypePipeline(),
	new PokemonPipeline(),
];

async function main() {
	// ----- Parse flags --------------------------------------------------------

	const args = process.argv.slice(2);
	const isDryRun = args.includes("--dry-run");
	const isVerbose = args.includes("--verbose");
	const isForce = args.includes("--force");

	// ----- State --------------------------------------------------------------

	const stateManager = new SyncStateManager();
	stateManager.load();

	const existingState = stateManager.getAll();
	const hasExistingState = Object.keys(existingState).length > 0;

	// ----- Prompt 1: Pipeline selection ----------------------------------------

	const selectedNames = await checkbox({
		choices: ALL_PIPELINES.map((p) => {
			const entry = existingState[p.name];
			const statusLabel = entry ? ` (${entry.status})` : "";

			return {
				checked: true,
				name: `${p.name}${statusLabel}`,
				value: p.name,
			};
		}),
		message: "Select pipelines to run:",
		validate: (choices) => {
			if (choices.length === 0) return "Select at least one pipeline.";
			return true;
		},
	});

	// ----- Prompt 2: Execution mode --------------------------------------------

	const modeChoices: Array<{
		name: string;
		value: ExecutionMode;
		disabled?: string;
	}> = [
		{ name: "normal – run all selected pipelines fresh", value: "normal" },
		{
			disabled: hasExistingState ? undefined : "(no previous state)",
			name: "retry failed – re-run only failed/skipped from last state",
			value: "retry-failed",
		},
		{
			disabled: hasExistingState ? undefined : "(no previous state)",
			name: "resume – skip completed, retry failed/skipped",
			value: "resume",
		},
	];

	const executionMode = await select<ExecutionMode>({
		choices: modeChoices,
		default: "normal",
		message: "Execution mode:",
	});

	// ----- Wire renderer ------------------------------------------------------

	const renderer = new CliRenderer({
		dryRun: isDryRun,
		force: isForce,
		verbose: isVerbose,
	});
	renderer.printHeader();

	// ----- Build context ------------------------------------------------------

	const eventHandlers: Array<(event: PipelineEvent) => void> = [
		(event) => renderer.onEvent(event),
	];

	const context: AppContext = {
		cache: {},
		dryRun: isDryRun,
		emit: (event) => {
			for (const handler of eventHandlers) handler(event);
		},
		prisma,
	};

	// ----- Build runner -------------------------------------------------------

	const runner = new PipelineRunner({
		context,
		eventHandlers,
		executionMode,
		force: isForce,
		stateManager,
	});

	// ----- Filter to selected pipelines ----------------------------------------

	const selectedPipelines = ALL_PIPELINES.filter((p) =>
		selectedNames.includes(p.name),
	);

	// ----- Run -----------------------------------------------------------------

	const results = await runner.run(selectedPipelines);
	const anyFailed = results.some((r) => r.status === "failed");

	process.exit(anyFailed ? 1 : 0);
}

// ----- Entry Point ----------------------------------------------------------

main().catch((err) => {
	if (err instanceof ExitPromptError) process.exit(0);

	const renderer = new CliRenderer({
		dryRun: false,
		force: false,
		verbose: false,
	});
	const syncError = classifyError(err);

	renderer.onEvent({
		durationMs: 0,
		error: syncError,
		kind: "pipeline:failed",
	});

	process.exit(1);
});
