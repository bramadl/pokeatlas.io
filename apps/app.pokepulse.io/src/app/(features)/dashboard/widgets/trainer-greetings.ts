export type GreetingContext = {
	tracked: number;
	missing: number;
	percentage: number;
};

type GreetingTier = {
	max: number;
	pool: ((ctx: GreetingContext) => string)[];
};

const GREETING_TIERS: GreetingTier[] = [
	{
		max: 1,
		pool: [
			() =>
				"Your journey begins! Every legend starts with a single Pokémon. Go catch 'em all!",
			() =>
				"A new adventure awaits! The world is full of Pokémon waiting to be discovered.",
			() =>
				"Welcome, Trainer! Your Pokédex is empty — for now. Let the hunt begin.",
			() =>
				"The path to becoming a Pokémon Master starts with your very first catch. Ready?",
		],
	},
	{
		max: 26,
		pool: [
			({ tracked }) =>
				`${tracked} species and counting! You're just warming up, Trainer.`,
			({ missing }) =>
				`Still ${missing} species out there. The wild is calling!`,
			({ tracked }) =>
				`${tracked} down, a whole world to go. Every catch counts!`,
			() => "Early days, but every master had to start somewhere. Keep it up!",
		],
	},
	{
		max: 51,
		pool: [
			({ percentage }) =>
				`${percentage.toFixed(0)}% done — you're finding your rhythm, Trainer!`,
			({ tracked }) => `${tracked} species! The Pokédex is filling up nicely.`,
			({ missing }) => `${missing} species left to hunt. You've got this.`,
			() =>
				"Quarter of the way there! The rarest ones are still out there waiting.",
		],
	},
	{
		max: 76,
		pool: [
			({ percentage }) =>
				`${percentage.toFixed(0)}% complete — you're past the halfway mark! Impressive.`,
			({ tracked, missing }) =>
				`${tracked} caught, ${missing} to go. The grind is real and so are you.`,
			() =>
				"More than half the Pokédex conquered. The legendaries are calling your name.",
			() =>
				"You're deep in the dex now. Regionals, shinies, shadows — bring it on!",
		],
	},
	{
		max: 100,
		pool: [
			({ missing }) =>
				`Only ${missing} species left! You can smell the finish line, Trainer.`,
			({ percentage }) =>
				`${percentage.toFixed(0)}% — you're in the endgame now. No turning back!`,
			({ tracked }) =>
				`${tracked} species! The final stretch is the hardest. Push through!`,
			() =>
				"So close to completing the National Dex. Legends are made in moments like these.",
		],
	},
	{
		max: Number.POSITIVE_INFINITY,
		pool: [
			() => "National Dex complete. You are a true Pokémon Master. 🏆",
			() =>
				"Every species caught. Every region conquered. You're a living legend.",
			() => "Gotta catch 'em all? Done. What's next, Trainer?",
			() => "The Pokédex is complete. Professor Oak is in tears. You did it.",
		],
	},
];

export function pickGreeting(ctx: GreetingContext): string {
	const tier =
		GREETING_TIERS.find((t) => ctx.percentage < t.max) ?? GREETING_TIERS.at(-1);

	if (!tier) throw new Error("No greeting tier found");

	const today = new Date().toISOString().split("T")[0] as string;
	const seed =
		ctx.tracked + today.split("-").reduce((a, b) => a + Number(b), 0);

	const pick = tier.pool[seed % tier.pool.length];
	if (!pick) throw new Error("No greeting pick found");

	return pick(ctx);
}
