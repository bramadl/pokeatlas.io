import type { Brand } from "../types/brand.type";

export type TypeRef = Brand<string, "TypeRef">;

export namespace TypeRef {
	export function from(value: string): TypeRef {
		return value as TypeRef;
	}
}
