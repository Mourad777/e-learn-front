import React from "react";
import { connect } from "react-redux";
import { reduxForm, FieldArray, getFormValues } from "redux-form";
import validate from "../validate";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import Questions from "../../../InstructorPanel/Questions/Questions";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import {renderQuestions} from './RenderQuestions';

const EssaySection = ({ formValues = {}, path }) => {
  const { t } = useTranslation();
  const indexToAddQuestion = (formValues.essayQuestions || []).length;
  return (
    <Aux>
      <Typography variant="h4" gutterBottom>
        {t("testForm.essaySection")}
      </Typography>
      <FieldArray
        name="essayQuestions"
        component={renderQuestions}
        formValues={formValues}
        path={path}
        t={t}
      />
      <Accordion index={0} summary={t("testForm.selectQuestion")}>
        <Questions
          questionType="Essay questions"
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
    token: state.authentication.token,
    initialValues: state.instructorTest.loadedTestFormData,
  };
};

const wrappedForm = reduxForm({
  form: "testForm",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(EssaySection);

export default connect(mapStateToProps, null)(wrappedForm);
