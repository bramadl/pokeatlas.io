"use server";

import { pulse } from "@pokepulse/core/server";

import { auth } from "@/lib/auth/server";

function sanitizeName(name: string): string {
	if (name.includes("@")) return (name.split("@")[0] as string).trim();
	return name;
}

export async function getTrainer() {
	const { data } = await auth.getSession();
	if (!data?.user) return null;

	const { id: authId, name, email } = data.user;
	let displayName = name.trim() ? name : (email ?? "Trainer");
	displayName = sanitizeName(displayName);

	let result = await pulse.auth.getTrainer({ authId });
	let trainer = result.value();
	if (!result.isError() && trainer !== null) {
		return {
			trainerId: trainer.trainerId,
			user: { ...data.user, name: displayName },
		};
	}

	await pulse.auth.registerTrainer({ authId });

	result = await pulse.auth.getTrainer({ authId });
	trainer = result.value();
	if (result.isError() || trainer === null) {
		throw new Error(`Failed to resolve trainer for authId: ${authId}`, {
			cause: result.error(),
		});
	}

	return {
		trainerId: trainer.trainerId,
		user: { ...data.user, name: displayName },
	};
}

export async function signOut() {
	await auth.signOut();
}
