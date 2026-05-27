import { POKEMON_FORMS } from "@pokeatlas/core/types";

export const FORM_OPTIONS = POKEMON_FORMS.map((f) => ({
	label:
		f.replace(/_FORM$/, "").charAt(0) +
		f
			.replace(/_FORM$/, "")
			.slice(1)
			.toLowerCase(),
	value: f.toLowerCase().replace(/_form$/, ""),
}));
