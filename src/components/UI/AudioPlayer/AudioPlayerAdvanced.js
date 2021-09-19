import React from "react";
import AudioPlayer from "react-modular-audio-player";

let iconStyle = { width: "fit-content" },
  rearrangedPlayerNoSeek = [
    {
      className: "tier-top",
      style: { padding: "5px 0", margin: "auto", textAlign: "center" },
      innerComponents: [
        {
          type: "play",
          style: iconStyle,
        },
        {
          type: "time",
          style: iconStyle,
        },
      ],
    },
  ],
  rearrangedPlayer = [
    {
      className: "tier-top",
      style: { padding: "5px 0", margin: "auto", textAlign: "center" },
      innerComponents: [
        {
          type: "play",
          style: iconStyle,
        },
        {
          type: "time",
          style: iconStyle,
        },
        {
          type: "seek",
        },
      ],
    },
  ];

const AudioPlayerAdvanced = ({ audioSource, noSeek,id }) => (
  <AudioPlayer
    id={id||"audioplayerabc"}
    playerWidth="100%"
    audioFiles={[{ src: audioSource }]}
    rearrange={noSeek ? rearrangedPlayerNoSeek : rearrangedPlayer}
    iconSize="1.5rem"
    fontSize="1.2rem"
    sliderClass="invert-blue-grey"
    hideForward
    hideRewind
    hideLoop
  />
);

export default AudioPlayerAdvanced;
