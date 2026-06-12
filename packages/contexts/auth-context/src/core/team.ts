import type { Brand } from "@context/shared";

export const TEAM_OPTIONS = ["MYSTIC", "VALOR", "INSTINCT"] as const;

export type TeamOption = (typeof TEAM_OPTIONS)[number];

export type TeamRef = Brand<string, "TeamRef">;

export namespace TeamRef {
	export function from(value: string): TeamRef {
		if (!(TEAM_OPTIONS as unknown as string[]).includes(value)) {
			throw new Error("invalid team option");
		}

		return value as TeamRef;
	}
}
