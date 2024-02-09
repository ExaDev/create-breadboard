import { board, code } from "@google-labs/breadboard";

const reversed = code<{ text: string }>(({ text }) => {
	const reversed = text.split("").reverse().join("");
	return {reversed};
})

export default board<{ message: string }>(({ message }, { output }) => {
	const {reversed: reversedMessage} = reversed({ text: message });
	const renamedOutput = reversedMessage.as("output").to(output());
	return renamedOutput;
});