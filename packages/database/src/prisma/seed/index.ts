import { prisma } from "../client";

const KNOWN_ACRONYM: Record<string, string> = {
	BB: "BB",
	COPY: "Clone",
	COPY_2019: "Clone",
	GOFEST: "GO Fest",
	GOTOUR: "GO Tour",
	TSHIRT: "T-Shirt",
	VS: "VS",
	WCS: "WCS",
	WILDAREA: "Wild Area",
};

const KNOWN_REGION: Record<string, string> = {
	ALOLA: "Alolan",
	ALOLAN: "Alolan",
	GALAR: "Galarian",
	GALARIAN: "Galarian",
	HISUI: "Hisuian",
	HISUIAN: "Hisuian",
	PALDEA: "Paldean",
	PALDEAN: "Paldean",
};

const KNOWN_SPECIAL_SPECIES: Record<string, string> = {
	CHI_YU: "Chi-Yu",
	CHIEN_PAO: "Chien-Pao",
	CHIENPAO: "Chien-Pao",
	CHIYU: "Chi-Yu",
	HO_OH: "Ho-Oh",
	IRON_BOULDER: "Iron Boulder",
	IRON_BUNDLE: "Iron Bundle",
	IRON_CROWN: "Iron Crown",
	IRON_HANDS: "Iron Hands",
	IRON_JUGULIS: "Iron Jugulis",
	IRON_LEAVES: "Iron Leaves",
	IRON_MOTH: "Iron Moth",
	IRON_THORNS: "Iron Thorns",
	IRON_TREADS: "Iron Treads",
	IRON_VALIANT: "Iron Valiant",
	IRONBOULDER: "Iron Boulder",
	IRONBUNDLE: "Iron Bundle",
	IRONCROWN: "Iron Crown",
	IRONHANDS: "Iron Hands",
	IRONJUGULIS: "Iron Jugulis",
	IRONLEAVES: "Iron Leaves",
	IRONMOTH: "Iron Moth",
	IRONTHORNS: "Iron Thorns",
	IRONTREADS: "Iron Treads",
	IRONVALIANT: "Iron Valiant",
	MIME_JR: "Mime Jr.",
	MR_MIME: "Mr. Mime",
	MR_RIME: "Mr. Rime",
	NIDORAN_FEMALE: "Nidoran ♀",
	NIDORAN_MALE: "Nidoran ♂",
	PORYGON_Z: "Porygon-Z",
	TING_LU: "Ting-Lu",
	TINGLU: "Ting-Lu",
	TYPE_NULL: "Type: Null",
	WO_CHIEN: "Wo-Chien",
	WOCHIEN: "Wo-Chien",
};

const REGIONAL_PATTERN = /ALOLA|GALAR|HISUI|PALDEA/;

export function getFormPriority(
	formName: string,
	isCostume: boolean,
	isTemporaryEvolution: boolean,
): number {
	const form = formName.toUpperCase();

	if (
		!form.includes("FEMALE") &&
		!isCostume &&
		!isTemporaryEvolution &&
		!/ALOLA|GALAR|HISUI|PALDEA/.test(form)
	) {
		return 0;
	}

	if (form.includes("FEMALE") && !isCostume) return 1;
	if (isCostume && !form.includes("FEMALE")) return 2;
	if (isCostume && form.includes("FEMALE")) return 3;
	if (REGIONAL_PATTERN.test(form)) return 4;
	if (isTemporaryEvolution) return 5;
	return 9;
}

