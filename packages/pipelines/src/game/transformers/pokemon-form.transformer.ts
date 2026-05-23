import type {
	ExtractedSources,
	TransformedPokemonForm,
} from "../types/contract.types";
import { toTitleCase } from "../utils/string";
import { SPECIES_REGEX } from "./pokemon-species.transformer";

const SPRITE_BASE =
	"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets";

function formSortKey(f: TransformedPokemonForm): number {
	if (f.isTemporaryEvolution) return 3;
	if (f.isCostume && f.form.endsWith("_FEMALE")) return 2;
	if (f.isCostume) return 1;
	if (f.form.endsWith("_FEMALE")) return 1;
	return 0;
}

function formSuffix(formSlug: string, pokemonId: string): string | null {
	const baseIdToken = pokemonId.split("_")[0] as string;

	let withoutSpecies = formSlug;
	if (formSlug.startsWith(pokemonId)) {
		withoutSpecies = formSlug.slice(pokemonId.length + 1);
	} else if (formSlug.startsWith(baseIdToken)) {
		withoutSpecies = formSlug.slice(baseIdToken.length + 1);
	}

	return withoutSpecies === "NORMAL" || withoutSpecies === ""
		? null
		: withoutSpecies;
}

function resolveSprites(
	dex: number,
	formSlug: string,
	pokemonId: string,
	_isCostume: boolean,
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
				const fallbackBase = `pm${dex}.icon.png`;
				if (spriteIndex.has(fallbackBase)) {
					base = fallbackBase;
					shiny = `pm${dex}.s.icon.png`;
				} else {
					const normalBase = `pm${dex}.fNORMAL.icon.png`;
					if (spriteIndex.has(normalBase)) {
						base = normalBase;
						shiny = `pm${dex}.fNORMAL.s.icon.png`;
					}
				}
			}
		}
	}

	if (spriteIndex && !spriteIndex.has(base)) {
		return {
			regularSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`,
			shinySprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${dex}.png`,
		};
	}

	return {
		regularSprite: `${SPRITE_BASE}/${base}`,
		shinySprite: `${SPRITE_BASE}/${shiny}`,
	};
}

interface FormMeta {
	assetBundleSuffix?: string;
	isCostume: boolean;
}

function buildFormMetaMap(sources: ExtractedSources): Map<string, FormMeta> {
	const map = new Map<string, FormMeta>();
	for (const entry of sources.gameMaster) {
		const fs = entry.data.formSettings;
		if (!fs?.forms) continue;
		for (const f of fs.forms) {
			map.set(f.form, {
				assetBundleSuffix: f.assetBundleSuffix,
				isCostume: f.isCostume ?? false,
			});
		}
	}
	return map;
}

function buildFemaleFilename(
	dex: number,
	formSlug: string,
	pokemonId: string,
	isCostume: boolean,
): string | null {
	const suffix = formSuffix(formSlug, pokemonId);
	if (!suffix) return `pm${dex}.g2.icon.png`;

	const prefix = isCostume ? "c" : "f";
	return `pm${dex}.${prefix}${suffix}.g2.icon.png`;
}

/**
 * Build a set of pokemonIds that have at least one _NORMAL template.
 * Used to decide which template is the canonical source for temp evos.
 */
function buildSpeciesWithNormalTemplate(
	sources: ExtractedSources,
): Set<string> {
	const set = new Set<string>();
	for (const entry of sources.gameMaster) {
		const settings = entry.data.pokemonSettings;
		if (!settings?.form) continue;
		if (settings.form.endsWith("_NORMAL")) {
			set.add(settings.pokemonId);
		}
	}
	return set;
}

/**
 * Resolves the canonical unique form slug for a given pokemonId + formSlug.
 *
 * Problem: NIDORAN_FEMALE and NIDORAN_MALE both have formSlug "NIDORAN_NORMAL".
 * Since `form` is the sole PK, slugs must be globally unique.
 *
 * If formSlug does NOT start with pokemonId, the species prefix is replaced:
 *   formSlug="NIDORAN_NORMAL", pokemonId="NIDORAN_FEMALE"
 *   → "NIDORAN_FEMALE_NORMAL"
 *
 * For the vast majority of Pokémon formSlug already starts with pokemonId,
 * so this is a no-op.
 */
function resolveCanonicalFormSlug(formSlug: string, pokemonId: string): string {
	if (formSlug.startsWith(pokemonId)) return formSlug;

	const underscoreIdx = formSlug.indexOf("_");
	const suffix = underscoreIdx >= 0 ? formSlug.slice(underscoreIdx + 1) : null;

	return suffix ? `${pokemonId}_${suffix}` : pokemonId;
}

