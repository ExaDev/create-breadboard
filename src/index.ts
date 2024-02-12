#!/usr/bin/env node --harmony --import=tsx

import { Command } from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";

const program = new Command();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = findPackageRoot(__dirname);
const samplesDir = path.join(packageRoot, "templates");

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

type ConfigObject = {
	template: {
		default?: string;
		available: string[];
	};
	directory?: string;
};

function getAvailableTemplateNames(directory: string = samplesDir): string[] {
	const templateDirContents = fs.readdirSync(directory);
	const templateDirDirs = templateDirContents.filter((name: string) =>
		fs.statSync(path.join(directory, name)).isDirectory()
	);
	return templateDirDirs.map((name: string) => path.basename(name));
}

const defaultConfig: Partial<ConfigObject> = {
	template: {
		available: getAvailableTemplateNames(),
	},
};

function defineConfig(config: ConfigObject): ConfigObject {
	return {
		...defaultConfig,
		...config,
		template: {
			...defaultConfig.template,
			...config.template,
		},
	};
}

const config: ConfigObject = defineConfig({
	template: {
		default: "",
		available: getAvailableTemplateNames(),
	},
});

function findPackageRoot(directory: string): string {
	const file = path.join(directory, "package.json");

	if (fs.existsSync(file)) {
		return directory;
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
	return value && typeof value == "string" && value.length > 0;
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

function isValidPath(path: string): boolean {
	// Define invalid characters for Windows and Unix-like systems
	const invalidCharsWindows = /[<>:"/\\|?*]/;
	const invalidCharsUnix = /\0/;

	// Check for invalid characters
	if (invalidCharsWindows.test(path) || invalidCharsUnix.test(path)) {
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
		return false;
	}

	// Check for relative path traversal
	if (path.includes("../") || path.includes("..\\")) {
		return false;
	}

	// Check path length
	if (path.length > 260) {
		return false;
	}

	return true;
}

program.configureOutput({
	writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
	writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
	// Highlight errors in color.
	outputError: (str, write) => write(errorColor(str)),
});

program
	.command("create", {
		isDefault: true,
	})
	.option(
		"--template <type>",
		"Specify the template type",
		config.template.default
	)
	.argument("[target]", "Specify the target directory", config.directory)
	.description("The name of the template to use")
	.action(async (template?: string, target?: string) => {
		while (!responseValueIsValid(template)) {
			const response = await inquirer.prompt([
				{
					type: "list",
					name: "template",
					message: "Please choose a valid template:",
					choices: config.template.available,
				},
			]);
			template = response.template;
		}

		while (!responseValueIsValid(target)) {
			const response = await inquirer.prompt([
				{
					type: "input",
					name: "target",
					message: "Please enter the target directory:",
					validate(input) {
						return isValidPath(input);
					},
				},
			]);
			if (response.target) {
				const tempTarget: string = response.target;
				const pathExists = fs.existsSync(tempTarget);
				const pathIsDirectory =
					pathExists && fs.statSync(tempTarget).isDirectory();

				if (pathExists && !pathIsDirectory) {
					console.error(
						"The target path already exists but is not a directory"
					);
					continue;
				} else if (pathExists && pathIsDirectory) {
					const files = fs.readdirSync(tempTarget);
					const fileCount: number = files.length;
					if (fileCount > 0) {
						const response = await inquirer.prompt([
							{
								type: "confirm",
								name: "continue",
								message: `The target directory already contains ${fileCount} files. Do you want to continue?`,
								default: false,
							},
						]);

						if (!response.continue) {
							// If the user doesn't want to continue, then we should prompt for a new target
							continue;
						} else {
							target = tempTarget;
						}
					}
				}

				target = tempTarget;
			}
		}

		if (!template || !target) {
			throw new Error("Input values are invalid");
		}

		useTemplate(template, target);
	});

program.showHelpAfterError();
program.configureHelp({
	sortSubcommands: true,
	// subcommandTerm: (cmd) => colourText([
	// 	cmd.name(),
	// 	cmd.options
	// ].join(" "), [fgColour.cyan]),
});

program.parse(process.argv);
