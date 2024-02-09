import { board } from "@google-labs/breadboard";

export default board<{ message: string }>(({ message }, { output }) => {
	const renamedOutput = message.as("output").to(output())
	return renamedOutput;
});