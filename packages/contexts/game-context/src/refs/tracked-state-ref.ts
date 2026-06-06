import type { Brand } from "@context/shared";

export type TrackedStateRef = Brand<string, "TrackedStateRef">;

export namespace TrackedStateRef {
	export function from(value: string): TrackedStateRef {
		if (!value || typeof value !== "string") {
			throw new Error(`Invalid TrackedStateRef primitive: ${value}`);
		}

		return value as TrackedStateRef;
	}
}
