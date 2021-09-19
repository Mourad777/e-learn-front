import React from "react";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import { Field } from "redux-form";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import { OutlinedInput } from "@material-ui/core";
import { previewAudio, start, stop } from "../../../utility/audioRecorder";
import {
  AudioPlayer,
  AudioPreview,
} from "../../../components/UI/AudioPlayer/AudioPlayerRecorder";
import DOMPurify from "dompurify";
import classes from "./GradeTestForm.module.css";
import { useTranslation } from "react-i18next";

const SpeakingSection = ({
  test,
  speakingSectionStudentInput,
  sections,
  formValues={},
  onInitiateRecording,
  onSetAudioData,
  onGetRecordingTimeout,
  onGetRecorderFromClick,
  micBlockedWarning,
}) => {
  const questionBox = {
    background: '#1976d2',
    borderRadius: 4,
    color: 'white',
    padding: 10,
  }
  const { t } = useTranslation();
  return (
    <Aux>
      <Typography variant="h5" gutterBottom>
        {t("gradeTestForm.speakingsection")}
      </Typography>
      {sections > 1 && (
        <Typography variant="body2" gutterBottom>
          {`${t("gradeTestForm.sectionWorth")} ${
            ((test || {}).sectionWeights || {}).speakingSection
          }%`}
        </Typography>
      )}
      {((test || {}).speakingQuestions || []).map((question, qIdx) => {
        const audioAnswer = (
          (speakingSectionStudentInput || {}).answers || []
        ).find((item) => {
          if (item.questionNumber === qIdx + 1) return item;
        });
        return (
          <div className={classes.QuestionContainer} key={question + qIdx}>
            <Typography variant="h6" gutterBottom>
            {`${t("gradeTestForm.question")} ${qIdx + 1}`}
            </Typography>

            {question.question && (
              <div
                style={questionBox}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.question),
                }}
              />
            )}

            {question.questionAudio && (
              <AudioPreview
                onPreview={
                  question.questionAudio
                    ? () => previewAudio(`audioQuestion[${qIdx}]`)
                    : null
                }
                audioSource={question.questionAudio}
                id={`audioQuestion[${qIdx}]`}
                previewType="button"
                previewText={t("gradeTestForm.buttons.playQuestion")}
              />
            )}
            {!(audioAnswer || {}).answer && (
              <div style={{ margin: "auto", width: "50%" }}>
                <Typography
                  style={{ textAlign: "center" }}
                  variant="caption"
                  color="error"
                  gutterBottom
                >
                {t("gradeTestForm.noAnswerProvided")}
                </Typography>
              </div>
            )}
            <AudioPreview
              onPreview={
                audioAnswer.answer
                  ? () => previewAudio(`audioAnswer[${qIdx}]`)
                  : null
              }
              audioSource={audioAnswer ? (audioAnswer || {}).answer : null}
              id={`audioAnswer[${qIdx}]`}
              previewType="button"
              previewText={t("gradeTestForm.buttons.playStudentsAnswer")}
              disabled={!(audioAnswer || {}).answer}
            />

            <Typography variant="body1" gutterBottom>
            {t("gradeTestForm.fields.marks")}
            </Typography>
            <Field
              name={`speakingSection.${qIdx}.marks`}
              simple
              component={NumberPicker}
              width={80}
            />
            {` / ${(question || {}).marks}`}

            {question.audio && (
              <AudioPreview
                onPreview={
                  question.audio
                    ? () => previewAudio(`audioExplanation[${qIdx}]`)
                    : null
                }
                audioSource={question.audio}
                id={`audioExplanation[${qIdx}]`}
                previewType="button"
                previewText={t("gradeTestForm.buttons.playSolution")}
              />
            )}

            <Typography style={{ marginTop: 15 }} variant="body1" gutterBottom>
            {t("gradeTestForm.fields.feedback")}
            </Typography>
            <Field
              name={`speakingSection.${qIdx}.additionalNotes`}
              component={MultiLineField}
              options={{
                multiline: true,
                rows: 3,
                variant: OutlinedInput,
              }}
            />
            <Field
              component={AudioPlayer}
              name={`speakingSection.${qIdx}.recordedBlob`}
              onStart={async (e) => {
                const startData =
                  (await start(e, null, qIdx, null, async (data) => {
                    const timeoutData = await data;
                    onSetAudioData(timeoutData.blob, timeoutData.file, qIdx);
                  })) || {};
                onInitiateRecording(
                  startData.recorder,
                  startData.recordingTimeout,
                  qIdx,
                  startData.isRecording
                );
              }}
              onStop={async (e) => {
                const stoppedData =
                  (await stop(
                    e,
                    null,
                    qIdx,
                    onGetRecordingTimeout(qIdx),
                    onGetRecorderFromClick(qIdx)
                  )) || {};
                onSetAudioData(stoppedData.blob, stoppedData.file, qIdx);
              }}
              onPreview={() => {
                previewAudio(`audioFeedback[${qIdx}]`);
              }}
              onClear={() => onSetAudioData(null, null, qIdx)}
              id={`audioFeedback[${qIdx}]`}
              recordDisabled={
                ((formValues.speakingSection || [])[qIdx] || {}).recording
              }
              audioSource={
                ((formValues.speakingSection || [])[qIdx] || {}).recordedBlob
              }
              previewType="button"
              recordButtonText={t("gradeTestForm.buttons.recordFeedback")}
              isMicAlert={micBlockedWarning}
            />
          </div>
        );
      })}
    </Aux>
  );
};

export default SpeakingSection;
