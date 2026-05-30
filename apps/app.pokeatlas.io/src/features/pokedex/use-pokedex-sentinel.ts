import { useInView } from "react-intersection-observer";

interface UsePokedexSentinelOptions {
	controls?: { offsetFromBottom?: string };
	do: () => void;
	when: boolean;
}

export function usePokedexSentinel({
	controls = {},
	do: doAction,
	when: conditionFulfilled,
}: UsePokedexSentinelOptions) {
	const offsetFromBottom = controls.offsetFromBottom ?? "25%";
	const { ref } = useInView({
		onChange: (inView) => {
			if (inView && conditionFulfilled) doAction();
		},
		rootMargin: `0px 0px ${offsetFromBottom} 0px`,
	});

	return ref;
}
