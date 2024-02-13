import { TextModifier } from "../types/textModifier";

export function colourText(str: string, modifiers: TextModifier[] | TextModifier): string {
	// return `\x1b[${col}${str}\x1b[0m`;
	if (!Array.isArray(modifiers)) {
		modifiers = [modifiers];
	}
	const mod = modifiers?.join(";");
	return `\x1b[${mod}m${str}\x1b[0m`;
}
