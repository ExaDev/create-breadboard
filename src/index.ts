import { Command } from 'commander';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';

const program = new Command();

const defaultTemplate = 'default_template';

function findPackageRoot(directory: string): string {
	const file = path.join(directory, 'package.json');

	if (fs.existsSync(file)) {
		return directory;
	}

	const parentDirectory = path.dirname(directory);

	// Stop if we hit the root of the file system
	if (directory === parentDirectory) {
		throw new Error('package.json not found in any parent directory');
	}

	return findPackageRoot(parentDirectory);
}

const packageRoot = findPackageRoot(__dirname);

const samplesDir = path.join(packageRoot, 'templates');

function getAvailableTemplateNames(): string[] {
	const templateDirContents = fs.readdirSync(samplesDir);
	const templateDirDirs = templateDirContents.filter((name: string) => fs.statSync(path.join(samplesDir, name)).isDirectory());
	return templateDirDirs.map((name: string) => path.basename(name));
}

program
	.option('--template <type>', 'Specify the template type', defaultTemplate)
	.argument('[target]', 'Specify the target directory', defaultTemplate);

program.parse(process.argv);

const options = program.opts();
let template = options.template || defaultTemplate;
let targetDir = program.args[0];

async function promptForTemplate() {
	const availableTemplates = getAvailableTemplateNames();

	if (!availableTemplates.includes(template)) {
		console.log('Invalid template. Available templates are:', availableTemplates.join(', '));
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'chosenTemplate',
				message: 'Please choose a valid template:',
				choices: availableTemplates,
			},
		]);
		template = answers.chosenTemplate;
	}
}

async function promptForTargetDir() {
	if (!targetDir) {
		const answers = await inquirer.prompt([
			{
				type: 'input',
				name: 'targetDir',
				message: 'Please enter the target directory:',
				validate: (input: any) => input ? true : 'Target directory cannot be empty'
			}
		]);
		targetDir = answers.targetDir;
	}

	const samplePath = path.join(samplesDir, template);

	fs.copy(samplePath, targetDir, (err: any): void => {
		if (err) {
			console.error('Error copying files:', err);
			process.exit(1);
		}
		console.log(`Sample project ${template} was copied to ${targetDir}`);
	});
}

async function main() {
	await promptForTemplate();
	await promptForTargetDir();
}

main();
