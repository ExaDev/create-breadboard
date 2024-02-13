import fs from "fs-extra";
import path from "path";
import { packageRoot } from "../constants/packageRoot";

export const packageJson: {
  version: "string";
} = JSON.parse(
  fs.readFileSync(path.resolve(path.join(packageRoot, "package.json")), "utf8")
);
