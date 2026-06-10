import type {
	AchievementMetadata,
	AchievementType,
	TrainerAchievement,
} from "#progress:application/contracts/achievement";

export interface ITrainerAchievementProjection {
	award(
		trainerId: string,
		type: AchievementType,
		achievedAt: Date,
		metadata?: AchievementMetadata,
	): Promise<void>;
	getRecent(trainerId: string, limit: number): Promise<TrainerAchievement[]>;
}
