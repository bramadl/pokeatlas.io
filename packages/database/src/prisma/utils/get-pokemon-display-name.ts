import type {
	PokemonFormModel,
	PokemonSpeciesModel,
} from "@prisma-client/client";

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

export function getPokemonDisplayName(
	form: PokemonFormModel & { species: PokemonSpeciesModel },
): string {
	const sUpper = form.species.name.toUpperCase();
	const fUpper = form.name.toUpperCase();

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
