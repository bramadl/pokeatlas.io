export const SIGNATURE_EXAMPLES = [
	{
		desc: "A single tracked state. Simple.",
		sig: "SHINY",
		states: ["SHINY"],
	},
	{
		desc: "The holy grail — a perfect-IV shiny. Both states tracked independently.",
		sig: "HUNDO+SHINY",
		states: ["SHINY", "HUNDO"],
	},
	{
		desc: "A shiny shadow. Each state counts toward separate collection progress.",
		sig: "SHADOW+SHINY",
		states: ["SHADOW", "SHINY"],
	},
] as const;
