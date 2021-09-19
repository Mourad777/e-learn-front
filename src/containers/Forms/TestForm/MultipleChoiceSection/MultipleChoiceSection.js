import React from "react";
import { connect } from "react-redux";
import {
  reduxForm,
  FieldArray,
  getFormValues,
  change,
  touch,
} from "redux-form";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import Questions from "../../../InstructorPanel/Questions/Questions";
// import { multipleChoiceInstructions } from "../SectionInstructions";
import validate from "../validate";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import RenderQuestions from "./renderQuestions";


const MultipleChoiceSection = ({ clearAnswers, formValues = {}, ...rest }) => {
  const { t } = useTranslation();
  const indexToAddQuestion = (formValues.mcQuestions || []).length;
  return (
    <Aux>
      <Typography variant="h4" gutterBottom>
        {t("testForm.mcSection")}
      </Typography>
      <FieldArray
        name="mcQuestions"
        clearAnswers={clearAnswers}
        props={rest}
        formValues={formValues}
        component={RenderQuestions}
        t={t}
      />
      <Accordion index={0} summary={t("testForm.selectQuestion")}>
        <Questions
          questionType="Multiple-choice questions"
          selecting
          indexToAdd={indexToAddQuestion}
        />
      </Accordion>
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAnswers: (index) => {
      dispatch(change("testForm", `mcQuestions[${index}.correctAnswers]`, []));
    },
    touchCheckboxes: (field) => {
      dispatch(touch("testForm", field));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("testForm")(state),
    initialValues: state.instructorTest.loadedTestFormData,
  };
};

const wrappedForm = reduxForm({
  form: "testForm",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: false,
  validate,
})(MultipleChoiceSection);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
