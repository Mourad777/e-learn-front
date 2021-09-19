import React from "react";
import { connect } from "react-redux";
import {
  reduxForm,
  FieldArray,
  getFormValues,
  change,
  touch,
} from "redux-form";
import validate from "../validate";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import Questions from "../../../InstructorPanel/Questions/Questions";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import { RenderQuestions } from "./RenderQuestions";

const SpeakingSection = ({ formValues = {}, ...rest }) => {
  const { t } = useTranslation();
  const indexToAddQuestion = (formValues.speakingQuestions || []).length;
  return (
    <Aux>
      <Typography variant="h4" gutterBottom paragraph>
        {t("testForm.speakingSection")}
      </Typography>
      <FieldArray
        name="speakingQuestions"
        formValues={formValues}
        component={RenderQuestions}
        props={rest}
        t={t}
      />
      <Accordion index={0} summary={t("testForm.selectQuestion")}>
        <Questions
          questionType="Speaking questions"
          selecting
          indexToAdd={indexToAddQuestion}
        />
      </Accordion>
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("testForm")(state),
    initialValues: state.instructorTest.loadedTestFormData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeField: (field, value) => {
      dispatch(change("testForm", field, value));
    },
    makeAudioFieldTouched: (field) => dispatch(touch("testForm", field)),
  };
};

const wrappedForm = reduxForm({
  form: "testForm",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(SpeakingSection);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
