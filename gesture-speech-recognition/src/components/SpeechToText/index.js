import React, { useState, useContext } from "react";
import axios from "axios";

import { StateContext } from "../../Context";
import { useSpeechRecognition } from "react-speech-kit";

import { Button, Input } from "antd";
import ThumbNail from "./ThumbNail";

export default () => {
  const [value, setValue] = useState("");
  const [videos, setVideos] = useState({
    loading: true,
    links: [{ title: "hello", link: "hehe" }]
  });

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: result => {
      console.log(result);
      // getSpeechVideo(result);
      setValue(result);
    },
    onEnd: () => {
      console.log(("End: ", value));
      getSpeechVideo(value);
    }
  });
  const { dispatch } = useContext(StateContext);

  const getSpeechVideo = search => {
    setVideos({ loading: true, links: [] });

    console.log("scrapping...");
    axios
      .get(
        `https://gesture-scrape.herokuapp.com/asl?search=${search
          .split(" ")
          .join("+")}`,
        {
          cancelToken: source.token
        }
      )
      .then(response => {
        console.log("DONE!");
        setVideos({ loading: false, links: response.data.links });
      })
      .catch(thrown => {
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
        }
      });
  };

  return (
    <div className="tts">
      <div className="item">
        <Button
          size="large"
          type="primary"
          onClick={() =>
            dispatch({
              type: "updateTab",
              payload: "tts"
            })
          }
        >
          <span>Go to Text to Speech</span>
        </Button>
      </div>
      <textarea value={value} disabled readOnly />
      <div className="item videos">
        {videos.loading
          ? "Loading Videos..."
          : videos.links.map((link, index) => (
              <ThumbNail key={index} video={link} />
            ))}
      </div>

      {listening && (
        <div className="item">
          <div>Go ahead I'm listening</div>
        </div>
      )}
      <div className="item">
        <Button
          size="large"
          type="primary"
          onClick={listen}
          disabled={listening}
        >
          <span role="img">🎤 Listen</span>
        </Button>
        <Button size="large" type="danger" onClick={stop} disabled={!listening}>
          <span role="img">🚫 Stop Listening</span>
        </Button>
      </div>
    </div>
  );
};
