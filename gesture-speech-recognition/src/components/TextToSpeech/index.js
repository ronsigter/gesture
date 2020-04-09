import React, { useState, useContext, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import { StateContext } from "../../Context";

import { Button, Input } from "antd";

export default () => {
  const [value, setValue] = useState("");
  const { speak } = useSpeechSynthesis();
  const { state, dispatch } = useContext(StateContext);

  useEffect(() => {
    speak({ text: state.data.predict });
  }, [state.data.predict]);

  return (
    <div className="tts">
      <div className="item">
        <Button
          size="large"
          type="primary"
          onClick={() =>
            dispatch({
              type: "updateTab",
              payload: "stt"
            })
          }
        >
          <span>Go to Speech to Text</span>
        </Button>
      </div>
      <textarea
        placeholder="Type what you want to hear"
        value={state.data.predict}
        onChange={event => setValue(event.target.value)}
      />
      <div className="item">
        <Button
          size="large"
          type="primary"
          onClick={() => speak({ text: value })}
          // disabled={value.length <= 0}
        >
          <span role="img">🔈 Speak</span>
        </Button>
        <Button size="large" onClick={() => setValue("")}>
          <span role="img">Clear</span>
        </Button>
      </div>
    </div>
  );
};
