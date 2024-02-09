import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import breadboardLogo from "../../../assets/breadboard.png";
import "./App.css";
import board, { inputAttribute } from "./breadboard";
import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const displayValue = async () => {
    for await (const run of board.run()) {
      if (run.type === "input") {
        run.inputs = {
          [inputAttribute]: "Hello from Breadboard",
        };
      } else if (run.type === "output") {
        const output = run.outputs;
        setMessage(JSON.stringify(output["message"], null));
      }
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={breadboardLogo}
            className="logo breadboard"
            alt="Breadboard logo"
          />
        </a>
      </div>
      <h1>Vite + React + Breadboard</h1>
      <div className="card">
        <button onClick={displayValue}>
          Click here to get a message from Breadboard
        </button>
        <p>{message}</p>
      </div>
    </>
  );
}

export default App;
