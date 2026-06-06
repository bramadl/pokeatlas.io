export interface LatestAcquisition {
	dexNumber: string;
	name: string;
	region: string;
	sprite: string | null;
	timestamp: Date;
	trackedStates: string[];
	types: string[];
}
