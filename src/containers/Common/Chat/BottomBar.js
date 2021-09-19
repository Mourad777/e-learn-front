import React from "react";

import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import InputBase from "@material-ui/core/InputBase";
import Toolbar from "@material-ui/core/Toolbar";
import ChatIcon from "@material-ui/icons/Chat";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import { withTranslation } from "react-i18next";
import FileInput from "../../../components/UI/FormElements/FileInput/FileInput";
import UploadSpinner from "../../../components/UI/upload-spinner/upload-spinner";
import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/Stop";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideoPlayer from "../../../components/UI/VideoPlayer/VideoPlayer";
import "./Chat.css";
import { getVideoRecording } from "../../../utility/audioRecorder";
import { start, stop, previewAudio } from "../../../utility/audioRecorder";
import AudioPlayerAdvanced from "../../../components/UI/AudioPlayer/AudioPlayerAdvanced";

const useStyles = makeStyles((theme) => ({
  formLayout: {
    display: "flex",
    justifyContent: "space-between",
  },
  appBar: {
    bottom:1,
    top: "auto",
    width: "100%",
    // [theme.breakpoints.up(500)]: {
    //   bottom: 1,
    // },
    [theme.breakpoints.up(600)]: {
      width:props=>props.isSmallDrawer ? "calc(100vw - 60px)" : "calc(100vw - 200px)",
    },
  },
  inputContainer: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    // marginLeft: theme.spacing(1),
    position: "relative",
    width: "100%",
  },
  icon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    width: "100%",
  },
}));

