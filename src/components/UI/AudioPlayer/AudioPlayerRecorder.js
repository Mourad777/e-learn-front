import React from "react";
import Button from "@material-ui/core/Button";
import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/Stop";
import classes from "./AudioPlayer.module.css";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

export const AudioPreview = ({
  onPreview,
  audioSource,
  id,
  previewType,
  previewText,
  disabled,
  fullWidth,
}) => {
  const { t } = useTranslation()
  return (
    <Aux>
      {previewType === "button" ? (
        <Aux>
          <audio id={id} src={audioSource} />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              fullWidth={fullWidth}
              onClick={onPreview}
              color="primary"
              disabled={!audioSource || audioSource === "" || disabled}
            >
              {previewText ? previewText : t("audioRecorder.buttons.preview")}
            </Button>
          </div>
        </Aux>
      ) : (
        <div className={classes.AudioAlignment}>
          <audio id={id} src={audioSource} />
          <span className={classes.Pointer} onClick={onPreview}>
            <i
              className={
                audioSource
                  ? `fa fa-volume-down fa-2x ${classes.greenIcon}`
                  : `fa fa-volume-down fa-2x ${classes.redIcon}`
              }
            ></i>
          </span>
        </div>
      )}
    </Aux>
  );
};

export const ClearAudioButton = ({ onClear, clearDisabled }) => {
  const { t } = useTranslation();
  return (
    <div className={classes.flexPositioningEven}>
      <Button color="secondary" onClick={onClear} disabled={clearDisabled}>
        {t("audioRecorder.buttons.clearAudio")}
      </Button>
    </div>
  );
};

export const AudioPlayer = ({
  onStart,
  onStop,
  onPreview,
  recordDisabled,
  audioSource,
  id,
  meta = {},
  error,
  onClear,
  clearDisabled,
  recordButtonText,
  previewType, //can be button or icon
  isMicAlert,
}) => {
  const { t } = useTranslation();
  return (
    <Aux>
      {previewType === "button" && (
        <div className={classes.flexPositioningEven}>
          <Button
            onClick={onStart}
            disabled={recordDisabled || isMicAlert}
            startIcon={<MicIcon />}
            color="primary"
          >
            {recordButtonText
              ? recordButtonText
              : t("audioRecorder.buttons.record")}
          </Button>
        </div>
      )}
      <div style={{ margin: "auto", display: "block", width: "60%" }}>
        {isMicAlert && (
          <Typography
            style={{ textAlign: "center" }}
            variant="caption"
            color="error"
          >
            {t("audioRecorder.errors.micBlocked")}
          </Typography>
        )}
      </div>
      <div className={classes.flexPositioningEven}>
        {previewType !== "button" && (
          <Button
            onClick={onStart}
            disabled={recordDisabled || isMicAlert}
            startIcon={<MicIcon />}
          >
            {recordButtonText
              ? recordButtonText
              : t("audioRecorder.buttons.record")}
          </Button>
        )}
        <Button
          onClick={onStop}
          disabled={!recordDisabled || isMicAlert}
          startIcon={<StopIcon />}
        >
          {t("audioRecorder.buttons.stop")}
        </Button>

        <AudioPreview
          onPreview={audioSource ? onPreview : null}
          audioSource={audioSource}
          id={id}
          previewType={previewType}
        />
      </div>
      <div className={classes.flexPositioningEven}>
        <span className={classes.errorText}>
          {(meta.error || error) && meta.touched ? meta.error || error : ""}{" "}
        </span>
      </div>

      <div className={classes.flexPositioningEven}>
        <ClearAudioButton onClear={onClear} clearDisabled={clearDisabled} />
      </div>
    </Aux>
  );
};
