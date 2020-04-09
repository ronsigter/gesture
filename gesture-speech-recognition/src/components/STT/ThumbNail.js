import React, { useState, useEffect } from "react";

const ThumbNail = ({ video }) => {
  const [width, setWidth] = useState(window.innerWidth - 100);

  useEffect(() => {
    setWidth(window.innerWidth - 100);
  }, [window.innerWidth]);

  return (
    <div style={{ margin: "4px" }}>
      <video width={width} height={(3 * width) / 4} controls>
        <source src={video.link} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="title">
        <a href={video.link} target="_blank" rel="noopener noreferrer">
          {video.title}
        </a>
      </div>
    </div>
  );
};

export default ThumbNail;
