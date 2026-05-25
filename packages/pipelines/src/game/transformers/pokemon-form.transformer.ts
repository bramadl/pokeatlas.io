import type {
	ExtractedSources,
	TransformedPokemonForm,
} from "../types/contract.types";
import { toTitleCase } from "../utils/string";
import { SPECIES_REGEX } from "./pokemon-species.transformer";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRITE_BASE =
	"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets";

const POKEAPI_ARTWORK_BASE =
	"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

/**
 * Known regional variant suffixes in Pokémon GO.
 * GM has no explicit regional flag — detection is suffix-based.
 * Update when Niantic adds new regional variants.
 */
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

type FormCategory = TransformedPokemonForm["formCategory"];

// ─── Pre-pass maps ────────────────────────────────────────────────────────────

/**
 * Maps formSlug → { isCostume, assetBundleValue } from FORMS_V* entries.
 * This is the authoritative source for costume flag AND form ordering.
 *
 * assetBundleValue is also captured here but the primary ordering source
 * is the array index from buildDefaultFormMap.
 */
function buildFormMetaMap(
	sources: ExtractedSources,
): Map<string, { isCostume: boolean; assetBundleValue?: number }> {
	const map = new Map<
		string,
		{ isCostume: boolean; assetBundleValue?: number }
	>();

	for (const entry of sources.gameMaster) {
		const fs = entry.data.formSettings;
		if (!fs?.forms) continue;

		for (const f of fs.forms) {
			map.set(f.form, {
				assetBundleValue: f.assetBundleValue,
				isCostume: f.isCostume ?? false,
			});
		}
	}

	return map;
}

/**
 * Maps pokemonId → the DEFAULT form slug for that species.
 *
 * Rule: forms[0] in formSettings.forms[] is always the default form
 * (the form a trainer first encounters when catching the species).
 *
 * Examples from GM data:
 *   LANDORUS     → LANDORUS_INCARNATE   (forms[0])
 *   GIRATINA     → GIRATINA_ALTERED     (forms[0])
 *   DIALGA       → DIALGA_NORMAL        (forms[0])
 *   FLABEBE      → FLABEBE_RED          (forms[0])
 *   ZACIAN       → ZACIAN_HERO          (forms[0])
 *   KORAIDON     → KORAIDON_APEX        (forms[0], only form)
 *   NIDORAN_FEMALE → NIDORAN_NORMAL     (forms[0])
 *
 * This is an intentional Niantic convention — forms[0] is always catchable,
 * subsequent forms may require special conditions (research, raids, etc.)
 */
function buildDefaultFormMap(sources: ExtractedSources): Map<string, string> {
	const map = new Map<string, string>();
	for (const entry of sources.gameMaster) {
		const fs = entry.data.formSettings;
		if (!fs?.forms?.length) continue;

		// biome-ignore lint/style/noNonNullAssertion: forms[0] is always the default — never undefined given length check
		const firstForm = fs.forms[0]!.form;
		map.set(fs.pokemon, firstForm);
	}

	return map;
}

/**
 * Maps pokemonId → { defaultForm, battleOnlyForms } for species with
 * ibfc.combatEnable = true (Aegislash, Mimikyu, Morpeko, Wishiwashi, etc.)
 *
 * ibfc is present on ALL entries (as {} when inactive), so we check combatEnable.
 */
