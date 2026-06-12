import type { DomainError } from "@pokepulse/toolkit";

import type { InvalidTeamOptionError } from "#auth:core/invalid-team-option.ts";
import type { TeamOption, TeamRef } from "#auth:core/team.ts";
import type { TrainerNotFoundError } from "#auth:core/trainer-not-found.ts";

export interface UpdateTeamInput {
	team?: TeamOption;
	trainerId: string;
}

export interface UpdateTeamOutput {
	team: TeamRef;
	trainerId: string;
}

export type UpdateTeamErrors =
	| TrainerNotFoundError
	| InvalidTeamOptionError
	| DomainError;

export class UpdateTeamCommand {
	public constructor(public readonly input: UpdateTeamInput) {}
}
