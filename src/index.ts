#!/usr/bin/env node --harmony

import { Argument, Command, Option } from "@commander-js/extra-typings";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";

const program = new Command();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = findPackageRoot(__dirname);
const samplesDir = path.resolve(path.join(packageRoot, "templates"));

function useTemplate(template: string, target: string): void {
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

function throwIfFunctionNonInteractive() {
	if (!shellIsInteractive()) {
		logError(helpText);
		throw new Error("Shell is not interactive");
	}
}

function shellIsInteractive(): boolean {
	return process.stdin.isTTY;
}

function getAvailableTemplateNames(directory: string = samplesDir): string[] {
	const templateDirContents = fs.readdirSync(directory);
	const templateDirDirs = templateDirContents.filter((name: string) =>
		fs.statSync(path.join(directory, name)).isDirectory()
	);
	return templateDirDirs.map((name: string) => path.basename(name));
}

function findPackageRoot(directory: string): string {
	const file = path.resolve(path.join(directory, "package.json"));

	if (fs.existsSync(file)) {
		return path.resolve(directory);
	}

	const parentDirectory = path.dirname(directory);

	// Stop if we hit the root of the file system
	if (directory === parentDirectory) {
		throw new Error("package.json not found in any parent directory");
	}

	return findPackageRoot(parentDirectory);
}

const packageJson: {
	version: "string";
} = JSON.parse(
	fs.readFileSync(path.resolve(path.join(packageRoot, "package.json")), "utf8")
);
const packageVersion = packageJson.version;

function responseValueIsValid(value: any): boolean {
	const result = value && typeof value == "string" && value.length > 0;
	if (!result) {
		console.error("Invalid value:", value);
	}
	return value;
}

program
	.name("create-breadboard")
	.description("A cli for creating Breadboard based applications")
	.version(packageVersion);

const fgColour = {
	black: "30",
	red: "31",
	green: "32",
	yellow: "33",
	blue: "34",
	magenta: "35",
	cyan: "36",
	white: "37",
} as const;

const bgColour = {
	black: 40,
	red: 41,
	green: 42,
	yellow: 43,
	blue: 44,
	magenta: 45,
	cyan: 46,
	white: 47,
} as const;

type FgColour = (typeof fgColour)[keyof typeof fgColour];
type BgColour = (typeof bgColour)[keyof typeof bgColour];

const textStyle = {
	bold: 1,
	dim: 2,
	italic: 3,
	underline: 4,
	blink: 5,
	reverse: 7,
	hidden: 8,
	frame: 51,
	encircle: 52,
	overline: 53,
	crossedOut: 9,
} as const;
type TextStyle = (typeof textStyle)[keyof typeof textStyle];

type Modifier = FgColour | BgColour | TextStyle;

function colourText(str: string, modifiers: Modifier[] | Modifier): string {
	// return `\x1b[${col}${str}\x1b[0m`;
	if (!Array.isArray(modifiers)) {
		modifiers = [modifiers];
	}
	const mod = modifiers?.join(";");
	return `\x1b[${mod}m${str}\x1b[0m`;
}

function errorColor(str: string) {
	return colourText(str, [fgColour.red]);
}

function isValidPath(path: string, printError = false): boolean {
	// Define invalid characters for Windows and Unix-like systems
	const invalidCharsWindows = /[<>:"/\\|?*]/;
	const invalidCharsUnix = /\0/;

	// Check for invalid characters
	if (invalidCharsWindows.test(path) || invalidCharsUnix.test(path)) {
		if (printError) {
			logError("The target path contains invalid characters");
		}
		return false;
	}

	// Check for reserved filenames in Windows
	const reservedNames = [
		"CON",
		"PRN",
		"AUX",
		"NUL",
		"COM1",
		"COM2",
		"COM3",
		"COM4",
		"COM5",
		"COM6",
		"COM7",
		"COM8",
		"COM9",
		"LPT1",
		"LPT2",
		"LPT3",
		"LPT4",
		"LPT5",
		"LPT6",
		"LPT7",
		"LPT8",
		"LPT9",
	];
	const baseName = path.split(/[\\/]/).pop();
	if (baseName && reservedNames.includes(baseName.toUpperCase())) {
		if (printError) {
			logError("The target path contains reserved filename");
		}
		return false;
	}

	// Check for relative path traversal
	if (path.includes("../") || path.includes("..\\")) {
		if (printError) {
			logError("The target path contains relative path traversal");
		}
		return false;
	}

	// Check path length
	if (path.length > 260) {
		if (printError) {
			logError("The target path is too long");
		}
		return false;
	}

	return true;
}

function logError(message: string) {
	console.error("\n", errorColor(message));
}

function isExistentFile(arg: string, printError = false): boolean {
	const result = fs.existsSync(arg) && fs.statSync(arg).isFile();
	if (result && printError) {
		logError("The target path already exists and is a file");
	}
	return result;
}

program.configureOutput({
	// writeOut: (str) => process.stdout.write(str),
	// writeErr: (str) => process.stdout.write(colourText(str, fgColour.red)),
	// Highlight errors in color.
	outputError: (str, write) => write(errorColor(str)),
});

const createCommand = new Command<
	[string],
	{
		template?: string;
		mode?: ModeOption;
	}
>("create");

const templateOption = new Option(
	"-t, --template <template>",
	"Template"
).choices(getAvailableTemplateNames(samplesDir));
createCommand.addOption(templateOption);

const modeOptions = {
	overwrite: "overwrite",
	merge: "merge",
	abort: "abort",
} as const;
type ModeOption = keyof typeof modeOptions;

const modeOptionsArray = Object.values(modeOptions);

const modeOption = new Option(
	"-m, --mode <mode>",
	"How to handle existing files in the target directory"
)
	.default(modeOptions.abort)
	.choices(modeOptionsArray);
createCommand.addOption(modeOption);

const targetArgument = new Argument("[target]", "Target directory");
createCommand.addArgument(targetArgument);

const helpText = program.helpInformation();

createCommand.action(async (arg: string, options) => {
	while (!responseValueIsValid(options.template)) {
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
	}

	while (
		!responseValueIsValid(arg) ||
		!isValidPath(arg, true) ||
		isExistentFile(arg, true)
	) {
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

			program.help();
		}
	}

	useTemplate(options.template, arg);
});

program.addCommand(createCommand, {
	isDefault: true,
});

program.showHelpAfterError();
program.configureHelp({
	sortSubcommands: true,
	showGlobalOptions: true,
	sortOptions: true,
});

program.parse(process.argv);
