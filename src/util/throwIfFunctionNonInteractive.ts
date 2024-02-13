import { shellIsInteractive } from "./shellIsInteractive";

export function throwIfFunctionNonInteractive() {
	if (!shellIsInteractive()) {
		throw new Error("Shell is not interactive");
	}
}
