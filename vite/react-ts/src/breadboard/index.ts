import { Board, Schema } from "@google-labs/breadboard";

const board = new Board({
  title: "Vite-React-TS",
});

export const inputAttribute = "message";

const input = board.input({
  $id: "input-message",
  schema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        title: "Input Message",
        description: "The input message",
		default: "Hello world"
      },
    },
  } satisfies Schema,
});

const output = board.output();
input.wire(inputAttribute, output);

export { board };
export { board as default };
