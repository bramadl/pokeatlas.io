import type { Brand } from "@context/shared";

export type TrackingSignatureRef = Brand<string, "TrackingSignatureRef">;

export namespace TrackingSignatureRef {
	export function from(value: string): TrackingSignatureRef {
		if (!value || typeof value !== "string") {
			throw new Error(`Invalid TrackingSignatureRef primitive: ${value}`);
		}

		return value as TrackingSignatureRef;
	}
}
