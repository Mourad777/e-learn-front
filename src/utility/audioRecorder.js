import MicRecorder from "mic-recorder-to-mp3";
import { store } from "../index";
import RecordRTC from "recordrtc";
const saveRecording = async (
  recFromTimeout,
  type,
  index,
  recorderFromClick
) => {
  console.log("saving");
  let recorder = new MicRecorder({ bitRate: 128 });
  if ((recorderFromClick || {}).lameEncoder) {
    recorder = recorderFromClick;
  }
  if ((recFromTimeout || {}).lameEncoder) {
    recorder = recFromTimeout;
  }
  console.log('is recorder: ',recorder)
  if (recorder) {
    return await recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        const file = new File(
          buffer,
          type ? `${index}-[${type}]recording.mp3` : `${index}-recording.mp3`,
          {
            type: blob.type,
            lastModified: Date.now(),
          }
        );
        return {
          blob: blobURL,
          file: file,
          index,
        };
      });
  }
};

export const stop = (e, type, index, recordingTimeout, recorderFromClick) => {
  if (!e) return;
  e.preventDefault();
  const recordedData = saveRecording(null, type, index, recorderFromClick);
  clearTimeout(recordingTimeout);
  return recordedData;
};

export const start = async (
  e,
  type,
  index,
  blockedRecorder,
  setTimeoutData
) => {
  const recorder = new MicRecorder({ bitRate: 128 });
  if (!e) return;
  e.preventDefault();

  try {
    await recorder.start();
    const state = store.getState();
    const voiceRecordTimeLimit =
      state.common.configuration.voiceRecordTimeLimit || 60;
    const recTimeout = setTimeout(() => {
      const recordedData = saveRecording(recorder, type, index);
      setTimeoutData(recordedData);
    }, voiceRecordTimeLimit * 1000);
    return {
      recordingTimeout: recTimeout,
      isRecording: true,
      recorder: recorder,
      index: index,
    };
  } catch (e) {
    return {
      isRecording: false,
    };
  }
};

export const previewAudio = (audioId) => {
  const audio = document.getElementById(audioId);
  if (!audio) return;
  audio.play();
};

export const getVideoRecording = async (onStartRecording,onSaveRecording) => {
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch (e) {
    console.log("e: ", e);
  }

  const recorder = RecordRTC(stream, {
    type: "video",
    mimeType: 'video/webm;codecs=h264',
    canvas: {
        width: 640,
        height: 480
    },
  });
  onStartRecording({recorder,stream})
  recorder.startRecording();
  const sleep = (m) => new Promise((r) => setTimeout(r, m));
  const videoRecordingTimeLimit = 60000;
  await sleep(videoRecordingTimeLimit);
     recorder.stopRecording(async () => {
        const blob = recorder.getBlob();
        const videoFile = new File([blob], "video-recording.webm", {
          type: "video/webm",
        });
        onSaveRecording(videoFile)
        onStartRecording({recorder:null,stream:null});
        stream.stop();
      });
};