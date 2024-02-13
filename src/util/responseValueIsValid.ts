export function responseValueIsValid(value: any, name?: string, print = false): boolean {
	const result = value && typeof value == "string" && value.length > 0;
	if (!result && print) {
		console.error("Invalid value", print ? name : undefined, value);
	}
	return value;
}
