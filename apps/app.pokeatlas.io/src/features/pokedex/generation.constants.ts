export const GENERATION_RANGES = [
	{ label: "Generation I", max: 151, min: 1 },
	{ label: "Generation II", max: 251, min: 152 },
	{ label: "Generation III", max: 386, min: 252 },
	{ label: "Generation IV", max: 493, min: 387 },
	{ label: "Generation V", max: 649, min: 494 },
	{ label: "Generation VI", max: 721, min: 650 },
	{ label: "Generation VII", max: 809, min: 722 },
	{ label: "Generation VIII", max: 905, min: 810 },
	{ label: "Generation IX", max: 1025, min: 906 },
] as const;

export function getGenerationLabel(dexNumber: number): string {
	return (
		GENERATION_RANGES.find((g) => dexNumber >= g.min && dexNumber <= g.max)
			?.label ?? "Unknown"
	);
}
