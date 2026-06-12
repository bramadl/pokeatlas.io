import { type ICommand, type IResult, Result } from "@pokepulse/toolkit";

import { InvalidTeamOptionError } from "#auth:core/invalid-team-option.ts";
import { TeamRef } from "#auth:core/team.ts";
import { TrainerNotFoundError } from "#auth:core/trainer-not-found.ts";
import type { ITrainerRepository } from "#auth:core/trainer-repository.ts";

import type {
	UpdateTeamCommand,
	UpdateTeamErrors,
	UpdateTeamOutput,
} from "./command";

export class UpdateTeamHandler
	implements ICommand<UpdateTeamCommand, UpdateTeamOutput, UpdateTeamErrors>
{
	public constructor(private readonly repository: ITrainerRepository) {}

	public async execute({
		input,
	}: UpdateTeamCommand): Promise<IResult<UpdateTeamOutput, UpdateTeamErrors>> {
		const { team, trainerId } = input;

		const trainer = await this.repository.findByTrainerId(trainerId);
		if (!trainer) return Result.error(new TrainerNotFoundError(trainerId));
		if (!team) return Result.error(new InvalidTeamOptionError());

		const updatedTeam = TeamRef.from(team);
		trainer.updateTeam(updatedTeam);
		await this.repository.save(trainer);

		return Result.success({ team: updatedTeam, trainerId: trainerId });
	}
}
