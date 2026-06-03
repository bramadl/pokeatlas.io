import { type NextRequest, NextResponse } from "next/server";

import type { VariantValue } from "./bak/pokedex/toolbar/filters/filter.options";

const DEFAULT_VARIANTS: VariantValue[] = [];
const VARIANTS_COOKIE = "pokedex.variants";

export function proxy(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	if (pathname !== "/pokedex" || searchParams.has("variants")) {
		return NextResponse.next();
	}

	const cookieVal = request.cookies.get(VARIANTS_COOKIE)?.value;
	if (cookieVal === "none") return NextResponse.next();

	let variants: string[];
	try {
		if (cookieVal) {
			const parsed = JSON.parse(decodeURIComponent(cookieVal));
			variants = Array.isArray(parsed) ? parsed : DEFAULT_VARIANTS;
		} else {
			variants = DEFAULT_VARIANTS;
		}
	} catch {
		variants = DEFAULT_VARIANTS;
	}

	if (variants.length === 0) return NextResponse.next();

	const url = request.nextUrl.clone();
	url.searchParams.set("variants", variants.join(","));

	return NextResponse.redirect(url);
}

export const config = { matcher: "/pokedex" };
