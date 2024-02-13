import { logError } from "./logError";

export function isValidPath(path: string, printError = false): boolean {
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
