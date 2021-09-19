import React from 'react';
import { Field } from "redux-form";
import NumberPicker from "../../../../components/UI/FormElements/NumberPicker/NumberPicker";
import Button from "@material-ui/core/Button";
import classes from "../TestForm.module.css";
import { OutlinedInput } from "@material-ui/core";
import MultiLineField from "../../../../components/UI/FormElements/MultiLineField/MultiLineField";
import Editor from "../../../Editor/Editor";
import Typography from "@material-ui/core/Typography";

export const renderQuestions = ({
  fields,
  meta: { error, submitFailed },
  formValues,
  path,
  t,
}) => {
  return (
    <ul className={classes.TestFormList}>
      {fields.map((question, index) => {
        return (
          <li className={classes.QuestionCustomizationContainer} key={index}>
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
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                onClick={() => fields.remove(index)}
                disabled={((formValues || {}).essayQuestions || []).length === 1}
                color="secondary"
              >
                {t("testForm.buttons.removeQuestion")}
              </Button>
            </div>
          </li>
        );
      })}
      <li>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            onClick={() => fields.push({ marks: 1 })}
            size="medium"
            color="primary"
          >
            {t("testForm.buttons.addQuestion")}
          </Button>
        </div>
        {submitFailed && error && <span>{error}</span>}
      </li>
    </ul>
  );
};