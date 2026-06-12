import { createContext } from "react";

export interface AuthPopupContext {
	close: () => void;
	open: () => void;
}

export const AuthPopupContext = createContext<AuthPopupContext | null>(null);
