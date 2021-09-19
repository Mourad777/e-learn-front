import React from "react";
import classes from "./ReviewTest.module.css";
import Typography from "@material-ui/core/Typography";
import { Field } from "redux-form";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import { OutlinedInput } from "@material-ui/core";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import Switch from "../../../components/UI/Switch/Switch";
import Editor from "../../Editor/Editor";
import DOMPurify from "dompurify";
import Accordion from "../../../components/UI/Accordion/Accordion";
import TestMaterials from "../Test/TestMaterials/TestMaterials";
import { previewAudio } from "../../../utility/audioRecorder";
import { useTranslation } from "react-i18next";

const EssaySection = ({
  instructorTest = {},
  sections,
  studentInput = {},
  testResult = {},
  formValues = {},
  isDarkTheme,
}) => {

  const questionBox = {
    background: '#1976d2',
    borderRadius: 4,
    color: 'white',
    padding: 10,
    marginBottom: 20,
  }
  const audioMaterials = ((instructorTest || {}).audioMaterials || [])[1] || {};
  const readingMaterials =
    ((instructorTest || {}).readingMaterials || [])[1] || {};
  const videoMaterials =
    ((instructorTest || {}).videoMaterials || [])[1] || {};
  const { t } = useTranslation();
  return (
    <Aux>
      <Typography variant="h5" gutterBottom>
        {t("testReview.essaysection")}
      </Typography>
      {sections > 1 && (
        <Typography style={{ margin: '20px 0' }} variant="body2" gutterBottom>
          {`${t("testReview.sectionWorth")} ${((instructorTest || {}).sectionWeights || {}).essaySection
            }%`}
        </Typography>
      )}
      <Accordion
        index={"essaySectionReview"}
        summary={t("testReview.sectionResources")}
        disabled={!readingMaterials.content && !audioMaterials.audio && !videoMaterials.video}
      >
        <TestMaterials
          audioId={"essayAudioMaterialReviewTest"}
          pdfIndex={1}
          readingContent={readingMaterials.content}
          audioSource={audioMaterials.audio}
          videoSource={videoMaterials.video}
          onPreview={() => previewAudio("essayAudioMaterialReviewTest")}
          fileUpload={readingMaterials.fileUpload}
        />
      </Accordion>
      {((instructorTest || {}).essayQuestions || []).map(
        (question, qIndex) => {
          const essayQuestionUserInput = (studentInput.answers || []).find(
            (question) => question.questionNumber === qIndex + 1
          );
          let marksColor = "#ffc107"; //yellow
          const studentMarks = (
            ((testResult.essaySection || {}).answers || [])[qIndex] || {}
          ).marks||0;
          if ((question || {}).marks === studentMarks) marksColor = "#4caf50"; //green
          if (studentMarks === 0) marksColor = "#F44336"; //red
          const answer =
            (((formValues.testResult || {}).essaySection || {}).answers || [])[qIndex] || {};
          const uneditedAnswer = ((formValues.essaySection || [])[qIndex] || {}).uneditedAnswer;
          
          return (
            <div
              className={isDarkTheme ? classes.QuestionContainerDark : classes.QuestionContainer}
              key={question + qIndex}
            >
              <Typography variant="h6" gutterBottom>
                {`${t("testReview.question")} ${qIndex + 1}`}
              </Typography>
              <div
                style={questionBox}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.question),
                }}
              />
              {answer.allowCorrection &&
                answer.answer !== answer.instructorCorrection && (
                  <Field
                    name={`essaySection.${qIndex}.uneditedAnswer`}
                    options={{
                      label: "Show unedited answer",
                      checked: false,
                    }}
                    component={Switch}
                  />
                )}

              <Field
                border="yellowBorder"
                type="balloon"
                reduxForm="testReview"
                name={`testResult.essaySection.answers.${qIndex}.${uneditedAnswer ? "answer" : "instructorCorrection"}`}
                component={Editor}
                readOnly
              />
              <Typography
                style={{ marginTop: 15 }}
                variant="body1"
                gutterBottom
              >
                {t("testReview.marks")}
              </Typography>
              <NumberPicker
                borderColor={marksColor}
                input={{value:studentMarks}}
                simple
                readOnly
                width={80}
              />
              {` / ${(question || {}).marks}`}
              {(question || {}).solution && (
                <div style={{ marginTop: 15 }}>
                  <Typography variant="body1" gutterBottom>
                    {t("testReview.solution")}
                  </Typography>
                  <Field
                    name={`instructorTest.essayQuestions.${qIndex}.solution`}
                    component={MultiLineField}
                    options={{
                      multiline: true,
                      rows: 2,
                      variant: OutlinedInput,
                      readOnly: true,
                    }}
                  />
                </div>
              )}
              {(essayQuestionUserInput || {}).additionalNotes && (
                <div style={{ marginTop: 15 }}>
                  <Typography
                    className={classes.RedText}
                    variant="body1"
                    gutterBottom
                  >
                    {t("testReview.feedback")}
                  </Typography>
                  <MultiLineField
                    input={{
                      value: (essayQuestionUserInput || {}).additionalNotes,
                    }}
                    options={{
                      multiline: true,
                      rows: 2,
                      variant: OutlinedInput,
                      readOnly: true,
                    }}
                  />
                </div>
              )}
            </div>
          );
        }
      )}
    </Aux>
  );
};

export default EssaySection;
