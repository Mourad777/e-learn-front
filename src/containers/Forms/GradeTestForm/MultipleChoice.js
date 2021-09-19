import React from "react";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import classes from "./GradeTestForm.module.css";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import { Field } from "redux-form";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import { OutlinedInput } from "@material-ui/core";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

const McSection = ({
  test,
  mcSectionStudentInput,
  sections,
}) => {
  const { t } = useTranslation();
  const questionBox = {
    background: '#1976d2',
    borderRadius: 4,
    color: 'white',
    padding: 10,
  }
  if(!mcSectionStudentInput)return null
  return (
    <Aux>
      <Typography variant="h5" gutterBottom>
        {t("gradeTestForm.multiplechoicesection")}
      </Typography>
      {sections > 1 && (
        <Typography variant="body2" gutterBottom>
          {`${t("gradeTestForm.sectionWorth")} ${
            ((test || {}).sectionWeights || {}).mcSection
          }%`}
        </Typography>
      )}

      {((test || {}).multipleChoiceQuestions || []).map(
        (question, questionIndex) => {
          const correctAnswerIndices = (
            (question || {}).correctAnswers || []
          ).map((answer) => parseInt(answer) - 1);
          const correctAnswers = ((question || {}).answerOptions || []).filter(
            (option, questionIndex) => {
              if (correctAnswerIndices.includes(questionIndex)) {
                return option;
              }
            }
          );
          const incorrectAnswers = (
            (question || {}).answerOptions || []
          ).filter((option, questionIndex) => {
            if (!correctAnswerIndices.includes(questionIndex)) {
              return option;
            }
          });
          const questionUserInput = mcSectionStudentInput.answers.find(
            (question) => question.questionNumber === questionIndex + 1
          );
          const userMcAnswers = (questionUserInput || {}).answers;
          const notSelectedAnswers = (
            (question || {}).answerOptions || []
          ).filter((answer) => {
            if (!(userMcAnswers || []).includes(answer)) return answer;
          });
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
          const correctAnswer =
            missingAnswers.length === 0 &&
            incorrectSelectedAnswers.length === 0;

          return (
            <div
              className={classes.QuestionContainer}
              key={question + questionIndex}
            >
              <Typography variant="h6" gutterBottom>
                {`${t("gradeTestForm.question")} ${questionIndex + 1}`}
              </Typography>
              <div
                style={questionBox}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.question),
                }}
              />
              <Typography style={{display:'block'}} color="error" variant="caption" gutterBottom>
                {incorrectSelectedAnswers.length === 1
                  ? t("gradeTestForm.oneAnswerIncorrect")
                  : null}
              </Typography>
              <Typography style={{display:'block'}} color="error" variant="caption" gutterBottom>
                {missingAnswers.length === 1
                  ? t("gradeTestForm.oneAnswerMissing")
                  : null}
              </Typography>
              <Typography style={{display:'block'}} color="error" variant="caption" gutterBottom>
                {incorrectSelectedAnswers.length > 1
                  ? `${incorrectSelectedAnswers.length}  ${t(
                      "gradeTestForm.xAnswersSelectedIncorrectly"
                    )}`
                  : null}
              </Typography>
              <Typography style={{display:'block'}} color="error" variant="caption" gutterBottom>
                {missingAnswers.length > 1
                  ? `${incorrectSelectedAnswers.length}  ${t(
                      "gradeTestForm.xAnswersMissing"
                    )}`
                  : null}
              </Typography>
              <Typography style={{display:'block',marginBottom:20}} variant="body1" gutterBottom>
                {correctAnswer && (
                  <span className={classes.GreenText}>{t("gradeTestForm.studentAnsweredCorrectly")}</span>
                )}
              </Typography>

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
                        (userMcAnswers || []).includes(option) && (
                          <span className={classes.RedText}>
                            <i className="fa fa-times"></i>
                          </span>
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
              <Typography
                style={{ marginTop: 15 }}
                variant="body2"
                gutterBottom
              >
                {correctAnswerIndices.length > 1
                  ? t("gradeTestForm.correctAnswerPlural")
                  : t("gradeTestForm.correctAnswer") + ": "}
                {correctAnswerIndices.map((item, index) => (
                  <span key={item + index}>
                    {`${item + 1}
                    ${
                      correctAnswerIndices.length > 1 &&
                      index !== correctAnswerIndices.length - 1
                        ? ","
                        : ""
                    } `}
                  </span>
                ))}
              </Typography>
              <Typography
                style={{ marginTop: 10 }}
                variant="body1"
                gutterBottom
              >
                {t("gradeTestForm.fields.marks")}
              </Typography>
              <Field
                name={`mcSection.${questionIndex}.marks`}
                simple
                component={NumberPicker}
                width={80}
              />
              {` / ${(question || {}).marks}`}
              {question.solution && (
                <Aux>
                  <Typography
                    style={{ marginTop: 15 }}
                    variant="body1"
                    gutterBottom
                  >
                    {t("gradeTestForm.solution")}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {question.solution}
                  </Typography>
                </Aux>
              )}
              <Typography
                style={{ marginTop: 15 }}
                variant="body1"
                gutterBottom
              >
                {t("gradeTestForm.fields.feedback")}
              </Typography>
              <Field
                name={`mcSection.${questionIndex}.additionalNotes`}
                component={MultiLineField}
                options={{
                  rows: 3,
                  variant: OutlinedInput,
                  marginTop: true,
                }}
              />
            </div>
          );
        }
      )}
    </Aux>
  );
};
export default McSection;
