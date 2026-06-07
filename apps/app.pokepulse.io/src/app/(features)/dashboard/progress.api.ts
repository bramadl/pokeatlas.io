"use server";

import { pulse } from "@pokepulse/core/server";

import type {
	GetProgressSummaryInput,
	GetProgressSummaryOutput,
} from "./progress.contract";

export async function getProgressSummary(
	input: GetProgressSummaryInput,
): Promise<GetProgressSummaryOutput> {
	const result = await pulse.progress.getProgressSummary(input);
	if (result.isError()) throw new Error(String(result.error()));
	return result.value();
}
