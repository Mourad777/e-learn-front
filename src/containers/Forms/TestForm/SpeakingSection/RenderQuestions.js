import React, { useEffect, useState } from "react";
import { Field } from "redux-form";
import { AudioPlayer } from "../../../../components/UI/AudioPlayer/AudioPlayerRecorder";
import { start, stop, previewAudio } from "../../../../utility/audioRecorder";
import NumberPicker from "../../../../components/UI/FormElements/NumberPicker/NumberPicker";
import Button from "@material-ui/core/Button";
import classes from "../TestForm.module.css";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Editor from "../../../Editor/Editor";
import Switch from "../../../../components/UI/Switch/Switch";
import FileInput from "../../../../components/UI/FormElements/FileInput/FileInput";
import Typography from "@material-ui/core/Typography";

export const RenderQuestions = ({
  changeField,
  makeAudioFieldTouched,
  fields,
  meta,
  formValues = {},
  path,
  t,
}) => {
  const [micBlockedWarning, setMicBlockedWarning] = useState(false);
  const [micBlockedWarningTO, setMicBlockedWarningTO] = useState(null);
  const handleMicAlert = () => {
    clearTimeout(micBlockedWarningTO);
    setMicBlockedWarning(true);

    const timeoutId = setTimeout(() => {
      setMicBlockedWarning(false);
    }, 5000);
    setMicBlockedWarningTO(timeoutId);
  };

  useEffect(() => {
    return () => {
      clearTimeout(micBlockedWarningTO);
    };
  }, []);

  const switchOptionsQuestion = {
    label: t("testForm.fields.audioQuestion"),
    checked: false,
  };
  const switchOptionsAnswer = {
    label: t("testForm.fields.audioAnswer"),
    checked: false,
  };
  const initiateRecording = (recorder, timeout, index, type, isRecording) => {
    if (!isRecording) {
      handleMicAlert(true);
      return;
    }
    if (type === "question") {
      changeField(
        `speakingQuestions.${index}.isRecordingQuestion`,
        isRecording
      );
      changeField(`speakingQuestions.${index}.questionRecorder`, recorder);
      changeField(
        `speakingQuestions.${index}.questionRecordingTimeout`,
        timeout
      );
    }
    if (type === "answer") {
      changeField(`speakingQuestions.${index}.isRecording`, true);
      changeField(`speakingQuestions.${index}.recorder`, recorder);
      changeField(`speakingQuestions.${index}.recordingTimeout`, timeout);
    }
  };
  const setAudioData = (blob, file, index, type) => {
    if (type === "question") {
      changeField(`speakingQuestions.${index}.isRecordingQuestion`, false);
      changeField(`speakingQuestions.${index}.questionRecordedBlob`, blob);
      changeField(`speakingQuestions.${index}.audioFileQuestion`, file);
      makeAudioFieldTouched(`speakingQuestions.${index}.questionRecordedBlob`);
    }
    if (type === "answer") {
      changeField(`speakingQuestions.${index}.isRecording`, false);
      changeField(`speakingQuestions.${index}.recordedBlob`, blob);
      changeField(`speakingQuestions.${index}.audioFile`, file);
      makeAudioFieldTouched(`speakingQuestions.${index}.recordedBlob`);
    }
  };
  return (
    <ul className={classes.TestFormList}>
      {fields.map((question, index) => {
        const speakingQuestion =
          (formValues.speakingQuestions || [])[index] || {};
        const recordingTimeoutAnswer = speakingQuestion.recordingTimeout;
        const recordingTimeoutQuestion =
          speakingQuestion.questionRecordingTimeout;
        const recorderFromClickAnswer = speakingQuestion.recorder;
        const recorderFromClickQuestion = speakingQuestion.questionRecorder;
        const audioSourceQuestion = speakingQuestion.questionRecordedBlob;
        const audioSourceAnswer = speakingQuestion.recordedBlob;
        const questionIsRecording = speakingQuestion.isRecordingQuestion;
        const answerIsRecording = speakingQuestion.isRecording;
        const audioPlayer = ["question", "answer"].map((type, typeIndex) => (
          <Field
            component={AudioPlayer}
            name={`speakingQuestions.${index}.${typeIndex === 0 ? "questionRecordedBlob" : "recordedBlob"
              }`}
            onStart={async (e) => {
              const startData =
                (await start(e, type, index, null, async (data) => {
                  const timeoutData = await data;
                  setAudioData(timeoutData.blob, timeoutData.file, index, type);
                })) || {};
              initiateRecording(
                startData.recorder,
                startData.recordingTimeout,
                index,
                type,
                startData.isRecording
              );
            }}
            onStop={async (e) => {
              const stoppedData =
                (await stop(
                  e,
                  null,
                  index,
                  typeIndex === 0
                    ? recordingTimeoutQuestion
                    : recordingTimeoutAnswer,
                  typeIndex === 0
                    ? recorderFromClickQuestion
                    : recorderFromClickAnswer
                )) || {};
              setAudioData(stoppedData.blob, stoppedData.file, index, type);
            }}
            onPreview={() => {
              previewAudio(
                typeIndex === 0
                  ? `audioQuestion[${index}]`
                  : `audioAnswer[${index}]`
              );
            }}
            onClear={() => setAudioData(null, null, index, type)}
            id={
              typeIndex === 0
                ? `audioQuestion[${index}]`
                : `audioAnswer[${index}]`
            }
            recordDisabled={
              typeIndex === 0 ? questionIsRecording : answerIsRecording
            }
            audioSource={
              typeIndex === 0 ? audioSourceQuestion : audioSourceAnswer
            }
            isMicAlert={micBlockedWarning}
          />
        ));
        const switchField = ["question", "answer"].map((type) => (
          <Field
            name={`speakingQuestions.${index}.${type === "question" ? "audioQuestion" : "audioAnswer"
              }`}
            options={
              type === "question" ? switchOptionsQuestion : switchOptionsAnswer
            }
            component={Switch}
            type="checkbox"
          />
        ));
        return (
          <li key={index} className={classes.QuestionCustomizationContainer}>
            <Typography variant="h6" gutterBottom>
              {`${t("testForm.question")} ${index + 1}`}
            </Typography>
            {switchField[0]}
            {!speakingQuestion.audioQuestion ? (
              <div className={classes.TextEditor}>
                <Field
                  name={`${question}.question`}
                  field={`${question}.question`}
                  reduxForm="testForm"
                  component={Editor}
                  path={path}
                />
              </div>
            ) : (
              <Aux>
                <div style={{ textAlign: "center" }}>
                  <Field
                    name={`speakingQuestions.${index}.audioFileQuestion`}
                    index={`q${index}`}
                    onChangeFile={(audio) => {
                      changeField(
                        `speakingQuestions.${index}.questionRecordedBlob`,
                        audio
                      );
                    }}
                    uploadButtonText={t("testForm.buttons.selectAudioFile")}
                    component={FileInput}
                    uploadButtonText={t("testForm.buttons.selectAudioFile")}
                    mimeTypesAllowed={"audio/*"}
                    extensionsAllowed={["mp3", "wav", "wma"]}
                    loadedFile={speakingQuestion.questionRecordedBlob}
                  />
                </div>
                {audioPlayer[0]}
              </Aux>
            )}
            <div>
              {switchField[1]}
              {speakingQuestion.audioAnswer === true && (
                <Aux>
                  <div style={{ textAlign: "center" }}>
                    <Field
                      name={`speakingQuestions.${index}.audioFile`}
                      uploadButtonText={t("testForm.buttons.selectAudioFile")}
                      index={`a${index}`}
                      onChangeFile={(audio) => {
                        changeField(
                          `speakingQuestions.${index}.recordedBlob`,
                          audio
                        );
                      }}
                      uploadButtonText={t("testForm.buttons.selectAudioFile")}
                      component={FileInput}
                      mimeTypesAllowed={"audio/*"}
                      extensionsAllowed={["mp3", "wav", "wma"]}
                      loadedFile={speakingQuestion.recordedBlob}
                    />
                  </div>

                  {audioPlayer[1]}
                </Aux>
              )}
            </div>
            <div style={{ marginTop: 15 }}>
              <Field
                name={`${question}.marks`}
                component={NumberPicker}
                options={{ label: t("testForm.fields.marks"), size: "small" }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                onClick={() => fields.remove(index)}
                color="secondary"
                disabled={(formValues.speakingQuestions || []).length === 1}
              >
                {t("testForm.buttons.removeQuestion")}
              </Button>
            </div>
          </li>
        );
      })}

      <li>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            onClick={() => fields.push({ marks: 1 })}
            size="medium"
            color="primary"
          >
            {t("testForm.buttons.addQuestion")}
          </Button>
        </div>
        {meta.submitFailed && meta.error && <span>{meta.error}</span>}
      </li>
    </ul>
  );
};
