import fs from "fs-extra";
import { logError } from "./logError";


export function isExistentFile(arg: string, printError = false): boolean {
	const result = fs.existsSync(arg) && fs.statSync(arg).isFile();
	if (result && printError) {
		logError("The target path already exists and is a file");
	}
	return result;
}
