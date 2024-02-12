import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import breadboardLogo from "../../../assets/breadboard.png";
import "./App.css";
import { myBoard } from "./breadboard";
import { useEffect, useState } from "react";
import React from "react";

function App() {
  const [outputMessage, setOutputMessage] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<string | undefined>(undefined);
  const userInput = React.createRef<HTMLInputElement>();

  const onChange = (): void => {
    setUserMessage(userInput.current?.value);
  };

  const displayValue = async () => {
    const boardRun = await myBoard({ message: userMessage });
    setOutputMessage(JSON.stringify(boardRun["output"], null));
  };

  useEffect(() => {
    displayValue();
  }, [userMessage]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://github.com/breadboard-ai/breadboard" target="_blank">
          <img
            src={breadboardLogo}
            className="logo breadboard"
            alt="Breadboard logo"
          />
        </a>
      </div>
      <h1>Vite + React + Breadboard</h1>
      <div className="card">
        <label htmlFor="userInput">
          You may enter a message for Breadboard!
        </label>
        <input
          className="userInput"
          id="userInput"
          value={userMessage}
          onChange={onChange}
          ref={userInput}
        />
        <p>{outputMessage}</p>
      </div>
    </>
  );
}

export default App;
