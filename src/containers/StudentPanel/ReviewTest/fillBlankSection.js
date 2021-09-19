import React from "react";
import classes from "./ReviewTest.module.css";
import Typography from "@material-ui/core/Typography";
import { Field } from "redux-form";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import { OutlinedInput } from "@material-ui/core";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import Accordion from "../../../components/UI/Accordion/Accordion";
import TestMaterials from "../Test/TestMaterials/TestMaterials";
import { previewAudio } from "../../../utility/audioRecorder";
import { useTranslation } from "react-i18next";
import { getProcessedFillblankText } from "./getProcessedFillblankText";

const FillblankSection = ({
  instructorTest = {},
  sections,
  studentInput = [],
  testResult = {},
  isDarkTheme,
}) => {
  const { t } = useTranslation();
  const htmlString = (instructorTest.fillInBlanksQuestions || "").text;
  const answersList = (instructorTest.fillInBlanksQuestions || "").blanks || [];
  const audioMaterials = ((instructorTest || {}).audioMaterials || [])[3] || {};
  const videoMaterials = ((instructorTest || {}).videoMaterials || [])[3] || {};
  const readingMaterials = ((instructorTest || {}).readingMaterials || [])[3] || {};
  //replace text highlighted in yellow with a disabled text/select input and/or audio player react component
  ;

  const processedFillblankText = getProcessedFillblankText(htmlString, answersList, studentInput);

  return (
    <Aux>
      <Typography variant="h5" gutterBottom>
        {t("testReview.fillintheblankssection")}
      </Typography>
      {sections > 1 && (
        <Typography style={{ margin: '20px 0' }} variant="body2" gutterBottom>
          {`${t("testReview.sectionWorth")} ${((instructorTest || {}).sectionWeights || {}).fillBlankSection
            }%`}
        </Typography>
      )}
      <Accordion
        index={"fillBlankSectionReview"}
        summary={t("testReview.sectionResources")}
        disabled={!readingMaterials.content && !audioMaterials.audio && !videoMaterials}
      >
        <TestMaterials
          audioId={"fillblanksAudioMaterialReviewTest"}
          pdfIndex={3}
          readingContent={readingMaterials.content}
          audioSource={audioMaterials.audio}
          videoSource={videoMaterials.video}
          onPreview={() => previewAudio("fillblanksAudioMaterialReviewTest")}
          fileUpload={readingMaterials.fileUpload}
        />
      </Accordion>
      <div dangerouslySetInnerHTML={{ __html: processedFillblankText }} />
      {((instructorTest.fillInBlanksQuestions || {}).blanks || []).map(
        (blank, blankIndex) => {
          const b = (testResult.answers || [])[blankIndex] || {};
          const studentAnswer = (
            studentInput.find(
              (item) => item.questionNumber === blankIndex + 1
            ) || {}
          ).answer;
          const feedBack = (
            studentInput.find(
              (item) => item.questionNumber === blankIndex + 1
            ) || {}
          ).additionalNotes;
          let marksColor = "#ffc107"; //yellow
          const studentMarks = b.marks;
          if ((blank || {}).marks === studentMarks) marksColor = "#4caf50"; //green
          if (studentMarks === 0) marksColor = "#F44336"; //red

          return (
            <div className={isDarkTheme ? classes.QuestionContainerDark : classes.QuestionContainer} key={blank + blankIndex}>
              <Typography variant="h6" gutterBottom>
                {`${t("testReview.blank")} ${blankIndex + 1}`}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t("testReview.yourAnswer")}
                <span
                  className={
                    studentAnswer !== "Select the correct answer" &&
                      studentAnswer
                      ? classes.YellowBackground
                      : ""
                  }
                >
                  {studentAnswer === "Select the correct answer"
                    ? ""
                    : studentAnswer}
                </span>
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t("testReview.correctAnswer") + ": "}{" "}
                <span>{(blank || {}).correctAnswer}</span>
              </Typography>
              <Typography
                style={{ marginTop: 15 }}
                variant="body1"
                gutterBottom
              >
                {t("testReview.marks")}
              </Typography>
              <NumberPicker
                borderColor={marksColor}
                input={{
                  value: b.marks || 0,
                }}
                simple
                readOnly
                width={80}
              />
              {` / ${(blank || {}).marks}`}
              {(blank || {}).solution && (blank || {}).solution && (
                <Aux>
                  <Typography variant="body1" gutterBottom>
                    {t("testReview.solution")}
                  </Typography>
                  <Field
                    name={`instructorTest.fillInBlanksQuestions.blanks.${blankIndex}.solution`}
                    component={MultiLineField}
                    options={{
                      multiline: true,
                      rows: 2,
                      variant: OutlinedInput,
                      readOnly: true,
                    }}
                  />
                </Aux>
              )}
              {feedBack && (
                <div style={{ marginTop: 15 }}>
                  <Typography
                    className={classes.RedText}
                    variant="body1"
                    gutterBottom
                  >
                    {t("testReview.feedback")}
                  </Typography>
                  <MultiLineField
                    input={{ value: feedBack }}
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

export default FillblankSection;
