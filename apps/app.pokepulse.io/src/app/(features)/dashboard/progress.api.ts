"use server";

import { pulse } from "@pokepulse/core/server";

import type {
	GetCatchOfTheDayInput,
	GetCatchOfTheDayOutput,
	GetProgressSummaryInput,
	GetProgressSummaryOutput,
} from "./progress.contract";

export async function getProgressSummary(
	input: GetProgressSummaryInput,
): Promise<GetProgressSummaryOutput> {
	const result = await pulse.progress.progressSummary(input);
	if (result.isError()) throw new Error(String(result.error()));
	return result.value();
}

export async function getCatchOfTheDay(
	input: GetCatchOfTheDayInput,
): Promise<GetCatchOfTheDayOutput> {
	const result = await pulse.progress.catchOfTheDay(input);
	if (result.isError()) throw new Error(String(result.error()));
	return result.value();
}
