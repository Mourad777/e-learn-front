import React from "react";
import { Field } from "redux-form";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Editor from "../../Editor/Editor";
import Switch from "../../../components/UI/Switch/Switch";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import classes from "./LessonForm.module.css";
import FileInput from "../../../components/UI/FormElements/FileInput/FileInput";
import VideoPlayer from "../../../components/UI/VideoPlayer/VideoPlayer";
import { start, stop, previewAudio } from "../../../utility/audioRecorder";
import { AudioPlayer, AudioPreview, ClearAudioButton } from "../../../components/UI/AudioPlayer/AudioPlayerRecorder";

const renderSlides = ({
    fields,
    meta: { error, submitFailed },
    formValues = {},
    course,
    formErrors,
    touchField,
    t,
    editing,
    newLessonId,
    changeField,
    getAudioRecording,
    getAudioSource,
    setAudioData,
    initiateRecording,
    getRecorderFromClick,
    getRecordingTimeout,
  
  }) => (
    <ul className={classes.FormList}>
      {(fields || []).map((slide, idx) => {
        const typeSwitchOps = {
          label: t("lessonForm.fields.videoContent"),
          checked: false,
        };
        const audioSwitchOps = {
          label: t("lessonForm.fields.audioFromFile"),
          checked: false,
          disabled: !!((formErrors.slides || [])[idx] || {}).audioFile,
        };
        const lessonId = editing
          ? formValues._id
          : newLessonId;
        const path = `courses/${course._id}/lessons/${lessonId}`;
  
        if (!lessonId) return null;
        return (
          <li className={classes.SlideCustomizationContainer} key={idx}>
            <Typography variant="h6" gutterBottom>
              {`${t("lessonForm.slide")} ${idx + 1}`}
            </Typography>
            <Field
              name={`slides.${idx}.videoContent`}
              options={typeSwitchOps}
              component={Switch}
            />
            {!((formValues.slides || [])[idx] || {}).videoContent ? (
              <Aux>
                <div className={classes.TextEditor}>
                  <Field
                    name={`slides.${idx}.slideContent`}
                    component={Editor}
                    path={path}
                    reduxForm="lessonForm"
                    field={`slides.${idx}.slideContent`}
                  />
                </div>
                <Field
                  name={`slides.${idx}.audioUpload`}
                  options={audioSwitchOps}
                  component={Switch}
                />
                <Aux>
                  {((formValues.slides || [])[idx] || {}).audioUpload ? (
                    <Aux>
                      <div
                        style={{ textAlign: "center" }}
                        className={classes.flexPositioningEven}
                      >
                        <Field
                          name={`slides.${idx}.audioFile`}
                          index={idx}
                          uploadButtonText={t("lessonForm.buttons.selectAudioFile")}
                          onChangeFile={(audio) => {
                            changeField(`slides.${idx}.recordedBlob`, audio);
                            touchField(`slides.${idx}.audioFile`);
                          }}
                          component={FileInput}
                          loadedFile={getAudioRecording(formValues, idx)}
                          mimeTypesAllowed={"audio/*"}
                          extensionsAllowed={["mp3", "wav", "wma"]}
                        />
                        <AudioPreview
                          onPreview={() => {
                            if (!getAudioSource(formValues, idx)) return;
                            previewAudio(`slideAudio[${idx}]`);
                          }}
                          id={`slideAudio[${idx}]`}
                          audioSource={getAudioSource(formValues, idx)}
                        />
                      </div>
                      <ClearAudioButton
                        onClear={() => setAudioData(null, null, idx)}
                      />
                    </Aux>
                  ) : (
                    <AudioPlayer
                      onStart={async (e) => {
                        const startData =
                          (await start(e, null, idx, null, async (data) => {
                            const timeoutData = await data;
                            setAudioData(
                              timeoutData.blob,
                              timeoutData.file,
                              idx
                            );
                          })) || {};
                        initiateRecording(
                          startData.recorder,
                          startData.recordingTimeout,
                          idx
                        );
                      }}
                      onStop={async (e) => {
                        const stoppedData =
                          (await stop(
                            e,
                            null,
                            idx,
                            getRecordingTimeout(formValues, idx),
                            getRecorderFromClick(formValues, idx)
                          )) || {};
                        setAudioData(
                          stoppedData.blob,
                          stoppedData.file,
                          idx
                        );
                      }}
                      onPreview={() => {
                        previewAudio(`slideAudio[${idx}]`);
                      }}
                      onClear={() => setAudioData(null, null, idx)}
                      id={`slideAudio[${idx}]`}
                      recordDisabled={getAudioRecording(formValues, idx)}
                      audioSource={getAudioSource(formValues, idx)}
                    />
                  )}
                </Aux>
              </Aux>
            ) : (
              <div style={{ textAlign: "center" }}>
                <Field
                  name={`slides.${idx}.videoFile`}
                  onChangeFile={(file) => {
                    changeField(`slides.${idx}.loadedVideo`, file);
                  }}
                  uploadButtonText={t("lessonForm.buttons.selectVideoFile")}
                  index={idx}
                  component={FileInput}
                  loadedFile={
                    ((formValues.slides || [])[idx] || {}).loadedVideo
                  }
                  onClear={() => {
                    changeField(`slides.${idx}.loadedVideo`, null);
                    changeField(`slides.${idx}.videoFile`, null);
                  }}
                  videoFile
                  mimeTypesAllowed={"video/*,video/x-matroska"}
                  extensionsAllowed={["mp4", "avi", "mov", "mkv", "webm"]}
                >
                  {((formValues.slides || [])[idx] || {}).loadedVideo && (
                    <VideoPlayer
                      url={((formValues.slides || [])[idx] || {}).loadedVideo}
                    />
                  )}
                </Field>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
              <Button
                color="secondary"
                onClick={() => {
                  fields.remove(idx);
                }}
                disabled={(formValues.slides || []).length === 1}
              >
                {t("lessonForm.buttons.removeSlide")}
              </Button>
            </div>
          </li>
        );
      })}
      <li>
        <div style={{ display: 'flex', justifyContent: "space-evenly" }}>
          <Button
            color="primary"
            onClick={() => fields.push({})}
          >
            {t("lessonForm.buttons.addSlide")}
          </Button>
        </div>
  
        {submitFailed && error && <span>{error}</span>}
      </li>
    </ul>
  );
  
export default renderSlides;