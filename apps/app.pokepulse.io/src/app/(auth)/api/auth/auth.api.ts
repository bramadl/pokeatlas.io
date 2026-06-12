"use server";

import { pulse } from "@pokepulse/core/server";
import { cookies } from "next/headers";

import { auth } from "@/lib/auth/server";

import {
	buildAccessCookieValue,
	COOKIE_MAX_AGE,
	COOKIE_NAME,
} from "../libs/access-cookie";

function sanitizeName(name: string): string {
	if (name.includes("@")) return (name.split("@")[0] as string).trim();
	return name;
}

export async function grantAuthAccess(): Promise<void> {
	const value = await buildAccessCookieValue();
	const jar = await cookies();
	jar.set(COOKIE_NAME, value, {
		httpOnly: true,
		maxAge: COOKIE_MAX_AGE,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
}

export async function registerTrainer(authId: string): Promise<void> {
	const result = await pulse.auth.registerTrainer({ authId });
	if (result.isError()) {
		throw new Error(`Failed to register trainer for authId: ${authId}`, {
			cause: result.error(),
		});
	}
}

export async function checkReadiness(): Promise<boolean> {
	const { data } = await auth.getSession();
	if (!data?.user) return false;

	const result = await pulse.auth.getTrainer({ authId: data.user.id });
	const trainer = result.value();
	if (result.isError() || trainer === null) return false;

	const readinessResult = await pulse.progress.readiness({
		trainerId: trainer.trainerId,
	});
	if (readinessResult.isError()) return false;

	return readinessResult.value().ready === true;
}

export async function getTrainer() {
	const { data } = await auth.getSession();
	if (!data?.user) return null;

	const { id: authId, name, email, image } = data.user;
	let displayName = name.trim() ? name : (email ?? "Trainer");
	displayName = sanitizeName(displayName);

	const result = await pulse.auth.getTrainer({ authId });
	const trainer = result.value();
	if (result.isError() || trainer === null) return null;

	return {
		trainerId: trainer.trainerId,
		user: { ...data.user, image, name: displayName },
	};
}

export async function signOut() {
	await auth.signOut();
}
