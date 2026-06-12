"use client";

import { useProgress } from "@bprogress/next";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { updateProfile } from "../api/profile.actions";

interface IdentitySectionProps {
	email: string;
	image?: string | null;
	joinedAt: Date;
	lastUpdatedAt?: Date;
	name: string;
}

export function IdentitySection({
	email,
	image,
	joinedAt,
	lastUpdatedAt,
	name,
}: IdentitySectionProps) {
	const [isPending, startTransaction] = useTransition();
	const [displayName, setDisplayName] = useState(name);

	const progress = useProgress();
	const router = useRouter();

	const isDirty = displayName !== name;
	const isEmpty = displayName.trim().length === 0;

	const handleSave = () => {
		if (isEmpty) return;
		progress.start();
		startTransaction(async () => {
			const { data, error } = await updateProfile(displayName);
			if (error) toast.error(error.message);
			if (data?.status) toast.success("Profile updated successfully");
			progress.stop();
			router.refresh();
		});
	};

	const handleCancel = () => setDisplayName(name);

	const initials = name
		.split(" ")
		.map((w) => (w[0] as string).toUpperCase())
		.join("");

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Identity</CardTitle>
				<CardDescription>Your trainer info and display name.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{/* Avatar row */}
				<div className="flex items-center justify-between gap-4">
					<div className="relative shrink-0">
						<Avatar size="lg">
							<AvatarImage alt={name} src={image ?? undefined} />
							<AvatarFallback className="text-lg">{initials}</AvatarFallback>
						</Avatar>
					</div>

					<div className="flex-1 flex flex-col gap-0.5">
						<span className="font-semibold text-sm">{name}</span>
						<span className="text-xs text-muted-foreground">{email}</span>
					</div>

					<Badge className="mt-1 w-fit text-xs" variant="outline">
						Joined at {format(joinedAt, "dd MMMM yyyy")}
					</Badge>
				</div>

				{/* Fields */}
				<div className="grid gap-3">
					<div className="grid gap-1.5">
						<Label htmlFor="display-name">Display name</Label>
						<Input
							disabled={isPending}
							id="display-name"
							onChange={(e) => setDisplayName(e.target.value)}
							placeholder="Your trainer name"
							value={displayName}
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
			</CardContent>

			<CardFooter className="flex items-center justify-between gap-4">
				<span className="text-xs text-muted-foreground">
					Last updated:{" "}
					{lastUpdatedAt
						? formatDistanceToNow(lastUpdatedAt, { addSuffix: true })
						: "-"}
				</span>
				<Separator className="flex-1" orientation="horizontal" />
				<div className="flex items-center gap-2">
					<Button
						disabled={isEmpty || !isDirty || isPending}
						onClick={handleCancel}
						variant="ghost"
					>
						Cancel
					</Button>
					<Button
						disabled={isEmpty || !isDirty || isPending}
						onClick={handleSave}
					>
						Save changes
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
