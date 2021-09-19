import React from "react";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import classes from "../TestForm.module.css";

const IncorrectOptions = ({ blankIndex,t, answers, meta = {}, error }) => (
  <Aux>
    <select
      readOnly
      value="select the correct answer"
      className={classes.SelectField}
    >
      {[
        "select the correct answer",
        "Correct option",
        "Incorrect option 1",
        "Incorrect option 2",
        "Incorrect option 3",
      ].map((value, index) => {
        const answerOptions = (answers[blankIndex] || {}).answerOptions || {};
        let text;
        
        if (index === 0) text = t("testForm.fields.selectCorrectAnswerInline");
        if (index === 1) text = (answers[blankIndex] || {}).answer;
        if (index === 2) text = answerOptions.incorrectAnswerOne;
        if (index === 3) text = answerOptions.incorrectAnswerTwo;
        if (index === 4) text = answerOptions.incorrectAnswerThree;
        return (
          <option
            key={`${value}[${index}]`}
            className={index === 1 ? classes.CorrectAnswerHighlight : null}
            disabled
            value={value}
          >
            {text}
          </option>
        );
      })}
    </select>
    <div className={classes.flexPositioningEven}>
      <span className={classes.errorText}>
        {(meta.error || error) && meta.touched ? meta.error || error : ""}{" "}
      </span>
    </div>
  </Aux>
);

export default IncorrectOptions;
