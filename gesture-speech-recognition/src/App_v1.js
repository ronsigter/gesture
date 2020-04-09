import React, { useContext } from "react";
import TextToSpeech from "./components/TextToSpeech";
import SpeechToText from "./components/SpeechToText";
import WebBluetooth from "./components/WebBluetooth";
import GestureGraph from "./components/GestureGraph";

import { StateContext } from "./Context";

import "./app.scss";
function App() {
  const { state } = useContext(StateContext);
  console.log("State", state.data);
  return (
    <div className="container">
      <div className="title">
        <h1 className="title">Gesture-Speech-Recognition</h1>
        <p>
          To use Bluetooth and Microphone, enable chrome experimental mode by
          typing
          <i style={{ color: "blue" }}>
            {" "}
            "chrome://flags/#enable-experimental-web-platform-features"{" "}
          </i>
          in Chrome browser
        </p>
      </div>

      <WebBluetooth />
      {state.tab === "tts" ? <TextToSpeech /> : <SpeechToText />}
      <GestureGraph />
    </div>
  );
}

export default App;
