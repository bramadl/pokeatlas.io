import type {
	ExtractedSources,
	TransformedPokemon,
} from "../types/contract.types";
import { toTitleCase } from "../utils/string";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPECIES_REGEX = /^V(\d{4})_POKEMON_([A-Z0-9_]+)$/;

const SPRITE_BASE =
	"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets";

const POKEAPI_ARTWORK_BASE =
	"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

const REGIONAL_SUFFIXES = new Set([
	"ALOLAN",
	"ALOLA",
	"GALARIAN",
	"GALAR",
	"HISUIAN",
	"HISUI",
	"PALDEAN",
	"PALDEA",
	"KANTONIAN",
	"KANTO",
]);

const POKEMON_CLASS_MAP: Record<
	string,
	"LEGENDARY" | "MYTHIC" | "ULTRA_BEAST"
> = {
	POKEMON_CLASS_LEGENDARY: "LEGENDARY",
	POKEMON_CLASS_MYTHIC: "MYTHIC",
	POKEMON_CLASS_ULTRA_BEAST: "ULTRA_BEAST",
};

const UNFLAGGED_COSTUME_OVERRIDES = new Set(["PSYDUCK_SWIM_2025"]);

type FormCategory = TransformedPokemon["formCategory"];

// ─── Lookup builders ──────────────────────────────────────────────────────────

function buildSpeciesMap(sources: ExtractedSources): Map<
	string,
	{
		familyId: string;
		pokemonClassification: "LEGENDARY" | "MYTHIC" | "ULTRA_BEAST" | null;
		isShadowAvailable: boolean;
	}
> {
	const map = new Map();
	for (const entry of sources.gameMaster) {
		const settings = entry.data.pokemonSettings;
		if (!settings?.form || map.has(settings.pokemonId)) continue;
		map.set(settings.pokemonId, {
			familyId: settings.familyId,
			isShadowAvailable: !!settings.shadow,
			pokemonClassification: settings.pokemonClass
				? (POKEMON_CLASS_MAP[settings.pokemonClass] ?? null)
				: null,
		});
	}
	return map;
}

function buildFormMetaMap(
	sources: ExtractedSources,
): Map<string, { isCostume: boolean }> {
	const map = new Map<string, { isCostume: boolean }>();
	for (const entry of sources.gameMaster) {
		const fs = entry.data.formSettings;
		if (!fs?.forms) continue;
		for (const f of fs.forms) {
			map.set(f.form, { isCostume: f.isCostume ?? false });
		}
	}
	return map;
}

function buildDefaultFormMap(sources: ExtractedSources): Map<string, string> {
	const map = new Map<string, string>();
	for (const entry of sources.gameMaster) {
		const fs = entry.data.formSettings;
		if (!fs?.forms?.length) continue;
		// biome-ignore lint/style/noNonNullAssertion: length checked above
		map.set(fs.pokemon, fs.forms[0]!.form);
	}
	return map;
}

function buildIbfcMap(sources: ExtractedSources): Map<
	string,
	{
		defaultForm: string;
		battleOnlyForms: Set<string>;
	}
> {
	const map = new Map();
	for (const entry of sources.gameMaster) {
		const settings = entry.data.pokemonSettings;
		if (!settings?.ibfc?.combatEnable) continue;
		const defaultForm = settings.ibfc.defaultForm;
		if (!defaultForm) continue;
		const alternates = settings.ibfc.alternateForm
			? Array.isArray(settings.ibfc.alternateForm)
				? settings.ibfc.alternateForm
				: [settings.ibfc.alternateForm]
			: [];
		map.set(settings.pokemonId, {
			battleOnlyForms: new Set(alternates),
			defaultForm,
		});
	}
	return map;
}

