export interface GmTemplate {
	data: {
		templateId: string;
		formSettings?: GmFormSettings;
		pokemonSettings?: GmPokemonSettings;
	};
	templateId: string;
}

export interface GmFormSettings {
	forms: GmFormEntry[];
	pokemon: string;
}

export interface GmFormEntry {
	assetBundleSuffix?: string;
	form: string;
	isCostume?: boolean;
	isTemporaryEvolution?: boolean;
}

export interface GmPokemonSettings {
	evolutionBranch?: Array<{
		temporaryEvolution?: string;
		[key: string]: unknown;
	}>;
	familyId: string;
	form?: string;
	pokedexHeightM?: number;
	pokedexWeightKg?: number;
	pokemonClass?: string;
	pokemonId: string;
	shadow?: unknown;
	stats?: { baseAttack: number; baseDefense: number; baseStamina: number };
	tempEvoOverrides?: GmTempEvoOverride[];
	type: string;
	type2?: string;
}

export interface GmTempEvoOverride {
	averageHeightM?: number;
	averageWeightKg?: number;
	stats?: { baseAttack: number; baseDefense: number; baseStamina: number };
	tempEvoId?: string;
	typeOverride1?: string;
	typeOverride2?: string;
}

export interface ExtractedSources {
	gameMaster: GmTemplate[];
	i18n: Map<string, string>;
	spriteIndex: Set<string>;
}

export interface TransformedData {
	forms: TransformedPokemonForm[];
	species: TransformedPokemonSpecies[];
	types: TransformedPokemonType[];
}

export interface TransformedPokemonForm {
	baseAttack: number;
	baseDefense: number;
	baseStamina: number;
	form: string;
	height: number;
	isCostume: boolean;
	isTemporaryEvolution: boolean;
	name: string;
	primaryTypeId: string;
	regularSprite: string | null;
	secondaryTypeId: string | null;
	shinySprite: string | null;
	speciesId: string;
	templateId: string;
	weight: number;
}

export interface TransformedPokemonSpecies {
	familyId: string;
	isShadowAvailable: boolean;
	name: string;
	pokedexNumber: number;
	pokemonClassification: "LEGENDARY" | "MYTHIC" | null;
	pokemonId: string;
}

export interface TransformedPokemonType {
	name: string;
	templateId: string;
}
