import React from "react";
import classes from './AudioPlayer.module.css'


const InlineAudioPlayer = ( {source, id} ) => (
  <td
    dangerouslySetInnerHTML={{
      __html: `
        <audio id="${id}" src="${source}">
        </audio>
        <span class="${classes.Pointer}" onClick="(function(){
        const audio = document.getElementById('${id}');
        audio.play()
        return false;
        })();return false;" >
        <i class="fa fa-volume-down"></i>
        </span>
        `,
    }}
  />
);

export default InlineAudioPlayer;