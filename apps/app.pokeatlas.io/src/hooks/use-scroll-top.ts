export function useScrollTop() {
	return () => {
		window.scrollTo({ behavior: "smooth", top: 0 });
	};
}
