export function shellIsInteractive(): boolean {
	return process.stdin.isTTY;
}
