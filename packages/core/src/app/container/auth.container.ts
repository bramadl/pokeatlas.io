import {
	AuthContext,
	GetTrainerHandler,
	RegisterTrainerHandler,
} from "@context/auth";
import {
	PrismaGetTrainerQueryServiceAdapter,
	PrismaTrainerRepositoryAdapter,
} from "@pokepulse/database";
import type { ContainerBuilder, EventBus } from "@pokepulse/toolkit";

export function buildAuthSlice<
	Base extends { "Infrastructure:EventBus": () => EventBus },
>(base: ContainerBuilder<Base>) {
	return base
		.add(
			"Adapter:Repository:Trainer",
			() => new PrismaTrainerRepositoryAdapter(),
		)

		.add(
			"QueryService:GetTrainer",
			() => new PrismaGetTrainerQueryServiceAdapter(),
		)

		.add(
			"Handler:Query:GetTrainer",
			(r) => new GetTrainerHandler(r["QueryService:GetTrainer"]),
		)

		.add(
			"Handler:Command:RegisterTrainer",
			(r) =>
				new RegisterTrainerHandler(
					r["Infrastructure:EventBus"],
					r["Adapter:Repository:Trainer"],
				),
		)

		.add("Context:Auth", (r) => {
			return new AuthContext({
				getTrainer: r["Handler:Query:GetTrainer"],
				registerTrainer: r["Handler:Command:RegisterTrainer"],
			});
		});
}
