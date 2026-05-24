const BASE_FORM_OVERRIDES: Record<string, string> = {
	ZACIAN: "ZACIAN_HERO",
	ZAMAZENTA: "ZAMAZENTA_HERO",
};

const REGIONAL_PATTERN = /ALOLA|GALAR|HISUI|PALDEA/;

export function getFormPriority(
	formName: string,
	speciesName: string,
	isCostume: boolean,
	isTemporaryEvolution: boolean,
): number {
	const form = formName.toUpperCase();
	const species = speciesName.toUpperCase();

	const isBaseForm =
		form === `${species}_NORMAL` ||
		form === `${species}_BASE` ||
		form === species ||
		BASE_FORM_OVERRIDES[species] === form;

	if (
		isBaseForm &&
		!isCostume &&
		!isTemporaryEvolution &&
		!REGIONAL_PATTERN.test(form)
	)
		return 0;

	if (form.includes("FEMALE") && !isCostume) return 1;
	if (isCostume && !form.includes("FEMALE")) return 2;
	if (isCostume && form.includes("FEMALE")) return 3;
	if (REGIONAL_PATTERN.test(form)) return 4;
	if (isTemporaryEvolution) return 5;

	return 9;
}

export function getFormCategory(
	formName: string,
	isCostume: boolean,
	isTemporaryEvolution: boolean,
) {
	const form = formName.toUpperCase();
	const REGIONAL_PATTERN = /ALOLA|GALAR|HISUI|PALDEA/;

	if (form.includes("FEMALE") && !isCostume) return "female";
	if (isCostume) return "costume";
	if (REGIONAL_PATTERN.test(form)) return "regional";
	if (isTemporaryEvolution) {
		if (form.includes("MEGA") || form.includes("PRIMAL")) return "mega";
		return "alternate";
	}

	return null;
}
