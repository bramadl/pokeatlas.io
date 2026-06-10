import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";

const neonMiddleware = auth.middleware({ loginUrl: "/" });

export async function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname === "/") {
		const { data } = await auth.getSession();
		if (data?.user) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
		return NextResponse.next();
	}

	if (pathname === "/auth/redirect") {
		return NextResponse.next();
	}

	return (neonMiddleware as (req: NextRequest) => Promise<NextResponse>)(req);
}

export const config = {
	matcher: [
		// "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api/auth|auth/redirect).*)",
		"/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api/auth|api/trainer|auth/redirect).*)",
	],
};
