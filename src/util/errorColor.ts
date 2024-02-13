import { colourText } from "./colourText";
import { fgColour } from "./fgColour";


export function errorColor(str: string) {
	return colourText(str, [fgColour.red]);
}