export function transformForms(
	sources: ExtractedSources,
): TransformedPokemonForm[] {
	const formMetaMap = buildFormMetaMap(sources);
	const speciesWithNormal = buildSpeciesWithNormalTemplate(sources);
	const forms: TransformedPokemonForm[] = [];

	// Track emitted (speciesId, formSlug) pairs to prevent duplicates from
	// costume/alternate templates repeating the same temp evo slugs.
	// Key: `${speciesId}::${formSlug}`
	const emittedForms = new Set<string>();

	for (const entry of sources.gameMaster) {
		const settings = entry.data.pokemonSettings;
		if (!settings?.form) continue;

		const match = SPECIES_REGEX.exec(entry.templateId);
		if (!match) continue;

		const pokedexNumber = Number.parseInt(match[1] as string, 10);
		const formSlug = settings.form;
		const meta = formMetaMap.get(formSlug);
		const isCostume = meta?.isCostume ?? false;

		const formI18nKey = `form_${formSlug.toLowerCase()}`;
		const speciesI18nKey = `pokemon_name_${String(pokedexNumber).padStart(4, "0")}`;
		const name =
			sources.i18n.get(formI18nKey) ??
			sources.i18n.get(speciesI18nKey) ??
			toTitleCase(settings.pokemonId);

		const sprites = resolveSprites(
			pokedexNumber,
			formSlug,
			settings.pokemonId,
			isCostume,
			undefined,
			sources.spriteIndex,
		);

		// ----- Base form -------------------------------------------------------
		const canonicalFormSlug = resolveCanonicalFormSlug(
			formSlug,
			settings.pokemonId,
		);
		const baseFormKey = `${settings.pokemonId}::${canonicalFormSlug}`;

		if (!emittedForms.has(baseFormKey)) {
			emittedForms.add(baseFormKey);

			const baseForm: TransformedPokemonForm = {
				baseAttack: settings.stats?.baseAttack ?? 0,
				baseDefense: settings.stats?.baseDefense ?? 0,
				baseStamina: settings.stats?.baseStamina ?? 0,
				form: canonicalFormSlug,
				height: settings.pokedexHeightM ?? 0,
				isCostume,
				isTemporaryEvolution: false,
				name,
				primaryTypeId: settings.type,
				regularSprite: sprites?.regularSprite ?? null,
				secondaryTypeId: settings.type2 ?? null,
				shinySprite: sprites?.shinySprite ?? null,
				speciesId: settings.pokemonId,
				templateId: entry.templateId,
				weight: settings.pokedexWeightKg ?? 0,
			};

			// ----- Female variant ------------------------------------------------
			const femaleFilename = buildFemaleFilename(
				pokedexNumber,
				formSlug,
				settings.pokemonId,
				isCostume,
			);

			if (femaleFilename && sources.spriteIndex.has(femaleFilename)) {
				const femaleSlug = `${canonicalFormSlug}_FEMALE`;
				const femaleKey = `${settings.pokemonId}::${femaleSlug}`;

				if (!emittedForms.has(femaleKey)) {
					emittedForms.add(femaleKey);
					forms.push({
						...baseForm,
						form: femaleSlug,
						name: `${name} ♀`,
						regularSprite: `${SPRITE_BASE}/${femaleFilename}`,
						shinySprite: sources.spriteIndex.has(
							femaleFilename.replace(".icon.png", ".s.icon.png"),
						)
							? `${SPRITE_BASE}/${femaleFilename.replace(".icon.png", ".s.icon.png")}`
							: null,
					});
				}
			}

			forms.push(baseForm);
		}

		// ----- Temp evolutions -------------------------------------------------
		// Emit only from the canonical template to avoid duplicates:
		//   - If the species has a _NORMAL template → only emit from _NORMAL
		//   - If the species has NO _NORMAL template (e.g. Zorua Hisuian) →
		//     emit from whichever template we encounter first (emittedForms
		//     Set prevents subsequent templates from duplicating)
		const hasNormalTemplate = speciesWithNormal.has(settings.pokemonId);
		const isNormalTemplate = formSlug.endsWith("_NORMAL");

		if (hasNormalTemplate && !isNormalTemplate) continue;

		for (const evo of settings.tempEvoOverrides ?? []) {
			if (!evo.tempEvoId) continue;

			const evoSuffix = evo.tempEvoId.replace("TEMP_EVOLUTION_", "");
			const evoFormSlug = `${settings.pokemonId}_${evoSuffix}`;
			const evoKey = `${settings.pokemonId}::${evoFormSlug}`;

			if (emittedForms.has(evoKey)) continue;
			emittedForms.add(evoKey);

			const evoI18nKey = `form_${evoSuffix.toLowerCase()}`;
			const evoName =
				sources.i18n.get(evoI18nKey) ??
				sources.i18n.get(speciesI18nKey) ??
				toTitleCase(evoFormSlug);

			const evoSprites = resolveSprites(
				pokedexNumber,
				evoFormSlug,
				settings.pokemonId,
				false,
				evo.tempEvoId,
			);

			forms.push({
				baseAttack: evo.stats?.baseAttack ?? settings.stats?.baseAttack ?? 0,
				baseDefense: evo.stats?.baseDefense ?? settings.stats?.baseDefense ?? 0,
				baseStamina: evo.stats?.baseStamina ?? settings.stats?.baseStamina ?? 0,
				form: evoFormSlug,
				height: evo.averageHeightM ?? settings.pokedexHeightM ?? 0,
				isCostume: false,
				isTemporaryEvolution: true,
				name: evoName,
				primaryTypeId: evo.typeOverride1 ?? settings.type,
				regularSprite: evoSprites?.regularSprite ?? null,
				secondaryTypeId: evo.typeOverride2 ?? settings.type2 ?? null,
				shinySprite: evoSprites?.shinySprite ?? null,
				speciesId: settings.pokemonId,
				templateId: entry.templateId,
				weight: evo.averageWeightKg ?? settings.pokedexWeightKg ?? 0,
			});
		}
	}

	return forms.sort((a, b) => {
		if (a.speciesId !== b.speciesId) return 0;
		return formSortKey(a) - formSortKey(b);
	});
}
