import React from "react";
import classes from "./ReviewTest.module.css";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Field } from "redux-form";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import { OutlinedInput } from "@material-ui/core";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import { previewAudio } from "../../../utility/audioRecorder";
import DOMPurify from "dompurify";
import Accordion from "../../../components/UI/Accordion/Accordion";
import TestMaterials from "../Test/TestMaterials/TestMaterials";
import { useTranslation } from "react-i18next";

const SpeakingSection = ({
  instructorTest = {},
  sections,
  studentInput = {},
  testResult = {},
  isDarkTheme,
}) => {

  const audioMaterials = ((instructorTest || {}).audioMaterials || [])[2] || {};
  const readingMaterials =
    ((instructorTest || {}).readingMaterials || [])[2] || {};
  const videoMaterials =
    ((instructorTest || {}).videoMaterials || [])[2] || {};
  const { t } = useTranslation();
  const questionBox = {
    background: '#1976d2',
    borderRadius: 4,
    color: 'white',
    padding: 10,
  }
  return (
    <Aux>
      <Typography variant="h5" gutterBottom>
        {t("testReview.speakingsection")}
      </Typography>
      {sections > 1 && (
        <Typography style={{ margin: '20px 0' }} variant="body2" gutterBottom>
          {`${t("testReview.sectionWorth")} ${((instructorTest || {}).sectionWeights || {}).speakingSection}%`}
        </Typography>
      )}
      <Accordion
        index={"speakingSectionReview"}
        summary={t("testReview.sectionResources")}
        disabled={!readingMaterials.content && !audioMaterials.audio && !videoMaterials.video}
      >
        <TestMaterials
          audioId={"speakingAudioMaterialReviewTest"}
          pdfIndex={2}
          readingContent={readingMaterials.content}
          audioSource={audioMaterials.audio}
          videoSource={videoMaterials.video}
          onPreview={() => previewAudio("speakingAudioMaterialReviewTest")}
          fileUpload={readingMaterials.fileUpload}
        />
      </Accordion>
      {(instructorTest.speakingQuestions || []).map((q, qIdx) => {
        const audioAnswer =
          (studentInput.answers || []).find((item) => {
            if (item.questionNumber === qIdx + 1) return item;
          }) || {};
        let marksColor = "#ffc107"; //yellow
        const studentMarks = ((testResult.answers || [])[qIdx] || {}).marks;
        if ((q || {}).marks === studentMarks) marksColor = "#4caf50"; //green
        if (studentMarks === 0) marksColor = "#F44336"; //red

        return (
          <div className={isDarkTheme ? classes.QuestionContainerDark : classes.QuestionContainer} key={q + qIdx}>
            <Typography variant="h6" gutterBottom>
              {`${t("testReview.question")} ${qIdx + 1}`}
            </Typography>
            {!audioAnswer.answer && (
              <Typography variant="caption" color="error" gutterBottom>
                {t("testReview.noAnswerProvided")}
              </Typography>
            )}

            {q.question && (
              <div
                style={questionBox}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(q.question),
                }}
              />
            )}

            {q.questionAudio && (
              <Aux>
                <audio id={`audioQuestion[${qIdx}]`} src={q.questionAudio} />
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Button
                    color="primary"
                    onClick={() => {
                      previewAudio(`audioQuestion[${qIdx}]`);
                    }}
                  >
                    {t("testReview.buttons.playQuestion")}
                  </Button>
                </div>
              </Aux>
            )}
            <Aux>
              <audio
                id={`audioAnswer[${qIdx}]`}
                src={audioAnswer ? audioAnswer.answer : null}
              />
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                  color="secondary"
                  disabled={!audioAnswer.answer || audioAnswer.answer === ""}
                  onClick={() => {
                    previewAudio(`audioAnswer[${qIdx}]`);
                  }}
                >
                  {!audioAnswer.answer || audioAnswer.answer === ""
                    ? t("testReview.buttons.noAnswer")
                    : t("testReview.buttons.playYourAnswer")}
                </Button>
              </div>
            </Aux>
            <Typography style={{ marginTop: 15 }} variant="body1" gutterBottom>
              {t("testReview.marks")}
            </Typography>
            <NumberPicker
              input={{
                value: ((testResult.answers || [])[qIdx] || {}).marks || 0,
              }}
              simple
              readOnly
              width={80}
              borderColor={marksColor}
            />
            {` / ${(q || {}).marks}`}
            {q.audio && (
              <Aux>
                <audio id={`audioExplanation[${qIdx}]`} src={q.audio} />
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Button
                    color="primary"
                    onClick={() => {
                      previewAudio(`audioExplanation[${qIdx}]`);
                    }}
                  >
                    {t("testReview.buttons.playAnswer")}
                  </Button>
                </div>
              </Aux>
            )}
            {(q || {}).solution && (
              <Aux>
                <Typography variant="body1" gutterBottom>
                  {t("testReview.solution")}
                </Typography>
                <Field
                  name={`instructorTest.speakingQuestions.${qIdx}.solution`}
                  component={MultiLineField}
                  label="Solution"
                  options={{
                    multiline: true,
                    rows: 2,
                    variant: OutlinedInput,
                    readOnly: true,
                  }}
                />
              </Aux>
            )}
            {audioAnswer.additionalNotes && (
              <div style={{ marginTop: 15 }}>
                <Typography
                  className={classes.RedText}
                  variant="body1"
                  gutterBottom
                >
                  {t("testReview.feedback")}
                </Typography>
                <MultiLineField
                  input={{ value: audioAnswer.additionalNotes }}
                  options={{
                    multiline: true,
                    rows: 2,
                    variant: OutlinedInput,
                    readOnly: true,
                  }}
                />
              </div>
            )}

            {audioAnswer.feedbackAudio && (
              <Aux>
                <audio
                  id={`audioFeedBack[${qIdx}]`}
                  src={audioAnswer.feedbackAudio}
                />
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Button
                    disabled={!audioAnswer.feedbackAudio}
                    color="primary"
                    onClick={() => {
                      previewAudio(`audioFeedBack[${qIdx}]`);
                    }}
                    className={classes.buttonSpace}
                  >
                    {t("testReview.buttons.playFeedback")}
                  </Button>
                </div>
              </Aux>
            )}
          </div>
        );
      })}
    </Aux>
  );
};

export default SpeakingSection;
