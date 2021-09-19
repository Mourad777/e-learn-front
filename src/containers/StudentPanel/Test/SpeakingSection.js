import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { reduxForm, change, Field } from "redux-form";
import validate from "./validate";
import Button from "@material-ui/core/Button";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import VolumeUpRoundedIcon from "@material-ui/icons/VolumeUpRounded";
import Typography from "@material-ui/core/Typography";
import { start, stop, previewAudio } from "../../../utility/audioRecorder";
import TestMaterials from "./TestMaterials/TestMaterials";
import { AudioPlayer } from "../../../components/UI/AudioPlayer/AudioPlayerRecorder";
import { useTranslation } from "react-i18next";

const SpeakingSection = ({ formValues = {}, changeField, testInSession }) => {
  const questionBox = {
    background: "#1976d2",
    borderRadius: 4,
    color: "white",
    padding: 10,
  };
  const { t } = useTranslation()
  const [micBlockedWarning, setMicBlockedWarning] = useState(false);
  const [micBlockedWarningTO, setMicBlockedWarningTO] = useState(false);

  const handleMicAlert = () => {
    clearTimeout(micBlockedWarningTO);
    setMicBlockedWarning(true);

    const timeoutId = setTimeout(() => {
      setMicBlockedWarning(false);
    }, 5000);
    setMicBlockedWarningTO(timeoutId);
  };
  const initiateRecording = (recorder, timeout, index, isRecording) => {
    if (!isRecording) {
      handleMicAlert(true);
      return;
    }
    changeField(`speakingQuestions.${index}.recording`, isRecording);
    changeField(`speakingQuestions.${index}.recorder`, recorder);
    changeField(`speakingQuestions.${index}.recordingTimeout`, timeout);
  };

  const setAudioData = (blob, file, index) => {
    changeField(`speakingQuestions.${index}.recording`, false);
    changeField(`speakingQuestions.${index}.recordedBlob`, blob);
    changeField(`speakingQuestions.${index}.audioFile`, file);
    // touchField(`${answersPath}.${index}.recordedBlob`);
  };

  const getQuestion = (index) => {
    return ((formValues || {}).speakingQuestions || [])[index] || {};
  };
  const readingMaterials = testInSession.readingMaterials[2] || {};
  const audioMaterials = testInSession.audioMaterials[2] || {};
  const videoMaterials = testInSession.videoMaterials[3] || {};
  useEffect(() => {
    return () => {
      clearTimeout(micBlockedWarningTO);
    };
  }, []);
  return (
    <Aux>
      <TestMaterials
        audioId={"speakingAudioMaterial"}
        pdfIndex={2}
        readingContent={readingMaterials.content}
        audioSource={audioMaterials.audio}
        videoSource={videoMaterials.video}
        onPreview={() => previewAudio("speakingAudioMaterial")}
        fileUpload={readingMaterials.fileUpload}
      />
      {testInSession.speakingQuestions.map((question, index) => (
        <Aux key={question._id}>
          <Typography paragraph variant="h6">
            {`${t("testSession.question")} ${index + 1}`}
          </Typography>
          {question.question ? (

            <div
              style={questionBox}
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
          ) : (
            <div>
              <audio
                id={`audioQuestion[${index}]`}
                src={question.questionAudio}
              />
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                  color="primary"
                  onClick={() => {
                    previewAudio(`audioQuestion[${index}]`);
                  }}
                  startIcon={<VolumeUpRoundedIcon />}
                >
                  {t("testSession.buttons.playQuestion")}
                </Button>
              </div>
            </div>
          )}
          <Field
            component={AudioPlayer}
            isMicAlert={micBlockedWarning}
            name={`speakingQuestions.${index}.recordedBlob`}
            onStart={async (e) => {
              const startData =
                (await start(e, null, index, null, async (data) => {
                  const timeoutData = await data;
                  setAudioData(timeoutData.blob, timeoutData.file, index);
                })) || {};
              initiateRecording(
                startData.recorder,
                startData.recordingTimeout,
                index,
                startData.isRecording
              );
            }}
            onStop={async (e) => {
              const stoppedData =
                (await stop(
                  e,
                  null,
                  index,
                  getQuestion(index).recordingTimeout,
                  getQuestion(index).recorder
                )) || {};
              setAudioData(stoppedData.blob, stoppedData.file, index);
            }}
            onPreview={() => {
              previewAudio(`audioAnswer[${index}]`);
            }}
            onClear={() => setAudioData(null, null, index)}
            id={`audioAnswer[${index}]`}
            recordDisabled={getQuestion(index).recording}
            audioSource={getQuestion(index).recordedBlob}
            previewType="button"
            recordButtonText={t("testSession.buttons.recordAnswer")}
          />
        </Aux>
      ))}
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeField: (field, value) => {
      dispatch(change("studentTest", field, value));
    },
  };
};

const wrappedForm = reduxForm({
  form: "studentTest",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(SpeakingSection);

export default connect(null, mapDispatchToProps)(wrappedForm);
