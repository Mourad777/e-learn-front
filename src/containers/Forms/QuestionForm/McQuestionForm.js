import React from "react";
import { connect } from "react-redux";
import {
  Field,
  reduxForm,
  FieldArray,
  getFormValues,
  change,
  touch,
} from "redux-form";
import Editor from "../../Editor/Editor";
import Checkbox from "../../../components/UI/FormElements/Checkbox/Checkbox";
import classes from "./QuestionForm.module.css";
import { OutlinedInput } from "@material-ui/core";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import { renderAnswers } from "./mcUtil";

const MultipleChoiceQuestion = ({
  clearAnswers,
  touchCheckboxes,
  formValues = {},
  path,
}) => {
  const {t} = useTranslation()
  const answerOptions = ((formValues.mcQuestion || {}).answers || []).map(
    (answer, index) => {
      return {
        label: `${!answer ? "" : answer}`,
        value: `${index + 1}`,
        placement: "start",
        color: "primary",
        name: `mcQuestion.correctAnswers`,
      };
    }
  );

  const answerChoices = (
    <Aux>
      <Typography variant="body1" style={{fontSize:'0.8rem'}} gutterBottom>
      {t("questionForm.selectCorrectAnswers")}
      </Typography>
      <Field
        name={"mcQuestion.correctAnswers"}
        component={Checkbox}
        options={answerOptions}
        column
        required={false}
        onChange={() => touchCheckboxes("mcQuestion.correctAnswers")}
      />
    </Aux>
  );

  return (
    <div className={classes.QuestionCustomizationContainer}>
      <div className={classes.TextEditor}>
        <Field
          name="mcQuestion.question"
          component={Editor}
          reduxForm="questionForm"
          field="mcQuestion.question"
          label= {t("questionForm.question")}
          path={path}
        />
      </div>
      {answerChoices}
      <FieldArray
        name="mcQuestion.answers"
        clearAnswers={clearAnswers}
        component={renderAnswers}
        t={t}
      />
      <Field
        name="mcQuestion.solution"
        component={MultiLineField}
        label= {t("questionForm.fields.solution")}
        options={{
          multiline: true,
          rows: 3,
          variant: OutlinedInput,
        }}
        textLabel
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTags: (tags) => {
      dispatch(change("questionForm", `tags`, tags));
    },
    clearAnswers: () => {
      dispatch(change("questionForm", `mcQuestion.correctAnswers]`, []));
    },
    touchCheckboxes: (field) => {
      dispatch(touch("questionForm", field));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("questionForm")(state),
  };
};

const wrappedForm = reduxForm({
  form: "questionForm",
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(MultipleChoiceQuestion);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
