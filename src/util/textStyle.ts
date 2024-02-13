export const textStyle = {
	bold: 1,
	dim: 2,
	italic: 3,
	underline: 4,
	blink: 5,
	reverse: 7,
	hidden: 8,
	frame: 51,
	encircle: 52,
	overline: 53,
	crossedOut: 9,
} as const;
export type TextStyle = (typeof textStyle)[keyof typeof textStyle];
