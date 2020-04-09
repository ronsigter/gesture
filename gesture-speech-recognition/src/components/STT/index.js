import React, { useState } from "react";
import axios from "axios";

import { useSpeechRecognition } from "react-speech-kit";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

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
      setValue(result);
    },
    onEnd: () => {
      console.log(("End: ", value));
      getSpeechVideo(value);
    }
  });

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
    <>
      <Row>
        "Press 🎤 Listen to speak, then press 🚫 Stop to search for video"
      </Row>
      <Row
        className="flex-nowrap align-items-center"
        style={{ height: "50%", overflowX: "scroll", marginBottom: "8px" }}
      >
        {videos.loading
          ? "Loading Videos..."
          : videos.links.map((link, index) => (
              <ThumbNail key={index} video={link} />
            ))}
      </Row>

      <Row style={{ height: "20%" }}>
        <textarea
          style={{ width: "100%", height: "100%", fontSize: "2.5em" }}
          value={value}
          disabled
          readOnly
        />
      </Row>

      <Row>
        <Button onClick={listen} disabled={listening} block>
          <span role="img">
            {listening ? "Go ahead I'm listening" : "🎤 Listen"}
          </span>
        </Button>
      </Row>
      <Row>
        <Button variant="danger" onClick={stop} disabled={!listening} block>
          <span role="img">🚫 Stop Listening</span>
        </Button>
      </Row>
    </>
  );
};