function BottomBar({
  handleContent,
  handleSubmit,
  content,
  t,
  isSelectedInstructor,
  isOfficeHour,
  isInstructorPanel,
  chatAlwaysOpen,
  handleAttachedFile,
  loadedFile,
  isUploading,
  onSetRecorder,
  onSetAudioRecorder,
  recorder,
  stream,
  audioRecorder,
  audioTimeoutId,
  isFile,
  isSmallDrawer,
}) {
  const classes = useStyles({isSmallDrawer});
  let loadedFileExtension;
  if (loadedFile)
    loadedFileExtension = (loadedFile || {}).name
      .toLowerCase()
      .split(".")
      .pop();
  // const isUploading = true
  // const loadedFile = true
  let icon;
  let loadedFileType;
  if (loadedFileExtension === "pdf")
    icon = <i className="far fa-file-pdf fa-2x"></i>;
  if (loadedFileExtension === "mp3") {
    loadedFileType = "audio";
    // icon = <i className="fas fa-file-audio fa-2x"></i>;
  }
  if (loadedFileExtension === "docx" || loadedFileExtension === "doc")
    icon = <i className="fas fa-file-word fa-2x"></i>;
  if (
    loadedFileExtension === "jpeg" ||
    loadedFileExtension === "jpg" ||
    loadedFileExtension === "jfif"
  ) {
    loadedFileType = "image";
    // icon = <i className="fas fa-file-image fa-2x"></i>;
  }
  if (
    loadedFileExtension === "avi" ||
    loadedFileExtension === "mp4" ||
    loadedFileExtension === "mkv" ||
    loadedFileExtension === "webm"
  ) {
    loadedFileType = "video";
    // icon = <i className="far fa-file-video fa-2x"></i>;
  }

  const submitButtonDisabled =
    audioRecorder ||
    recorder ||
    isUploading ||
    (!chatAlwaysOpen &&
      ((isSelectedInstructor && !isOfficeHour) ||
        (isInstructorPanel && !isOfficeHour)));
  let url;
  if (loadedFile) {
    url = URL.createObjectURL(loadedFile);
  }
  return (
    <AppBar position="fixed" className={classes.appBar}>
      {recorder && <VideoPlayer muted playAutomatically url={stream} />}
      {loadedFile && (
        <div style={{ display: "flex", padding: 5 }}>
          <div style={{ display: "contents" }}>
            {loadedFileType === "audio" && (
              <AudioPlayerAdvanced audioSource={url} />
            )}
            {loadedFileType === "image" && (
              <div
                style={{
                  backgroundImage: `url("${url}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  height: 80,
                  borderRadius: "3px",
                  width: "30%",
                  // margin: "auto",
                }}
              />
            )}
            {loadedFileType === "video" && <VideoPlayer url={url} />}
          </div>
          {isUploading && (
            <div style={{ marginLeft: 25 }}>
              {" "}
              <UploadSpinner />
            </div>
          )}
          <div
            style={{
              opacity: isUploading ? 0.3 : 1,
              color: "white",
              marginLeft: 15,
            }}
          >
            {icon}
          </div>
          <div
            style={{ marginLeft: 15, cursor: "pointer" }}
            onClick={() => handleAttachedFile("")}
          >
            <i
              style={{ color: "#ffc000" }}
              className="fas fa-window-close fa-2x"
            ></i>
          </div>
        </div>
      )}
      <Toolbar style={{ padding: "5px" }}>
        <div className={classes.inputContainer}>
          <form onSubmit={handleSubmit} className={classes.formLayout}>
            <div style={{ display: "flex", flexDirection: "column-reverse", width: '100%' }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  justifyContent: "center",
                }}
              >
                <div className={classes.icon}>
                  <ChatIcon />
                </div>
                <InputBase
                  multiline
                  disabled={
                    !chatAlwaysOpen &&
                    ((isSelectedInstructor && !isOfficeHour) ||
                      (isInstructorPanel && !isOfficeHour))
                  }
                  onChange={handleContent}
                  onKeyPress={(e) => {

                    if ((e.keyCode === 13 || e.charCode === 13) && !submitButtonDisabled) {
                      handleSubmit(e)
                    }
                  }}
                  value={content}
                  placeholder={t("chat.typeMessage")}
                  style={{ width: "100%" }}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "content" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <IconButton
                  disabled={loadedFile || recorder}
                  onClick={async (e) => {
                    if (!audioRecorder) {
                      const startData =
                        (await start(
                          e,
                          null,
                          null,
                          "chatAudioRecorder",
                          async (data) => {
                            const timeoutData = await data;
                            await handleAttachedFile(timeoutData.file);
                            onSetAudioRecorder({
                              audioRecorder: null,
                              audioTimeoutId: null,
                            });
                          }
                        )) || {};
                      onSetAudioRecorder({
                        audioRecorder: startData.recorder,
                        audioTimeoutId: startData.recordingTimeout,
                      });
                    } else {
                      const stoppedData =
                        (await stop(
                          e,
                          null,
                          "chatAudioRecorder",
                          audioTimeoutId,
                          audioRecorder
                        )) || {};
                      onSetAudioRecorder({
                        audioRecorder: null,
                        audioTimeoutId: null,
                      });
                      await handleAttachedFile(stoppedData.file);
                    }
                  }}
                  component="span"
                >
                  {audioRecorder ? (
                    <StopIcon style={{ color: "white" }} />
                  ) : (
                      <MicIcon
                        style={{
                          color: "white",
                          opacity: loadedFile || recorder ? 0.3 : 1,
                        }}
                      />
                    )}
                </IconButton>
                <IconButton
                  disabled={loadedFile || audioRecorder}
                  onClick={async () => {
                    if (!recorder) {
                      await getVideoRecording(
                        ({ recorder, stream }) => {
                          onSetRecorder({ recorder, stream });
                        },
                        async (file) => {
                          await handleAttachedFile(file);
                        }
                      );
                    } else {
                      recorder.stopRecording(async () => {
                        const blob = recorder.getBlob();
                        const videoFile = new File(
                          [blob],
                          "video-recording.webm",
                          {
                            type: "video/webm",
                          }
                        );
                        await handleAttachedFile(videoFile);
                        onSetRecorder({ recorder: null, stream: null });
                        stream.stop();
                      });
                    }
                  }}
                  component="span"
                >
                  {!recorder ? (
                    <VideocamIcon
                      style={{
                        color: "white",
                        opacity: loadedFile || audioRecorder ? 0.3 : 1,
                      }}
                    />
                  ) : (
                      <StopIcon style={{ color: "white" }} />
                    )}
                </IconButton>
                <FileInput
                  // loadedFile={loadedFile}
                  mimeTypesAllowed={
                    "audio/*, video/*, video/x-matroska, image/jpeg, application/pdf, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  }
                  extensionsAllowed={[
                    "jpeg",
                    "jpg",
                    "jfif",
                    "png",
                    "pdf",
                    "docx",
                    "doc",
                    "mp4",
                    "avi",
                    "mkv",
                    "mp3",
                    "webm",
                  ]}
                  input={{
                    value: "",
                    onChange: (file) => {
                      handleAttachedFile(file);
                    },
                  }}
                  onChangeFile={(file) => {
                  }}
                  // compressImage
                  attachIcon
                  disabled={loadedFile || recorder || audioRecorder}
                />
                {isFile && (
                  <IconButton
                    style={{
                      color: "white",
                      opacity: submitButtonDisabled ? 0.3 : 1,
                    }}
                    size="medium"
                    // color="secondary"
                    aria-label="delete"
                    onClick={handleSubmit}
                    disabled={submitButtonDisabled}
                  >
                    <SendIcon />
                  </IconButton>
                )}

              </div>
            </div>
          </form>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default withTranslation("common")(BottomBar);
