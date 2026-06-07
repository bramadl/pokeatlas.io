export interface LatestAcquisition {
	dexNumber: number;
	name: string;
	region: string;
	sprite: string | null;
	status: "TRACKED" | "UNTRACKED";
	timestamp: Date;
	trackedStates: string[];
	types: string[];
}
