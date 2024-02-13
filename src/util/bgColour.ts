export const bgColour = {
	black: 40,
	red: 41,
	green: 42,
	yellow: 43,
	blue: 44,
	magenta: 45,
	cyan: 46,
	white: 47,
} as const;
export type BgColour = (typeof bgColour)[keyof typeof bgColour];
