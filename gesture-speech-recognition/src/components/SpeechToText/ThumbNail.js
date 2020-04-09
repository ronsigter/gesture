import React from "react";

const ThumbNail = ({ video }) => {
  return (
    <div className="video">
      <video width="168" height="126" controls>
        <source src={video.link} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="title">
        <a href={video.link} target="_blank">
          {video.title}
        </a>
      </div>
    </div>
  );
};

export default ThumbNail;
