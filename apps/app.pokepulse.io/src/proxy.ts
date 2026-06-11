import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";

import {
	COOKIE_NAME,
	verifyAccessCookieValue,
} from "./app/(features)/(auth)/api/libs/access-cookie";

const NEON_COOKIE = "__Secure-neon-auth.session_token";

const neonMiddleware = auth.middleware({ loginUrl: "/" });

async function isAccessGranted(req: NextRequest): Promise<boolean> {
	const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
	if (!cookieValue) return false;
	return verifyAccessCookieValue(cookieValue);
}

export async function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname === "/") {
		const hasSession = req.cookies.has(NEON_COOKIE);
		const redirectUrl = new URL("/dashboard", req.url);
		if (hasSession) return NextResponse.redirect(redirectUrl);
		return NextResponse.next();
	}

	if (pathname === "/auth/redirect" || pathname === "/auth/provision") {
		const granted = await isAccessGranted(req);
		const redirectUrl = new URL("/", req.url);
		if (!granted) return NextResponse.redirect(redirectUrl);
		return NextResponse.next();
	}

	return (neonMiddleware as (req: NextRequest) => Promise<NextResponse>)(req);
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api/auth|api/trainer).*)",
	],
};
