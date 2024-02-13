import fs from "fs-extra";
import inquirer from "inquirer";
import { useTemplate } from "../../main/useTemplate";
import { modeOptions } from "../../types/modeOptions";
import { isExistentFile } from "../../util/isExistentFile";
import { isValidPath } from "../../util/isValidPath";
import { logError } from "../../util/logError";
import { responseValueIsValid } from "../../util/responseValueIsValid";
import { throwIfFunctionNonInteractive } from "../../util/throwIfFunctionNonInteractive";
import { templateOption } from "../options/templateOption";

export const createCommandAction = async (arg: string, options: { template?: string | undefined; mode?: "overwrite" | "merge" | "abort" | undefined; }): Promise<void> => {
	let printTemplateValueError = false;
	while (!responseValueIsValid(options.template, "template", printTemplateValueError)) {
		throwIfFunctionNonInteractive();
		const response = await inquirer.prompt([
			{
				type: "list",
				name: "template",
				message: "Please choose a valid template:",
				choices: templateOption.argChoices,
			},
		]);
		options.template = response.template;
		printTemplateValueError = true;
	}

	let printTargetValueError = false;
	while (!responseValueIsValid(arg, "target", printTargetValueError) ||
		!isValidPath(arg, true) ||
		isExistentFile(arg, true)) {
		throwIfFunctionNonInteractive();
		const response = await inquirer.prompt([
			{
				type: "input",
				name: "target",
				message: "Please enter the target directory:",
				validate(input) {
					const validPath = isValidPath(input, true);
					if (!validPath) {
						return false;
					}
					const existentFile = isExistentFile(input, true);
					if (existentFile) {
						return false;
					}
					return true;
				},
			},
		]);

		arg = response.target;
		printTargetValueError = true;
	}

	if (!options.template || !options.mode || !arg) {
		throw new Error("Input values are invalid");
	}

	const directoryExists = fs.existsSync(arg) && fs.statSync(arg).isDirectory();

	if (directoryExists && options.mode === modeOptions.abort) {
		const files = fs.readdirSync(arg);
		const fileCount: number = files.length;
		if (fileCount > 0) {
			logError(`\nThe target directory contains ${fileCount} files\n`);
		}
	}

	useTemplate(options.template, arg);
};
