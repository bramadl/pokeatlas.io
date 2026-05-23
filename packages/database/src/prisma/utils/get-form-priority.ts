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
