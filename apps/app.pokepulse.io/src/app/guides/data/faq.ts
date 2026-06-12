export const FAQ = [
	{
		a: "Yes — your collection is tied to your trainer account. Sign in with Google or a magic link to get started. Your data is private and only visible to you.",
		q: "Do I need an account to use PokéPulse?",
	},
	{
		a: "Absolutely. Tracking is additive — a single Pokémon can be marked as Base, Shiny, Lucky, and Hundo all at the same time. Each state is independent.",
		q: "Can I track the same Pokémon in multiple states?",
	},
	{
		a: "Shadow and Purified are separate tracking states. If you purify a Shadow Pokémon in-game, you'd mark it as Purified (not Shadow). They're tracked as distinct entries in your collection.",
		q: "What's the difference between Shadow and Purified?",
	},
	{
		a: "The Eraser (Backspace) removes all tracked states from a Pokémon in one go. Use it when you want to reset an entry completely — for example if you accidentally tracked the wrong thing.",
		q: "What does the Eraser brush do exactly?",
	},
	{
		a: "Some combinations are logically impossible in Pokémon GO. For example, a Pokémon can't be both Hundo (100% IV) and Nundo (0% IV), or both Shadow and Purified simultaneously. PokéPulse enforces these mutual exclusions automatically.",
		q: "Why can't I combine certain states?",
	},
	{
		a: "It uses a scoring pipeline that weighs Pokémon by how much catching them would move the needle for you — prioritizing nearest completions, your strongest collections, and your most-focused tracking states. The list is seeded by your Trainer ID + today's date, so it's consistent throughout the day and changes at midnight.",
		q: "How does Catch of the Day pick its 8 Pokémon?",
	},
	{
		a: "No — the list is fixed per day by design. The idea is to give you a consistent daily target to work toward, not a random reroll button.",
		q: "Can I manually refresh Catch of the Day?",
	},
	{
		a: "The regional Pokédex filter maps to actual Pokémon GO regional availability, not the full game catalog. Pokémon that don't fit a specific regional Dex show up under National.",
		q: "Why does the Regional Breakdown only show certain regions?",
	},
	{
		a: "Insights require a minimum of 10 tracked Pokémon per collection before showing up. This prevents misleading stats from tiny sample sizes. Keep tracking and they'll appear soon!",
		q: "Why don't I see Collection Insights yet?",
	},
	{
		a: "This usually happens if your session cookie is stale (e.g. after a long time away). Clear your browser cookies for this site and sign in again — that resets the session cleanly.",
		q: "My session seems stuck or I'm getting redirected in circles — what do I do?",
	},
] as const;
