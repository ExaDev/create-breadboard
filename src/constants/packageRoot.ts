import { findPackageRoot } from "../util/findPackageRoot";
import { __dirname } from "./dirname";

export const packageRoot = findPackageRoot(__dirname);
