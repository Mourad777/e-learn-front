import React from "react";
import { Field, reduxForm } from "redux-form";
import classes from "./QuestionForm.module.css";
import { OutlinedInput } from "@material-ui/core";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Editor from "../../Editor/Editor";
import { useTranslation } from "react-i18next";

const EssayQuestion = ({ path }) => {
  const {t} = useTranslation();
  return (
    <Aux>
      <div className={classes.TextEditor}>
        <Field
          name="essayQuestion.question"
          component={Editor}
          reduxForm="questionForm"
          field="essayQuestion.question"
          label={t("questionForm.question")}
          path={path}
        />
      </div>
      <Field
        name={`essayQuestion.solution`}
        component={MultiLineField}
        label={t("questionForm.fields.solution")}
        options={{
          multiline: true,
          rows: 3,
          variant: OutlinedInput,
        }}
        textLabel
      />
    </Aux>
  );
};

const wrappedForm = reduxForm({
  form: "questionForm",
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(EssayQuestion);

export default wrappedForm