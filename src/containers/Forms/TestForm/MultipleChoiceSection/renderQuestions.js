import React from 'react'
import { renderAnswers } from './renderAnswers';
import {
    Field,
    FieldArray,
  } from "redux-form";
import Editor from "../../../Editor/Editor";
import Checkbox from "../../../../components/UI/FormElements/Checkbox/Checkbox";
import Button from "@material-ui/core/Button";
import classes from "../TestForm.module.css";
import { OutlinedInput } from "@material-ui/core";
import MultiLineField from "../../../../components/UI/FormElements/MultiLineField/MultiLineField";
import NumberPicker from "../../../../components/UI/FormElements/NumberPicker/NumberPicker";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";

const RenderQuestions = ({
    fields,
    meta: { error, submitFailed },
    touchCheckboxes,
    clearAnswers,
    formValues = {},
    path,
    t,
  }) => {
    return (
      <ul className={classes.TestFormList}>
        {fields.map((question, index) => {
          const answerOptions = (
            ((formValues.mcQuestions || [])[index] || {}).answers || []
          ).map((answer, index) => {
            return {
              label: `${!answer ? "" : answer}`,
              value: `${index + 1}`,
              placement: "start",
              color: "primary",
              name: `${question}.correctAnswers`,
            };
          });
          const answerChoices = (
            <Aux>
              <Typography variant="subtitle1" gutterBottom>
                {t("testForm.selectCorrectAnswers")}
              </Typography>
              <Field
                name={`${question}.correctAnswers`}
                component={Checkbox}
                onChange={() => touchCheckboxes(`${question}.correctAnswers`)}
                options={answerOptions}
                required={false}
                column
              />
            </Aux>
          );
  
          return (
            <li key={index} className={classes.QuestionCustomizationContainer}>
              <Typography variant="h6" gutterBottom>
                {`${t("testForm.question")} ${index + 1}`}
              </Typography>
              <div className={classes.TextEditor}>
                <Field
                  name={`${question}.question`}
                  field={`${question}.question`}
                  reduxForm="testForm"
                  component={Editor}
                  index={index}
                  path={path}
                />
              </div>
              <FieldArray
                name={`${question}.answers`}
                questionIndex={index}
                clearAnswers={clearAnswers}
                component={renderAnswers}
                t={t}
              />
              {answerChoices}
  
              <Field
                name={`${question}.solution`}
                component={MultiLineField}
                label={t("testForm.fields.solution")}
                options={{
                  multiline: true,
                  rows: 3,
                  variant: OutlinedInput,
                }}
                textLabel
              />
              <div style={{ marginTop: 15 }}>
                <Field
                  name={`${question}.marks`}
                  component={NumberPicker}
                  options={{ label: t("testForm.fields.marks"), size: "small" }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent:'space-around' }}>
                <Button
                  color="secondary"
                  onClick={() => fields.remove(index)}
                  disabled={(formValues.mcQuestions || []).length === 1}
                >
                  {t("testForm.buttons.removeQuestion")}
                </Button>
              </div>
            </li>
          );
        })}
        <li>
          <div style={{ display: 'flex', justifyContent:'space-around' }}>
            <Button
              size="medium"
              color="primary"
              onClick={() => fields.push({ marks: 1 })}
            >
              {t("testForm.buttons.addQuestion")}
            </Button>
          </div>
          {submitFailed && error && <span>{error}</span>}
        </li>
      </ul>
    );
  };
  
export default RenderQuestions;