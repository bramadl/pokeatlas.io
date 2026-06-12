"use client";

import { CameraIcon } from "@phosphor-icons/react";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IdentitySectionProps {
	email: string;
	image?: string | null;
	joinedAt: Date;
	name: string;
	onNameChange: (name: string) => void;
}

export function IdentitySection({
	email,
	image,
	joinedAt,
	name,
	onNameChange,
}: IdentitySectionProps) {
	const initials = name
		.split(" ")
		.map((w) => (w[0] as string).toUpperCase())
		.join("");

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<div className="relative shrink-0">
					<Avatar size="lg">
						<AvatarImage alt={name} src={image ?? undefined} />
						<AvatarFallback className="text-lg">{initials}</AvatarFallback>
					</Avatar>
					{/* photo change — wired up later */}
					<button
						aria-label="Change photo"
						className="absolute bottom-0 right-0 translate-x-1 translate-y-1 flex size-5 items-center justify-center rounded-full bg-background border border-border/50 shadow-sm hover:bg-muted transition-colors"
						type="button"
					>
						<CameraIcon size={10} />
					</button>
				</div>

				<div className="flex-1 flex flex-col">
					<span className="font-semibold text-sm">{name}</span>
					<span className="text-xs text-muted-foreground">{email}</span>
				</div>

				<Badge className="mt-1 w-fit text-xs" variant="outline">
					Joined {format(joinedAt, "MMM yyyy")}
				</Badge>
			</div>

			<div className="grid gap-3">
				<div className="grid gap-1.5">
					<Label htmlFor="display-name">Display name</Label>
					<Input
						id="display-name"
						onChange={(e) => onNameChange(e.target.value)}
						placeholder="Your trainer name"
						value={name}
					/>
				</div>

				<div className="grid gap-1.5">
					<Label className="flex items-center gap-1.5" htmlFor="email">
						Email
						<span className="text-xs text-muted-foreground font-normal">
							(can&apos;t be changed)
						</span>
					</Label>
					<Input
						className="cursor-not-allowed opacity-50"
						disabled
						id="email"
						value={email}
					/>
				</div>
			</div>
		</div>
	);
}
