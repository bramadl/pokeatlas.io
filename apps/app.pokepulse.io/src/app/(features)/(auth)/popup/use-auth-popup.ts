import { useContext } from "react";

import { AuthPopupContext } from "./auth-popup-context";

export function useAuthPopup() {
	const ctx = useContext(AuthPopupContext);
	if (!ctx) throw new Error("useAuthPopup must be used inside AuthProvider");
	return ctx;
}