function buildSpeciesWithNormalTemplate(
	sources: ExtractedSources,
): Set<string> {
	const set = new Set<string>();
	for (const entry of sources.gameMaster) {
		const settings = entry.data.pokemonSettings;
		if (!settings?.form) continue;
		if (settings.form.endsWith("_NORMAL")) set.add(settings.pokemonId);
	}
	return set;
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────

function resolveCanonicalFormSlug(formSlug: string, pokemonId: string): string {
	if (formSlug.startsWith(pokemonId)) return formSlug;
	const underscoreIdx = formSlug.indexOf("_");
	const suffix = underscoreIdx >= 0 ? formSlug.slice(underscoreIdx + 1) : null;
	return suffix ? `${pokemonId}_${suffix}` : pokemonId;
}

function formSuffix(formSlug: string, pokemonId: string): string | null {
	const baseToken = pokemonId.split("_")[0] as string;
	let rest = formSlug;
	if (formSlug.startsWith(pokemonId)) {
		rest = formSlug.slice(pokemonId.length + 1);
	} else if (formSlug.startsWith(baseToken)) {
		rest = formSlug.slice(baseToken.length + 1);
	}
	return rest === "NORMAL" || rest === "" ? null : rest;
}

// ─── Classifiers ─────────────────────────────────────────────────────────────

function classifyFormCategory({
	canonicalFormSlug,
	pokemonId,
}: {
	canonicalFormSlug: string;
	pokemonId: string;
}): FormCategory {
	const suffix = formSuffix(canonicalFormSlug, pokemonId);
	if (suffix) {
		const firstToken = suffix.split("_")[0] as string;
		if (REGIONAL_SUFFIXES.has(firstToken)) return "REGIONAL_FORM";
		return "ALTERNATE_FORM";
	}
	return "BASE_FORM";
}

function resolveIsTrackable(
	canonicalFormSlug: string,
	ibfcEntry: { defaultForm: string; battleOnlyForms: Set<string> } | undefined,
): boolean {
	if (!ibfcEntry) return true;
	return (
		canonicalFormSlug === ibfcEntry.defaultForm ||
		!ibfcEntry.battleOnlyForms.has(canonicalFormSlug)
	);
}

function resolveFormPriority({
	formCategory,
	isDefaultForm,
	isFemale,
	isCostume,
	isTemporaryEvolution,
}: Pick<
	TransformedPokemon,
	| "formCategory"
	| "isDefaultForm"
	| "isFemale"
	| "isCostume"
	| "isTemporaryEvolution"
>): number {
	if (isDefaultForm && formCategory === "BASE_FORM") return 0;
	if (isCostume) return isFemale ? 7 : 6;
	if (isTemporaryEvolution) return 5;
	switch (formCategory) {
		case "BASE_FORM":
			return isFemale ? 1 : 0;
		case "ALTERNATE_FORM":
			return isFemale ? 4 : isDefaultForm ? 2 : 3;
		case "REGIONAL_FORM":
			return isFemale ? 5 : 4;
		default:
			return 9;
	}
}

function resolveFormSortGroup(
	formCategory: FormCategory,
	isDefaultForm: boolean,
): number {
	switch (formCategory) {
		case "BASE_FORM":
			return 0;
		case "ALTERNATE_FORM":
			return isDefaultForm ? 0 : 1;
		case "REGIONAL_FORM":
			return 2;
		default:
			return 0;
	}
}

// ─── Name derivation ─────────────────────────────────────────────────────────

const REGION_LABEL: Record<string, string> = {
	ALOLA: "Alolan",
	ALOLAN: "Alolan",
	GALAR: "Galarian",
	GALARIAN: "Galarian",
	HISUI: "Hisuian",
	HISUIAN: "Hisuian",
	KANTO: "Kantonian",
	KANTONIAN: "Kantonian",
	PALDEA: "Paldean",
	PALDEAN: "Paldean",
};

const SLUG_SUFFIX_LABEL: Record<string, string> = {
	ADVENTURE_HAT_2020: "Adventure Hat 2020",
	BB_2026: "BB 2026",
	COMPLETE_FIFTY_PERCENT: "50% Forme (Complete)",
	COMPLETE_TEN_PERCENT: "10% Forme (Complete)",
	COPY_2019: "Clone 2019",
	COSTUME_2020: "Costume 2020",
	DIWALI_2024: "Diwali 2024",
	DOCTOR: "Doctor",
	FALL_2019: "Fall 2019",
	FLYING_5TH_ANNIV: "Flying 5th Anniversary",
	GOFEST_2022: "GO Fest 2022",
	GOFEST_2024_MTIARA: "GO Fest 2024 Mega Tiara",
	GOFEST_2024_STIARA: "GO Fest 2024 Standard Tiara",
	GOFEST_2025_GOGGLES_BLUE: "GO Fest 2025 Goggles Blue",
	GOFEST_2025_GOGGLES_RED: "GO Fest 2025 Goggles Red",
	GOFEST_2025_GOGGLES_YELLOW: "GO Fest 2025 Goggles Yellow",
	GOFEST_2025_MONOCLE_BLUE: "GO Fest 2025 Monocle Blue",
	GOFEST_2025_MONOCLE_RED: "GO Fest 2025 Monocle Red",
	GOFEST_2025_MONOCLE_YELLOW: "GO Fest 2025 Monocle Yellow",
	GOTOUR_2024_A: "GO Tour 2024 A",
	GOTOUR_2024_A_02: "GO Tour 2024 A (02)",
	GOTOUR_2024_B: "GO Tour 2024 B",
	GOTOUR_2024_B_02: "GO Tour 2024 B (02)",
	GOTOUR_2025_A: "GO Tour 2025 A",
	GOTOUR_2025_A_02: "GO Tour 2025 A (02)",
	GOTOUR_2025_B: "GO Tour 2025 B",
	GOTOUR_2025_B_02: "GO Tour 2025 B (02)",
	GOTOUR_2026_A: "GO Tour 2026 A",
	GOTOUR_2026_A_02: "GO Tour 2026 A (02)",
	GOTOUR_2026_B: "GO Tour 2026 B",
	GOTOUR_2026_B_02: "GO Tour 2026 B (02)",
	GOTOUR_2026_C: "GO Tour 2026 C",
	GOTOUR_2026_C_02: "GO Tour 2026 C (02)",
	HORIZONS: "Horizons",
	JEJU: "Jeju",
	KARIYUSHI: "Kariyushi",
	KURTA: "Kurta",
	POP_STAR: "Pop Star",
	ROCK_STAR: "Rock Star",
	SUMMER_2023_A: "Summer 2023 A",
	SUMMER_2023_B: "Summer 2023 B",
	SUMMER_2023_C: "Summer 2023 C",
	SUMMER_2023_D: "Summer 2023 D",
	SUMMER_2023_E: "Summer 2023 E",
	TSHIRT_01: "T-Shirt 01",
	TSHIRT_02: "T-Shirt 02",
	TSHIRT_03: "T-Shirt 03",
	VS_2019: "VS 2019",
	WCS_2022: "WCS 2022",
	WCS_2023: "WCS 2023",
	WCS_2024: "WCS 2024",
	WCS_2025: "WCS 2025",
	WINTER_2020: "Winter 2020",
};

function slugSuffixToLabel(suffix: string): string {
	return (
		SLUG_SUFFIX_LABEL[suffix] ?? suffix.split("_").map(toTitleCase).join(" ")
	);
}

function deriveFormName(
	speciesName: string,
	canonicalFormSlug: string,
	pokemonId: string,
	formCategory: FormCategory,
	isFemale: boolean,
	isTemporaryEvolution: boolean,
): string {
	const femaleSuffix = isFemale ? " ♀" : "";
	const base = `${speciesName}${femaleSuffix}`;
	const suffix = formSuffix(canonicalFormSlug, pokemonId);
	if (!suffix) return base;

	if (formCategory === "REGIONAL_FORM") {
		const regionToken = suffix.split("_")[0];
		if (!regionToken) throw new Error("Failed to derive form name");
		const regionLabel = REGION_LABEL[regionToken] ?? toTitleCase(regionToken);
		return `${regionLabel} ${speciesName}${femaleSuffix}`;
	}

	if (isTemporaryEvolution) {
		const parts = suffix.split("_").map(toTitleCase);
		return `${parts.join(" ")} ${speciesName}${femaleSuffix}`;
	}

	return `${speciesName}${femaleSuffix} (${slugSuffixToLabel(suffix)})`;
}

const EVO_PREFIX_TOKENS = new Set(["MEGA", "PRIMAL"]);

function formatTempEvoName(speciesName: string, evoSuffix: string): string {
	const tokens = evoSuffix.split("_");
	const firstToken = tokens[0] as string;
	if (EVO_PREFIX_TOKENS.has(firstToken)) {
		const prefix = toTitleCase(firstToken);
		const rest = tokens.slice(1).map(toTitleCase).join(" ");
		return rest
			? `${prefix} ${speciesName} ${rest}`
			: `${prefix} ${speciesName}`;
	}
	return `${tokens.map(toTitleCase).join(" ")} ${speciesName}`;
}

// ─── Sprite resolution ────────────────────────────────────────────────────────

function resolveSprites(
	dex: number,
	formSlug: string,
	pokemonId: string,
	tempEvoId?: string,
	spriteIndex?: Set<string>,
): { regularSprite: string; shinySprite: string } {
	let base: string;
	let shiny: string;

	if (tempEvoId) {
		const suffix = tempEvoId.replace("TEMP_EVOLUTION_", "");
		base = `pm${dex}.f${suffix}.icon.png`;
		shiny = `pm${dex}.f${suffix}.s.icon.png`;
	} else {
		const shortSuffix = formSuffix(formSlug, pokemonId);
		if (!shortSuffix) {
			base = `pm${dex}.icon.png`;
			shiny = `pm${dex}.s.icon.png`;
			if (spriteIndex && !spriteIndex.has(base)) {
				const normalBase = `pm${dex}.fNORMAL.icon.png`;
				if (spriteIndex.has(normalBase)) {
					base = normalBase;
					shiny = `pm${dex}.fNORMAL.s.icon.png`;
				}
			}
		} else {
			const shortBase = `pm${dex}.f${shortSuffix}.icon.png`;
			const fullBase = `pm${dex}.f${formSlug}.icon.png`;
			const resolvedSuffix =
				spriteIndex && !spriteIndex.has(shortBase) && spriteIndex.has(fullBase)
					? formSlug
					: shortSuffix;
			base = `pm${dex}.f${resolvedSuffix}.icon.png`;
			shiny = `pm${dex}.f${resolvedSuffix}.s.icon.png`;

			if (spriteIndex && !spriteIndex.has(base)) {
				const fallbackBare = `pm${dex}.icon.png`;
				const fallbackNormal = `pm${dex}.fNORMAL.icon.png`;
				if (spriteIndex.has(fallbackBare)) {
					base = fallbackBare;
					shiny = `pm${dex}.s.icon.png`;
				} else if (spriteIndex.has(fallbackNormal)) {
					base = fallbackNormal;
					shiny = `pm${dex}.fNORMAL.s.icon.png`;
				}
			}
		}
	}

	if (spriteIndex && !spriteIndex.has(base)) {
		return {
			regularSprite: `${POKEAPI_ARTWORK_BASE}/${dex}.png`,
			shinySprite: `${POKEAPI_ARTWORK_BASE}/shiny/${dex}.png`,
		};
	}

	return {
		regularSprite: `${SPRITE_BASE}/${base}`,
		shinySprite: `${SPRITE_BASE}/${shiny}`,
	};
}

function buildFemaleProbeFilename(
	dex: number,
	formSlug: string,
	pokemonId: string,
): string {
	const suffix = formSuffix(formSlug, pokemonId);
	if (!suffix) return `pm${dex}.g2.icon.png`;
	return `pm${dex}.f${suffix}.g2.icon.png`;
}

// ─── Main transformer ─────────────────────────────────────────────────────────

export function transformPokemon(
	sources: ExtractedSources,
): TransformedPokemon[] {
	const speciesMap = buildSpeciesMap(sources);
	const formMetaMap = buildFormMetaMap(sources);
	const defaultFormMap = buildDefaultFormMap(sources);
	const ibfcMap = buildIbfcMap(sources);
	const speciesWithNormal = buildSpeciesWithNormalTemplate(sources);

	const pokemon: TransformedPokemon[] = [];
	const emitted = new Set<string>();

	for (const entry of sources.gameMaster) {
		const settings = entry.data.pokemonSettings;
		if (!settings?.form) continue;

		const match = SPECIES_REGEX.exec(entry.templateId);
		if (!match) continue;

		const dex = Number.parseInt(match[1] as string, 10);
		const rawFormSlug = settings.form;
		const pokemonId = settings.pokemonId;

		const formMeta = formMetaMap.get(rawFormSlug);
		const isCostume =
			(formMeta?.isCostume ?? false) ||
			UNFLAGGED_COSTUME_OVERRIDES.has(rawFormSlug);
		const ibfcEntry = ibfcMap.get(pokemonId);
		const defaultFormSlug = defaultFormMap.get(pokemonId);

		const speciesMeta = speciesMap.get(pokemonId);
		if (!speciesMeta) continue;

		// ── i18n names ────────────────────────────────────────────────────────
		const speciesI18nKey = `pokemon_name_${String(dex).padStart(4, "0")}`;
		const formI18nKey = `form_${rawFormSlug.toLowerCase()}`;
		const speciesName =
			sources.i18n.get(speciesI18nKey) ?? toTitleCase(pokemonId);
		const i18nFormName = sources.i18n.get(formI18nKey);
		const i18nIsSelfIdentifying =
			i18nFormName != null &&
			i18nFormName !== speciesName &&
			i18nFormName.toLowerCase().includes(speciesName.toLowerCase());

		// ── Canonical slug / ref ──────────────────────────────────────────────
		const canonicalSlug = resolveCanonicalFormSlug(rawFormSlug, pokemonId);
		const baseKey = `${pokemonId}::${canonicalSlug}`;
		const formCategory = classifyFormCategory({
			canonicalFormSlug: canonicalSlug,
			pokemonId,
		});

		// ── Form name ─────────────────────────────────────────────────────────
		let formName: string;
		const suffix = formSuffix(canonicalSlug, pokemonId);
		if (suffix?.startsWith("COMPLETE_") && !i18nIsSelfIdentifying) {
			const subName = i18nFormName ?? suffix.slice("COMPLETE_".length);
			const completeName =
				sources.i18n.get("form_zygarde_complete") ?? "Complete";
			formName = `${speciesName} (${completeName}, ${subName})`;
		} else {
			formName = i18nIsSelfIdentifying
				? i18nFormName
				: i18nFormName != null && i18nFormName !== speciesName
					? `${speciesName} (${i18nFormName})`
					: deriveFormName(
							speciesName,
							canonicalSlug,
							pokemonId,
							formCategory,
							false,
							false,
						);
		}

		if (!emitted.has(baseKey)) {
			emitted.add(baseKey);

			const isDefaultForm = defaultFormSlug === rawFormSlug;
			const isTrackable = resolveIsTrackable(canonicalSlug, ibfcEntry);

			if (!settings.type) {
				throw new Error(
					`PokemonTransformer: missing required field "type"\nTemplate: ${entry.templateId}\nPokemonId: ${pokemonId}`,
				);
			}

			const sprites = resolveSprites(
				dex,
				rawFormSlug,
				pokemonId,
				undefined,
				sources.spriteIndex,
			);
			if (sprites.regularSprite.startsWith(POKEAPI_ARTWORK_BASE)) continue;

			const base: TransformedPokemon = {
				baseAttack: settings.stats?.baseAttack ?? 0,
				baseDefense: settings.stats?.baseDefense ?? 0,
				baseStamina: settings.stats?.baseStamina ?? 0,
				familyId: speciesMeta.familyId,
				formCategory,
				formName,
				formPriority: resolveFormPriority({
					formCategory,
					isCostume,
					isDefaultForm,
					isFemale: false,
					isTemporaryEvolution: false,
				}),
				formSortGroup: resolveFormSortGroup(formCategory, isDefaultForm),
				height: settings.pokedexHeightM ?? 0,
				isCostume,
				isDefaultForm,
				isFemale: false,
				isShadowAvailable: speciesMeta.isShadowAvailable,
				isTemporaryEvolution: false,
				isTrackable,
				pokedexNumber: dex,
				pokemonClassification: speciesMeta.pokemonClassification,
				primaryTypeId: settings.type,
				ref: canonicalSlug,
				regularSprite: sprites.regularSprite,
				secondaryTypeId: settings.type2 ?? null,
				shinySprite: sprites.shinySprite,
				speciesId: pokemonId,
				speciesName,
				templateId: entry.templateId,
				weight: settings.pokedexWeightKg ?? 0,
			};

			// ── Female variant ────────────────────────────────────────────────
			const femaleProbe = buildFemaleProbeFilename(dex, rawFormSlug, pokemonId);
			if (sources.spriteIndex.has(femaleProbe)) {
				const femaleRef = `${canonicalSlug}_FEMALE`;
				const femaleKey = `${pokemonId}::${femaleRef}`;

				if (!emitted.has(femaleKey)) {
					emitted.add(femaleKey);
					const femaleShinyFilename = femaleProbe.replace(
						".icon.png",
						".s.icon.png",
					);

					pokemon.push({
						...base,
						formName: deriveFormName(
							speciesName,
							canonicalSlug,
							pokemonId,
							base.formCategory,
							true,
							false,
						),
						formPriority: resolveFormPriority({
							formCategory: base.formCategory,
							isCostume,
							isDefaultForm: false,
							isFemale: true,
							isTemporaryEvolution: false,
						}),
						isDefaultForm: false,
						isFemale: true,
						isTrackable: true,
						ref: femaleRef,
						regularSprite: `${SPRITE_BASE}/${femaleProbe}`,
						shinySprite: sources.spriteIndex.has(femaleShinyFilename)
							? `${SPRITE_BASE}/${femaleShinyFilename}`
							: null,
					});
				}
			}

			pokemon.push(base);
		}

		// ── Temp evolutions ───────────────────────────────────────────────────
		const hasNormalTemplate = speciesWithNormal.has(pokemonId);
		const isNormalTemplate = rawFormSlug.endsWith("_NORMAL");
		if (hasNormalTemplate && !isNormalTemplate) continue;

		for (const evo of settings.tempEvoOverrides ?? []) {
			if (!evo.tempEvoId) continue;

			const evoSuffix = evo.tempEvoId.replace("TEMP_EVOLUTION_", "");
			const evoRef = `${pokemonId}_${evoSuffix}`;
			const evoKey = `${pokemonId}::${evoRef}`;

			if (emitted.has(evoKey)) continue;
			emitted.add(evoKey);

			const primaryType = evo.typeOverride1 ?? settings.type;
			if (!primaryType) {
				throw new Error(
					`PokemonTransformer: missing "type" on temp evo\nTemplate: ${entry.templateId}\nTempEvoId: ${evo.tempEvoId}`,
				);
			}

			const evoSprites = resolveSprites(
				dex,
				evoRef,
				pokemonId,
				evo.tempEvoId,
				sources.spriteIndex,
			);
			if (evoSprites.regularSprite.startsWith(POKEAPI_ARTWORK_BASE)) continue;

			pokemon.push({
				baseAttack: evo.stats?.baseAttack ?? settings.stats?.baseAttack ?? 0,
				baseDefense: evo.stats?.baseDefense ?? settings.stats?.baseDefense ?? 0,
				baseStamina: evo.stats?.baseStamina ?? settings.stats?.baseStamina ?? 0,
				familyId: speciesMeta.familyId,
				formCategory,
				formName: formatTempEvoName(speciesName, evoSuffix),
				formPriority: resolveFormPriority({
					formCategory,
					isCostume,
					isDefaultForm: false,
					isFemale: false,
					isTemporaryEvolution: true,
				}),
				formSortGroup: resolveFormSortGroup(formCategory, false),
				height: evo.averageHeightM ?? settings.pokedexHeightM ?? 0,
				isCostume,
				isDefaultForm: false,
				isFemale: false,
				isShadowAvailable: speciesMeta.isShadowAvailable,
				isTemporaryEvolution: true,
				isTrackable: true,
				pokedexNumber: dex,
				pokemonClassification: speciesMeta.pokemonClassification,
				primaryTypeId: primaryType,
				ref: evoRef,
				regularSprite: evoSprites.regularSprite,
				secondaryTypeId: evo.typeOverride2 ?? settings.type2 ?? null,
				shinySprite: evoSprites.shinySprite,
				speciesId: pokemonId,
				speciesName,
				templateId: entry.templateId,
				weight: evo.averageWeightKg ?? settings.pokedexWeightKg ?? 0,
			});
		}
	}

	return pokemon.sort((a, b) => {
		if (a.speciesId !== b.speciesId) return 0;
		return a.formPriority - b.formPriority;
	});
}
