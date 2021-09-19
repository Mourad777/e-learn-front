import React from "react";
import ReactVideoPlayer from "react-player";

const VideoPlayer = ({ url, play, ended, pause,playAutomatically,muted }) => (
  <div
    style={{
      width: "100%",
    }}
  >
    <ReactVideoPlayer
      playing={playAutomatically}
      onPlay={play}
      onEnded={ended}
      onPause={pause}
      controls
      width="100%"
      height="100%"
      url={url}
      muted={muted}
    />
  </div>
);

export default VideoPlayer;
