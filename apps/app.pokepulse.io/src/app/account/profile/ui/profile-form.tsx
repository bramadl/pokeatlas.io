"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

import { type BuddyOption, BuddySection } from "../sections/buddy.section";
import { IdentitySection } from "../sections/identity.section";
import { TeamSection, type TrainerTeam } from "../sections/team.section";
import { HighlightReels, type ReelEntry } from "./highlight-reels";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TrainerUser {
	email: string;
	image?: string | null;
	name: string;
}

interface ProfileFormProps {
	trainer: {
		trainerId: string;
		user: TrainerUser;
	};
}

// ---------------------------------------------------------------------------
// Mock data — replace with real API calls when BE is ready
// ---------------------------------------------------------------------------

const MOCK_BUDDY_OPTIONS: BuddyOption[] = [
	{
		id: "dragonite",
		name: "Dragonite",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
	},
	{
		id: "gengar",
		name: "Gengar",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
	},
	{
		id: "mewtwo",
		name: "Mewtwo",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
	},
	{
		id: "gyarados",
		name: "Gyarados",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
	},
	{
		id: "snorlax",
		name: "Snorlax",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
	},
	{
		id: "pikachu",
		name: "Pikachu",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
	},
];

const MOCK_REEL_ENTRIES: ReelEntry[] = [
	{
		id: "dragonite",
		name: "Dragonite",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
	},
	{
		id: "gengar",
		name: "Gengar",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
	},
	{
		id: "mewtwo",
		name: "Mewtwo",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
	},
	{
		id: "snorlax",
		name: "Snorlax",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
	},
	{
		id: "gyarados",
		name: "Gyarados",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
	},
	{
		id: "pikachu",
		name: "Pikachu",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
	},
	{
		id: "lapras",
		name: "Lapras",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
	},
	{
		id: "vaporeon",
		name: "Vaporeon",
		spriteUrl:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
	},
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProfileForm({ trainer }: ProfileFormProps) {
	const { user } = trainer;

	// Editable state
	const [name, setName] = useState(user.name);
	const [team, setTeam] = useState<TrainerTeam>(null);
	const [buddy, setBuddy] = useState<BuddyOption | null>(null);

	const isDirty = name !== user.name || team !== null || buddy !== null;

	const handleSave = () => {
		// TODO: wire to server action when BE fields are ready
		console.log("Saving profile:", { buddy, name, team });
	};

	const handleCancel = () => {
		setName(user.name);
		setTeam(null);
		setBuddy(null);
	};

	// TODO: replace with real trainer.createdAt from BE
	const joinedAt = new Date("2026-05-01");

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="text-xl font-bold">My Profile</h1>
				<p className="text-sm text-muted-foreground">
					Customize how you appear in PokéPulse.
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4">
				{/* Identity */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Identity</CardTitle>
						<CardDescription>
							Your trainer info and display name.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<IdentitySection
							email={user.email}
							image={user.image}
							joinedAt={joinedAt}
							name={name}
							onNameChange={setName}
						/>
					</CardContent>
				</Card>

				{/* Highlight Reels — read-only */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Highlight Reels</CardTitle>
						<CardDescription>
							A snapshot of your collection — randomly drawn from your tracked
							Pokémon.
						</CardDescription>
					</CardHeader>
					<CardContent className="h-full">
						<HighlightReels entries={MOCK_REEL_ENTRIES} />
					</CardContent>
				</Card>

				{/* Buddy */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Buddy</CardTitle>
						<CardDescription>
							Your partner Pokémon. Pick anyone from your collection.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<BuddySection
							buddy={buddy}
							onBuddyChange={setBuddy}
							options={MOCK_BUDDY_OPTIONS}
						/>
					</CardContent>
				</Card>

				{/* Team */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Team</CardTitle>
						<CardDescription>
							Your Pokémon GO team — the side you fight for.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<TeamSection onTeamChange={setTeam} team={team} />
					</CardContent>
				</Card>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-2 pb-8">
				<Button disabled={!isDirty} onClick={handleCancel} variant="ghost">
					Cancel
				</Button>
				<Button disabled={!isDirty} onClick={handleSave}>
					Save changes
				</Button>
			</div>
		</div>
	);
}
