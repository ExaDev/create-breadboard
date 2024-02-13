import { errorColor } from "./errorColor";


export function logError(message: string) {
  console.error("\n", errorColor(message));
}