function buildIbfcMap(
	sources: ExtractedSources,
): Map<string, { defaultForm: string; battleOnlyForms: Set<string> }> {
	const map = new Map<
		string,
		{ defaultForm: string; battleOnlyForms: Set<string> }
	>();

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

/**
 * Build the set of pokemonIds that have at least one _NORMAL template.
 * Used to pick the canonical template for emitting temp evolutions.
 */
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

/**
 * Maps a raw suffix token to a human-readable label.
 * Handles known patterns; falls back to title-cased tokens.
 */
function slugSuffixToLabel(suffix: string): string {
	const KNOWN: Record<string, string> = {
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
		FLYING_01: "Flying 01",
		FLYING_02: "Flying 02",
		FLYING_03: "Flying 03",
		FLYING_04: "Flying 04",
		FLYING_OKINAWA: "Flying Okinawa",
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

	if (KNOWN[suffix]) return KNOWN[suffix];
	return suffix.split("_").map(toTitleCase).join(" ");
}

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

/**
 * Derives a human-readable display name from the canonical form slug
 * when i18n doesn't have a form-specific entry.
 *
 * Examples:
 *   VENUSAUR_COPY_2019        → "(Clone 2019)"  → "Venusaur (Clone 2019)"
 *   PIKACHU_ROCK_STAR         → "(Rock Star)"   → "Pikachu (Rock Star)"
 *   PIKACHU_GOFEST_2025_GOGGLES_BLUE → "(GO Fest 2025 Goggles Blue)"
 *   RATTATA_ALOLA             → regional prefix, handled by classifyFormCategory
 *   VENUSAUR_MEGA             → "(Mega)" — but temp evos have their own i18n key
 *   CHARIZARD_MEGA_X          → "(Mega X)"
 */
function deriveFormName(
	speciesName: string,
	canonicalFormSlug: string,
	pokemonId: string,
	formCategory: FormCategory,
	isFemale: boolean,
): string {
	const femaleSuffix = isFemale ? " ♀" : "";
	const base = `${speciesName}${femaleSuffix}`;

	const suffix = formSuffix(canonicalFormSlug, pokemonId);
	if (!suffix) return base; // BASE_FORM, no decoration needed

	if (formCategory === "REGIONAL_VARIANT") {
		// "ALOLA" → "Alolan Rattata", "GALARIAN" → "Galarian Darmanitan"
		const regionToken = suffix.split("_")[0];
		if (!regionToken) throw new Error("Failed to derive form name");

		const regionLabel = REGION_LABEL[regionToken] ?? toTitleCase(regionToken);
		return `${regionLabel} ${speciesName}${femaleSuffix}`;
	}

	if (formCategory === "TEMPORARY_EVOLUTION_FORM") {
		// suffix is already handled via evoI18nKey, this path shouldn't be hit
		// but as fallback: "MEGA" → "Mega Venusaur", "MEGA_X" → "Mega Charizard X"
		const parts = suffix.split("_").map(toTitleCase);
		return `${parts.join(" ")} ${speciesName}${femaleSuffix}`;
	}

	// COSTUME_VARIANT and ALTERNATE_FORM: parenthetical suffix
	const label = slugSuffixToLabel(suffix);
	return `${speciesName}${femaleSuffix} (${label})`;
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────

/**
 * Resolves the globally-unique canonical form slug.
 *
 * Problem: NIDORAN_FEMALE and NIDORAN_MALE both produce formSlug "NIDORAN_NORMAL".
 * Since `form` is the sole PK, we suffix with pokemonId to disambiguate:
 *   formSlug="NIDORAN_NORMAL", pokemonId="NIDORAN_FEMALE" → "NIDORAN_FEMALE_NORMAL"
 */
function resolveCanonicalFormSlug(formSlug: string, pokemonId: string): string {
	if (formSlug.startsWith(pokemonId)) return formSlug;

	const underscoreIdx = formSlug.indexOf("_");
	const suffix = underscoreIdx >= 0 ? formSlug.slice(underscoreIdx + 1) : null;

	return suffix ? `${pokemonId}_${suffix}` : pokemonId;
}

/**
 * Extracts the suffix portion of a formSlug relative to the pokemonId.
 * Returns null for base/normal forms (NORMAL suffix or no suffix).
 */
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

// ─── FormCategory classifier ──────────────────────────────────────────────────

/**
 * Classifies the structural category of a form. isFemale is NOT part of this
 * classification — it is a separate orthogonal boolean on TransformedPokemonForm.
 *
 * Decision tree (priority order):
 * 1. Temp evo            → TEMPORARY_EVOLUTION_FORM
 * 2. isCostume from GM   → COSTUME_VARIANT
 * 3. Regional suffix     → REGIONAL_VARIANT
 * 4. Non-NORMAL suffix   → ALTERNATE_FORM
 * 5. Default             → BASE_FORM
 *
 * Note: ibfc.defaultForm no longer affects formCategory.
 * isTrackable handles the battle-only distinction separately.
 * isDefaultForm handles the "primary form" distinction separately.
 */
function classifyFormCategory(opts: {
	canonicalFormSlug: string;
	isCostume: boolean;
	isTempEvo: boolean;
	pokemonId: string;
}): FormCategory {
	const { canonicalFormSlug, isCostume, isTempEvo, pokemonId } = opts;

	if (isTempEvo) return "TEMPORARY_EVOLUTION_FORM";
	if (isCostume) return "COSTUME_VARIANT";

	const suffix = formSuffix(canonicalFormSlug, pokemonId);
	if (suffix) {
		const firstToken = suffix.split("_")[0] as string;
		if (REGIONAL_SUFFIXES.has(firstToken)) return "REGIONAL_VARIANT";
		return "ALTERNATE_FORM";
	}

	return "BASE_FORM";
}

/**
 * Resolves isTrackable.
 * Only battle-only forms (ibfc.combatEnable + alternateForm) are non-trackable.
 * Everything else — including Mega, Primal, costume, regional, female — is trackable.
 */
function resolveIsTrackable(
	canonicalFormSlug: string,
	ibfcEntry: { defaultForm: string; battleOnlyForms: Set<string> } | undefined,
): boolean {
	if (!ibfcEntry) return true;
	// defaultForm is trackable, alternateForm(s) are battle-only
	return (
		canonicalFormSlug === ibfcEntry.defaultForm ||
		!ibfcEntry.battleOnlyForms.has(canonicalFormSlug)
	);
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

	// Final fallback: PokeAPI official artwork (always exists)
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

/**
 * Builds the female probe filename to check in the sprite index.
 * If the file exists → emit a female variant form (Case B: sprite-only, no GM entry).
 * Case A (GM explicit _FEMALE suffix e.g. NIDORAN_FEMALE) is handled in the main loop.
 */
function buildFemaleProbeFilename(
	dex: number,
	formSlug: string,
	pokemonId: string,
): string {
	const suffix = formSuffix(formSlug, pokemonId);
	if (!suffix) return `pm${dex}.g2.icon.png`;
	return `pm${dex}.f${suffix}.g2.icon.png`;
}

// ─── Sort key ─────────────────────────────────────────────────────────────────

function formSortKey(
	category: FormCategory,
	isDefaultForm: boolean,
	isFemale: boolean,
): number {
	// Default form always sorts first within its species
	if (isDefaultForm) return 0;

	// Within each category, male (isFemale: false) sorts before female
	const femaleOffset = isFemale ? 0.5 : 0;

	if (category === "BASE_FORM") return 1 + femaleOffset;
	if (category === "ALTERNATE_FORM") return 3 + femaleOffset;
	if (category === "REGIONAL_VARIANT") return 4 + femaleOffset;
	if (category === "COSTUME_VARIANT") return 5 + femaleOffset;
	if (category === "TEMPORARY_EVOLUTION_FORM") return 6;
	return 7;
}

// ─── Main transformer ─────────────────────────────────────────────────────────

export function transformForms(
	sources: ExtractedSources,
): TransformedPokemonForm[] {
	const formMetaMap = buildFormMetaMap(sources);
	const defaultFormMap = buildDefaultFormMap(sources);
	const ibfcMap = buildIbfcMap(sources);
	const speciesWithNormal = buildSpeciesWithNormalTemplate(sources);
	const forms: TransformedPokemonForm[] = [];

	// Dedup guard: prevents duplicate slugs from costume/alternate templates.
	// Key: `${pokemonId}::${canonicalFormSlug}`
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
		const isCostume = formMeta?.isCostume ?? false;
		const ibfcEntry = ibfcMap.get(pokemonId);

		// The default form for this species (forms[0] in formSettings)
		const defaultFormSlug = defaultFormMap.get(pokemonId);

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

		// ── Canonical slug ────────────────────────────────────────────────────
		const canonicalSlug = resolveCanonicalFormSlug(rawFormSlug, pokemonId);
		const baseKey = `${pokemonId}::${canonicalSlug}`;

		const formCategory = classifyFormCategory({
			canonicalFormSlug: canonicalSlug,
			isCostume,
			isTempEvo: false,
			pokemonId,
		});

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
						);
		}

		if (!emitted.has(baseKey)) {
			emitted.add(baseKey);

			// isDefaultForm: true when this form's raw slug matches the species' forms[0]
			// Note: compare raw slugs (before canonical resolution) because defaultFormMap
			// stores the raw slug from formSettings — e.g. "NIDORAN_NORMAL" for both
			// NIDORAN_FEMALE and NIDORAN_MALE. After canonical resolution they become
			// unique slugs but both should be isDefaultForm: true (each is the only
			// form for their respective species).
			const isDefaultForm = defaultFormSlug === rawFormSlug;

			const isTrackable = resolveIsTrackable(canonicalSlug, ibfcEntry);

			if (!settings.type) {
				throw new Error(
					`PokemonFormTransformer: missing required field "type"\n` +
						`Template: ${entry.templateId}\n` +
						`PokemonId: ${pokemonId}`,
				);
			}

			const sprites = resolveSprites(
				dex,
				rawFormSlug,
				pokemonId,
				undefined,
				sources.spriteIndex,
			);

			const baseForm: TransformedPokemonForm = {
				baseAttack: settings.stats?.baseAttack ?? 0,
				baseDefense: settings.stats?.baseDefense ?? 0,
				baseStamina: settings.stats?.baseStamina ?? 0,
				form: canonicalSlug,
				formCategory,
				height: settings.pokedexHeightM ?? 0,
				isDefaultForm,
				isFemale: false,
				isTrackable,
				name: formName,
				primaryTypeId: settings.type,
				regularSprite: sprites.regularSprite,
				secondaryTypeId: settings.type2 ?? null,
				shinySprite: sprites.shinySprite,
				speciesId: pokemonId,
				templateId: entry.templateId,
				weight: settings.pokedexWeightKg ?? 0,
			};

			// ── Female variant — Case B (sprite-index-detected, no GM entry) ─
			// Case A (GM explicit _FEMALE suffix e.g. NIDORAN_FEMALE) is a
			// regular form entry in the main loop and needs no special treatment.
			//
			// Female variant inherits formCategory from its parent: a female costume
			// is COSTUME_VARIANT + isFemale: true, not a separate FEMALE_VARIANT.
			const femaleProbe = buildFemaleProbeFilename(dex, rawFormSlug, pokemonId);
			if (sources.spriteIndex.has(femaleProbe)) {
				const femaleSlug = `${canonicalSlug}_FEMALE`;
				const femaleKey = `${pokemonId}::${femaleSlug}`;

				if (!emitted.has(femaleKey)) {
					emitted.add(femaleKey);
					const femaleShinyFilename = femaleProbe.replace(
						".icon.png",
						".s.icon.png",
					);

					forms.push({
						...baseForm,
						form: femaleSlug,
						formCategory: baseForm.formCategory, // inherit — e.g. COSTUME_VARIANT stays COSTUME_VARIANT
						isDefaultForm: false, // female variant is never the default form
						isFemale: true,
						isTrackable: true,
						name: deriveFormName(
							speciesName,
							canonicalSlug,
							pokemonId,
							baseForm.formCategory,
							true,
						),
						regularSprite: `${SPRITE_BASE}/${femaleProbe}`,
						shinySprite: sources.spriteIndex.has(femaleShinyFilename)
							? `${SPRITE_BASE}/${femaleShinyFilename}`
							: null,
					});
				}
			}

			forms.push(baseForm);
		}

		// ── Temp evolutions ───────────────────────────────────────────────────
		// Only emit from the canonical (_NORMAL) template to prevent duplicates.
		// Exception: species with no _NORMAL template (e.g. Zorua Hisuian) —
		// emit from the first template encountered; emitted Set prevents dupes.
		const hasNormalTemplate = speciesWithNormal.has(pokemonId);
		const isNormalTemplate = rawFormSlug.endsWith("_NORMAL");
		if (hasNormalTemplate && !isNormalTemplate) continue;

		for (const evo of settings.tempEvoOverrides ?? []) {
			if (!evo.tempEvoId) continue;

			const evoSuffix = evo.tempEvoId.replace("TEMP_EVOLUTION_", "");
			const evoSlug = `${pokemonId}_${evoSuffix}`;
			const evoKey = `${pokemonId}::${evoSlug}`;

			if (emitted.has(evoKey)) continue;
			emitted.add(evoKey);

			const evoI18nKey = `form_${evoSuffix.toLowerCase()}`;
			const evoName =
				sources.i18n.get(evoI18nKey) ??
				sources.i18n.get(speciesI18nKey) ??
				toTitleCase(evoSlug);

			const primaryType = evo.typeOverride1 ?? settings.type;
			if (!primaryType) {
				throw new Error(
					`PokemonFormTransformer: missing required field "type" on temp evo\n` +
						`Template: ${entry.templateId}\n` +
						`TempEvoId: ${evo.tempEvoId}`,
				);
			}

			const evoSprites = resolveSprites(
				dex,
				evoSlug,
				pokemonId,
				evo.tempEvoId,
				sources.spriteIndex,
			);

			forms.push({
				baseAttack: evo.stats?.baseAttack ?? settings.stats?.baseAttack ?? 0,
				baseDefense: evo.stats?.baseDefense ?? settings.stats?.baseDefense ?? 0,
				baseStamina: evo.stats?.baseStamina ?? settings.stats?.baseStamina ?? 0,
				form: evoSlug,
				formCategory: "TEMPORARY_EVOLUTION_FORM",
				height: evo.averageHeightM ?? settings.pokedexHeightM ?? 0,
				isDefaultForm: false, // temp evos are never the default form
				isFemale: false, // no female temp evos in GO
				isTrackable: true,
				name: evoName,
				primaryTypeId: primaryType,
				regularSprite: evoSprites.regularSprite,
				secondaryTypeId: evo.typeOverride2 ?? settings.type2 ?? null,
				shinySprite: evoSprites.shinySprite,
				speciesId: pokemonId,
				templateId: entry.templateId,
				weight: evo.averageWeightKg ?? settings.pokedexWeightKg ?? 0,
			});
		}
	}

	// Sort within species: default form first, then by category, male before female
	return forms.sort((a, b) => {
		if (a.speciesId !== b.speciesId) return 0;
		return (
			formSortKey(a.formCategory, a.isDefaultForm, a.isFemale) -
			formSortKey(b.formCategory, b.isDefaultForm, b.isFemale)
		);
	});
}