function parsePokemonDisplayName(speciesRaw: string, formRaw: string): string {
	const sUpper = speciesRaw.toUpperCase();
	const fUpper = formRaw.toUpperCase();

	let speciesName =
		KNOWN_SPECIAL_SPECIES[sUpper] ||
		sUpper
			.split("_")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(" ");

	const modifierRaw = fUpper.startsWith(sUpper)
		? fUpper.slice(sUpper.length)
		: fUpper;

	let tokens = modifierRaw.split("_").filter((t) => t);
	if (tokens.includes("FEMALE")) {
		if (!speciesName.includes("♀")) speciesName = `${speciesName} ♀`;
		tokens = tokens.filter((t) => t !== "FEMALE");
	} else if (tokens.includes("MALE")) {
		tokens = tokens.filter((t) => t !== "MALE");
	}

	const redundantTokens = ["NORMAL", "BASE"];
	tokens = tokens.filter((t) => !redundantTokens.includes(t));

	if (tokens.length === 0) return speciesName;

	const formatToken = (token: string): string => {
		if (KNOWN_ACRONYM[token]) return KNOWN_ACRONYM[token];
		return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
	};

	if (sUpper === "MEWTWO" && tokens.length === 1 && tokens[0] === "A") {
		return "Armored Mewtwo";
	}

	const regionalKey = tokens.find((t) => KNOWN_REGION[t]);
	if (regionalKey) {
		const prefix = KNOWN_REGION[regionalKey];
		tokens = tokens.filter((t) => t !== regionalKey);

		if (tokens.length > 0) {
			return `${prefix} ${speciesName} (${tokens.map(formatToken).join(" ")})`;
		}

		return `${prefix} ${speciesName}`;
	}

	if (tokens[0] === "MEGA" || tokens[0] === "PRIMAL") {
		const type = tokens[0] === "MEGA" ? "Mega" : "Primal";
		const suffix = tokens.slice(1).map(formatToken).join(" ");
		return `${type} ${speciesName}${suffix ? ` ${suffix}` : ""}`;
	}

	return `${speciesName} (${tokens.map(formatToken).join(" ")})`;
}

async function main() {
	console.log("🚀 STARTING FRESH SEEDING WITH PURE PARSER UTILITY...");

	const TRAINER_ID = "00000000-0000-0000-0000-000000000001";
	const POKEMON_FORM = "CHARMANDER_NORMAL";

	console.log("🔍 Fetching master pokemon forms with species relation...");
	const allMasterForms = await prisma.pokemonFormModel.findMany({
		include: { species: true },
	});

	if (allMasterForms.length === 0) {
		console.error("❌ Error: PokemonFormModel masih kosong!");
		process.exit(1);
	}

	console.log("⚡ Executing Database Transaction (Batch Speed Mode)...");

	await prisma.$transaction(async (tx) => {
		console.log("📦 Seeding Write-Model (tracked_pokemons)...");
		await tx.trainerModel.upsert({
			create: {
				id: TRAINER_ID,
				name: "Ash Ketchum",
				trackedPokemons: {
					create: {
						isTracked: true,
						pokemonForm: POKEMON_FORM,
					},
				},
			},
			update: { name: "Ash Ketchum" },
			where: { id: TRAINER_ID },
		});

		console.log("🧹 Clearing old Read-Model views...");
		await tx.trainerPokedexProjection.deleteMany({
			where: { trainerRef: TRAINER_ID },
		});

		console.log("🍳 Processing display names via utility function...");
		const pokedexEntries = allMasterForms.map((master) => {
			const isCharmander = master.form === POKEMON_FORM;

			const finalName = parsePokemonDisplayName(
				master.species.name,
				master.form,
			);

			const priority = getFormPriority(
				master.form,
				master.isCostume ?? false,
				master.isTemporaryEvolution ?? false,
			);

			return {
				dexNumber: master.species.pokedexNumber,
				formPriority: priority,
				imageUrl: master.regularSprite,
				isTracked: isCharmander,
				pokemonName: finalName,
				pokemonRef: master.form,
				shinyImageUrl: master.shinySprite,
				trainerRef: TRAINER_ID,
			};
		});

		console.log(
			`🚀 Bulk inserting ${pokedexEntries.length} cleanly formatted entries...`,
		);
		await tx.trainerPokedexProjection.createMany({ data: pokedexEntries });
	});

	console.log("🎉 All data wired and seeded successfully in milliseconds!");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error("❌ Seeding failed:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
