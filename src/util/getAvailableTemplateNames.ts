import fs from "fs-extra";
import path from "path";
import { samplesDir } from "../constants/samplesDir";

export function getAvailableTemplateNames(directory: string = samplesDir): string[] {
  const templateDirContents = fs.readdirSync(directory);
  const templateDirDirs = templateDirContents.filter((name: string) =>
    fs.statSync(path.join(directory, name)).isDirectory()
  );
  return templateDirDirs.map((name: string) => path.basename(name));
}
