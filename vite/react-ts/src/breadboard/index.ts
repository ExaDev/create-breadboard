import { board } from "@google-labs/breadboard";

const myBoard = board<{ message: string }>(({ message }, { output }) => {
	const renamedOutput = message.as("output").to(output());
	return renamedOutput;
  });

export { myBoard };
export { myBoard as default };
