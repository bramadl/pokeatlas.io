import type {
	ExtractedSources,
	TransformedPokemonType,
} from "../types/contract.types";
import { toTitleCase } from "../utils/string";

const TYPE_PREFIX = "POKEMON_TYPE_";

export function transformTypes(
	sources: ExtractedSources,
): TransformedPokemonType[] {
	return sources.gameMaster
		.filter((entry) => entry.templateId.startsWith(TYPE_PREFIX))
		.map((entry) => {
			const templateId = entry.templateId;
			const name =
				sources.i18n.get(templateId.toLowerCase()) ?? toTitleCase(templateId);

			return {
				name,
				templateId,
			};
		});
}
