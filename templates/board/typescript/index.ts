import { InputValues, OutputValues, base, board, code } from "@google-labs/breadboard";
import { merMake } from "../../util/merMake.js";

const myBoard = board<InputValues, OutputValues>(({}, { output }) => {
  const inputNodeOne = base.input({
    $id: "inputOne",
    schema: {
      type: "object",
      properties: {
        greet: { type: "string" },
      },
    },
  });
  const inputNodeTwo = base.input({
    $id: "inputTwo",
    schema: {
      type: "object",
      properties: {
        subject: { type: "string" },
      },
    },
  });

  const concat = code(({ base, toConcat }) => {
    const concatenated = (base as string).concat(toConcat as string);
    return { concatenated };
  })();

  inputNodeOne.greet.as("base").to(concat);
  inputNodeTwo.subject.as("toConcat").to(concat);

  const reversed = concat.concatenated.as("text").to(code(({ text }) => {
    const reversed = (text as string).split("").reverse().join("");
    return { reversed };
  })());

  return output({
    originalGreet: inputNodeOne.greet,
    originalSubject: inputNodeTwo.subject,
    concatenated: concat.concatenated,
    reversed: reversed
  });
});

console.log(
  JSON.stringify(
    await myBoard({ greet: "Hello", subject: "Breadboard" }),
    null,
    2
  )
);

await merMake({
  graph: myBoard,
  destination: import.meta.dirname,
});
