import React from "react";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import classes from "./GradeTestForm.module.css";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import { Field } from "redux-form";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import { OutlinedInput } from "@material-ui/core";
import reactStringReplace from "react-string-replace";
import ReactDOMServer from "react-dom/server";
import InlineAudioPlayer from "../../../components/UI/AudioPlayer/InlineAudioPlayer";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

const FillBlankSection = ({
  test = {},
  isTest,
  sections,
  fillInBlanksStudentAnswers: fbStuAns,
}) => {
  const { t } = useTranslation();
  const htmlString = (test.fillInBlanksQuestions || "").text;
  const answersList = (test.fillInBlanksQuestions || "").blanks;
  const replacedHtml = reactStringReplace(
    htmlString || "",
    /<mark [^>]+>(.*?)<\/mark>/g,
    (match, i) => {
      const idx = i / 2 - 0.5;
      const ans = (answersList || [])[idx] || {};
      const corAns = ans.correctAnswer;
      if (ans.selectableAnswer === true) {
        const stuSelAns = (
          (fbStuAns || []).find((item) => item.questionNumber === idx + 1) || {}
        ).answer;
        return (
          <Aux key={match + idx}>
            <span className={classes.BlankPreview}>{idx + 1} </span>
            {ans.audio && <InlineAudioPlayer id={idx} source={ans.audio} />}
            <select
              readOnly
              value={t("gradeTestForm.studentSelected")}
              className={classes.SelectField}
            >
              <option
                disabled
                value={
                  corAns === stuSelAns
                    ? t("gradeTestForm.studentSelected")
                    : "Correct Option"
                }
              >
                {corAns}
              </option>
              {(ans.incorrectAnswers || []).map((option) => (
                <option
                  key={option}
                  disabled
                  value={
                    option === stuSelAns
                      ? t("gradeTestForm.studentSelected")
                      : t("gradeTestForm.incorrectOptionOne")
                  }
                >
                  {option}
                </option>
              ))}
            </select>
            {corAns === stuSelAns ? (
              <span className={classes.GreenText}>
                <i className="fa fa-check"></i>
              </span>
            ) : (
              <span className={classes.RedText}>
                <i className="fa fa-times"></i>
              </span>
            )}
          </Aux>
        );
      }

      if (ans.selectableAnswer === false) {
        const stuEssayAnswer = (
          (fbStuAns || []).find((item) => item.questionNumber === idx + 1) || {}
        ).answer;
        return (
          <Aux key={match + idx}>
            <span className={classes.Inline}>
              <span className={classes.BlankPreview}>{idx + 1} </span>
              {ans.audio && <InlineAudioPlayer id={idx} source={ans.audio} />}
              <input
                readOnly
                type="text"
                className={classes.InputField}
                value={`${stuEssayAnswer || ""}`}
              />
              {(corAns || "").toLowerCase() ===
              (stuEssayAnswer || "").toLowerCase() ? (
                <span className={classes.GreenText}>
                  <i className="fa fa-check"></i>
                </span>
              ) : (
                <span className={classes.RedText}>
                  <i className="fa fa-times"></i>
                </span>
              )}
            </span>
          </Aux>
        );
      }
    }
  );

  const newString = [];
  replacedHtml.forEach((element, index) => {
    if (typeof element === "string") {
      newString.push(element);
    } else {
      newString.push(ReactDOMServer.renderToString(element));
    }
  });
  const fillInBlanksString = (newString || "").join("");
  return (
    <Aux>
      <Typography variant="h5" gutterBottom>
        {t("gradeTestForm.fillintheblankssection")}
      </Typography>
      {sections > 1 && (
        <Typography variant="body2" gutterBottom>
          {`${t("gradeTestForm.sectionWorth")} ${
            ((test || {}).sectionWeights || {}).fillBlanksSection
          }%`}
        </Typography>
      )}
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(fillInBlanksString, {
            ADD_ATTR: ["src", "onclick"],
            ADD_TAGS: ["audio"],
          }),
        }}
      />
      {((test.fillInBlanksQuestions || {}).blanks || []).map(
        (blank, blankIndex) => {
          const studentAnswer = (
            (fbStuAns || []).find(
              (item) => item.questionNumber === blankIndex + 1
            ) || {}
          ).answer;
          return (
            <div className={classes.QuestionContainer} key={blank + blankIndex}>
              <Typography variant="h6" gutterBottom>
                {`${t("gradeTestForm.blank")} ${blankIndex + 1}`}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t("gradeTestForm.studentAnswer")}
                {studentAnswer !== "Select the correct answer" &&
                  studentAnswer && (
                    <span
                      className={
                        studentAnswer !== "Select the correct answer" &&
                        studentAnswer
                          ? classes.YellowBackground
                          : null
                      }
                    >
                      {studentAnswer === "Select the correct answer"
                        ? ""
                        : studentAnswer}
                    </span>
                  )}
              </Typography>
              <Typography variant="body2" gutterBottom>
              {t("gradeTestForm.correctAnswer") + ": "} <span>{(blank || {}).correctAnswer}</span>
              </Typography>
              <Typography
                style={{ marginTop: 15 }}
                variant="body1"
                gutterBottom
              >
                {t("gradeTestForm.fields.marks")}
              </Typography>
              <Field
                name={`fillInBlankSection.${blankIndex}.marks`}
                simple
                component={NumberPicker}
                width={80}
              />
              {` / ${(blank || {}).marks}`}
              <Typography
                style={{ marginTop: 15 }}
                variant="body1"
                gutterBottom
              >
                {t("gradeTestForm.fields.feedback")}
              </Typography>
              <Field
                name={`fillInBlankSection.${blankIndex}.additionalNotes`}
                placeholder="Additional notes for student"
                component={MultiLineField}
                label="Additional Notes"
                options={{
                  multiline: true,
                  rows: 3,
                  variant: OutlinedInput,
                }}
              />
            </div>
          );
        }
      )}
    </Aux>
  );
};

export default FillBlankSection;
