import { Aggregate, DomainError, validator as v } from "@pokepulse/toolkit";

import { TrainerRegistered } from "./trainer-registered";

export interface TrainerProps {
	authId: string;
}

export class Trainer extends Aggregate<TrainerProps> {
	private constructor(props: TrainerProps) {
		super(props);
	}

	public static override isValidProps(
		props: TrainerProps,
	): DomainError | undefined {
		if (!v.isObject(props)) {
			return new DomainError("invalid type", { context: Trainer.name });
		}

		if (!v.string(props.authId)) {
			return new DomainError("invalid type", {
				context: Trainer.name,
				field: "authId",
			});
		}

		if (v.string(props.authId).isEmpty()) {
			return new DomainError("missing required field", {
				context: Trainer.name,
				field: "authId",
			});
		}
	}

	public register(): void {
		if (this.isNew()) {
			this.emit(
				new TrainerRegistered(this.id.value(), {
					authId: this.get("authId"),
					trainerId: this.id.value(),
				}),
			);
		}
	}
}
