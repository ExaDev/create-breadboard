export const modeOptions = {
	overwrite: "overwrite",
	merge: "merge",
	abort: "abort",
} as const;
export type ModeOption = keyof typeof modeOptions;
export const modeOptionsArray = Object.values(modeOptions);
