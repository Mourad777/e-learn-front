import React from "react";
import classes from "./ReviewTest.module.css";
import Typography from "@material-ui/core/Typography";
import { Field } from "redux-form";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import { OutlinedInput } from "@material-ui/core";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import DOMPurify from "dompurify";
import Accordion from "../../../components/UI/Accordion/Accordion";
import TestMaterials from "../Test/TestMaterials/TestMaterials";
import { previewAudio } from "../../../utility/audioRecorder";
import { useTranslation } from "react-i18next";

const McSection = ({
  instructorTest = {},
  sections,
  studentInput = {},
  testResult = [],
  isDarkTheme,
}) => {
  const audioMaterials = ((instructorTest || {}).audioMaterials || [])[0] || {};
  const readingMaterials =
    ((instructorTest || {}).readingMaterials || [])[0] || {};
  const videoMaterials =
    ((instructorTest || {}).videoMaterials || [])[0] || {};
  const { t } = useTranslation();
  const questionBox = {
    background: "#1976d2",
    borderRadius: 4,
    color: "white",
    padding: 10,
  };
  return (
    <Aux>
      <Typography variant="h5" gutterBottom>
        {t("testReview.multiplechoicesection")}
      </Typography>
      {sections > 1 && (
        <Typography style={{ margin: '20px 0' }} variant="body2" gutterBottom>
          {`${t("testReview.sectionWorth")} ${((instructorTest || {}).sectionWeights || {}).mcSection
            }%`}
        </Typography>
      )}
      <Accordion
        index={"mcSectionReview"}
        summary={t("testReview.sectionResources")}
        disabled={!readingMaterials.content && !audioMaterials.audio && !audioMaterials.video}
      >
        <TestMaterials
          audioId={"mcAudioMaterialReviewTest"}
          pdfIndex={0}
          readingContent={readingMaterials.content}
          audioSource={audioMaterials.audio}
          videoSource={videoMaterials.video}
          onPreview={() => previewAudio("mcAudioMaterialReviewTest")}
          fileUpload={readingMaterials.fileUpload}
        />
      </Accordion>

      {((instructorTest || {}).multipleChoiceQuestions || []).map(
        (question, questionIndex) => {
          const correctAnswerIndices = (question.correctAnswers || []).map(
            (answer) => parseInt(answer) - 1
          );
          const correctAnswers = (question.answerOptions || []).filter(
            (option, questionIndex) => {
              if (correctAnswerIndices.includes(questionIndex)) {
                return option;
              }
            }
          );
          const incorrectAnswers = (question.answerOptions || []).filter(
            (option, questionIndex) => {
              if (!correctAnswerIndices.includes(questionIndex)) {
                return option;
              }
            }
          );
          const questionUserInput = (studentInput.answers || []).find(
            (question) => question.questionNumber === questionIndex + 1
          );
          const userMcAnswers = (questionUserInput || {}).answers;
          const notSelectedAnswers = (question.answerOptions || []).filter(
            (answer) => {
              if (!(userMcAnswers || []).includes(answer)) return answer;
            }
          );
          const missingAnswers = (notSelectedAnswers || []).filter((item) => {
            if ((correctAnswers || []).includes(item)) {
              return item;
            }
          });
          const incorrectSelectedAnswers = incorrectAnswers.filter((item) => {
            if ((userMcAnswers || []).includes(item)) {
              return item;
            }
          });
          let marksColor = "#ffc107"; //yellow
          const studentMarks = ((testResult.answers || [])[questionIndex] || {})
            .marks;
          if (question.marks === studentMarks) marksColor = "#4caf50"; //green
          if (studentMarks === 0) marksColor = "#F44336"; //red
          return (
            <div
              className={isDarkTheme ? classes.QuestionContainerDark : classes.QuestionContainer}
              key={question + questionIndex}
            >
              <Typography variant="h6" gutterBottom>
                {`${t("testReview.question")} ${questionIndex + 1}`}
              </Typography>
              <Typography
                paragraph
                color="error"
                variant="caption"
                gutterBottom
              >
                {missingAnswers.length === 1
                  ? t("testReview.oneAnswerMissing")
                  : null}
              </Typography>
              <Typography
                paragraph
                color="error"
                variant="caption"
                gutterBottom
              >
                {incorrectSelectedAnswers.length > 1
                  ? `${incorrectSelectedAnswers.length} ${t(
                    "testReview.xAnswersSelectedIncorrectly"
                  )} `
                  : null}
              </Typography>
              <Typography
                paragraph
                color="error"
                variant="caption"
                gutterBottom
              >
                {missingAnswers.length > 1
                  ? `${incorrectSelectedAnswers.length} ${t(
                    "testReview.xAnswersMissing"
                  )} `
                  : null}
              </Typography>

              <div
                style={questionBox}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.question),
                }}
              />

              {question.answerOptions.map((option, index) => {
                return (
                  <Typography key={option + index} variant="body2" gutterBottom>
                    <span>{`${index + 1}) `}</span>
                    <span
                      className={
                        (userMcAnswers || []).includes(option)
                          ? classes.YellowBackground
                          : ""
                      }
                    >
                      {`${option}`}
                    </span>

                    <span
                      className={
                        ((missingAnswers || []).includes(option) ||
                          (incorrectSelectedAnswers || []).includes(option)) &&
                          (userMcAnswers || []).includes(option)
                          ? classes.RedText
                          : ""
                      }
                    >
                      {((missingAnswers || []).includes(option) ||
                        (incorrectSelectedAnswers || []).includes(option)) &&
                        (userMcAnswers || []).includes(option) ? (
                        <span className={classes.RedText}>
                          <i className="fa fa-times"></i>
                        </span>
                      ) : (
                        ""
                      )}
                    </span>

                    <span
                      className={
                        !(missingAnswers || []).includes(option) &&
                          !(incorrectSelectedAnswers || []).includes(option) &&
                          (userMcAnswers || []).includes(option)
                          ? classes.GreenText
                          : ""
                      }
                    >
                      {/* if all correct answers were selected and no incorrect answers were selected than display a green check mark*/}
                      {!(missingAnswers || []).includes(option) &&
                        !(incorrectSelectedAnswers || []).includes(option) &&
                        (userMcAnswers || []).includes(option) && (
                          <span className={classes.GreenText}>
                            <i className="fa fa-check"></i>
                          </span>
                        )}
                    </span>
                  </Typography>
                );
              })}
              <Typography variant="body2" gutterBottom>
                {correctAnswerIndices.length > 1
                  ? t("testReview.correctAnswerPlural") + ": "
                  : t("testReview.correctAnswer") + ": "}
                {correctAnswerIndices.map((item, index) => (
                  <span key={item + index}>
                    {`${item + 1}
                    ${correctAnswerIndices.length > 1 &&
                        index !== correctAnswerIndices.length - 1
                        ? ","
                        : ""
                      } `}
                  </span>
                ))}
              </Typography>
              <Typography
                style={{ marginTop: 15 }}
                variant="body1"
                gutterBottom
              >
                {t("testReview.marks")}
              </Typography>
              <NumberPicker
                input={{
                  value:
                    ((testResult.answers || [])[questionIndex] || {}).marks ||
                    0,
                }}
                simple
                readOnly
                width={80}
                borderColor={marksColor}
              />
              {` / ${question.marks}`}
              {question.solution && (
                <div style={{ marginTop: 15 }}>
                  <Typography variant="body1" gutterBottom>
                    {t("testReview.solution")}
                  </Typography>
                  <Field
                    name={`instructorTest.multipleChoiceQuestions.${questionIndex}.solution`}
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
              {(questionUserInput || {}).additionalNotes && (
                <div style={{ marginTop: 15 }}>
                  <Typography
                    className={classes.RedText}
                    variant="body1"
                    gutterBottom
                  >
                    {t("testReview.feedback")}
                  </Typography>
                  <MultiLineField
                    input={{ value: (questionUserInput || {}).additionalNotes }}
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

export default McSection;
