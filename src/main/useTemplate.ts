import fs from "fs-extra";
import path from "path";
import { samplesDir } from "../constants/samplesDir";
import { colourText } from "../util/colourText";
import { fgColour } from "../util/fgColour";

export function useTemplate(template: string, target: string): void {
	console.log(`template:`, colourText(template, fgColour.green));
	console.log(`target:`, colourText(target, fgColour.green));
	const samplePath = path.join(samplesDir, template);

	fs.copy(samplePath, target, (err: any): void => {
		if (err) {
			console.error("Error copying files:", err);
			process.exit(1);
		}
		console.log(`Sample project ${template} was copied to ${target}`);
	});
}
