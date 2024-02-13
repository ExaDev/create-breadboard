import fs from "fs-extra";
import path from "path";

export function findPackageRoot(directory: string): string {
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
