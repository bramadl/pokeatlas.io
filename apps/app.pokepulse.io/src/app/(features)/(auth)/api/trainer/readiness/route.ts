import { pulse } from "@pokepulse/core/server";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";

export async function GET() {
	const { data } = await auth.getSession();
	if (!data?.user) {
		return NextResponse.json({ ready: false }, { status: 401 });
	}

	const authId = data.user.id;

	let result = await pulse.auth.getTrainer({ authId });
	let trainer = result.value();

	if (result.isError() || trainer === null) {
		await pulse.auth.registerTrainer({ authId });

		result = await pulse.auth.getTrainer({ authId });
		trainer = result.value();

		if (result.isError() || trainer === null) {
			return NextResponse.json({ ready: false });
		}
	}

	const { trainerId } = trainer;
	const readinessResult = await pulse.progress.readiness({ trainerId });
	if (readinessResult.isError()) {
		return NextResponse.json({ ready: false });
	}

	return NextResponse.json(readinessResult.value());
}
