import React from "react";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import { Field } from "redux-form";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import { OutlinedInput } from "@material-ui/core";
import Editor from "../../Editor/Editor";
import Switch from "../../../components/UI/Switch/Switch";
import DOMPurify from "dompurify";
import classes from "./GradeTestForm.module.css";
import { useTranslation } from "react-i18next";

const EssaySection = ({
  test,
  isTest,
  essaySectionStudentInput,
  sections,
  formValues={},
  path,
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
        {t("gradeTestForm.essaysection")}
      </Typography>
      {sections > 1 && (
        <Typography variant="body2" gutterBottom>
          {`${t("gradeTestForm.sectionWorth")} ${
            ((test || {}).sectionWeights || {}).essaySection
          }%`}
        </Typography>
      )}
      {((test || {}).essayQuestions || []).map((question, questionIndex) => {
        const essayQuestionUserInput = essaySectionStudentInput.answers.find(
          (question) => question.questionNumber === questionIndex + 1
        );

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
            {(essayQuestionUserInput || {}).answer ? (
              <Aux>
                <Field
                  name={`essaySection.${questionIndex}.allowCorrection`}
                  options={{
                    label: t("gradeTestForm.fields.correctUsingTextEditor"),
                    checked: false,
                  }}
                  component={Switch}
                />
                <div
                  style={{
                    border: "2px solid #ffc107",
                    borderRadius: 4,
                    padding: 5,
                  }}
                >
                  <Typography variant="body2" gutterBottom>
                    {`${t("gradeTestForm.studentAnswer")}`}
                  </Typography>
                  {(
                    ((formValues || {}).essaySection || [])[questionIndex] ||
                    false
                  ).allowCorrection ? (
                    <Field
                      reduxForm="gradeForm"
                      component={Editor}
                      name={`essaySection.${questionIndex}.instructorCorrection`}
                      field={`essaySection.${questionIndex}.instructorCorrection`}
                      path={path}
                    />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          (essayQuestionUserInput || {}).answer
                        ),
                      }}
                    />
                  )}
                </div>
              </Aux>
            ) : (
              <Typography variant="caption" color="error" gutterBottom>
                {t("gradeTestForm.noAnswerProvided")}
              </Typography>
            )}

            <Typography style={{ marginTop: 15 }} variant="body1" gutterBottom>
              {t("gradeTestForm.fields.marks")}
            </Typography>
            <Field
              name={`essaySection.${questionIndex}.marks`}
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
            <Typography style={{ marginTop: 15 }} variant="body1" gutterBottom>
              {t("gradeTestForm.fields.feedback")}
            </Typography>
            <Field
              name={`essaySection.${questionIndex}.additionalNotes`}
              component={MultiLineField}
              options={{
                rows: 3,
                variant: OutlinedInput,
                marginTop: true,
              }}
            />
          </div>
        );
      })}
    </Aux>
  );
};

export default EssaySection;
