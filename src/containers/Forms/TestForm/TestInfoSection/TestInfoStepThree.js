import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, change, getFormValues, touch } from "redux-form";
import validate from "../validate";
import DateTimePicker from "../../../../components/UI/FormElements/DateTimePicker/DateTimePicker";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

//Step three fields
//available on date
//grade release date
//test close date

const TestInfoStepThree = ({ formValues = {}, changeDateTime, isTest }) => {
  const testCreateDate = formValues.createdAt || null;
  const {t} = useTranslation('common');
  return (
    <Aux>
      <Typography paragraph variant="h4" gutterBottom>
        {t('testForm.importantDates')}
      </Typography>
      <Field
        name="availableOnDate"
        type="dateTime"
        handleChange={(date) => changeDateTime(date, "availableOnDate")}
        component={DateTimePicker}
        options={{
          disablePast: true,
          label: t('testForm.fields.availableOnDate'),
          minDate: testCreateDate,
        }}
      />

      <Field
        name="gradeReleaseDate"
        type="dateTime"
        handleChange={(date) => changeDateTime(date, "gradeReleaseDate")}
        component={DateTimePicker}
        options={{
          disablePast: true,
          label: t('testForm.fields.gradeReleaseDate'),
          minDate: testCreateDate,
        }}
      />
      <Field
        name="dueDate"
        type="dateTime"
        handleChange={(date) => changeDateTime(date, "dueDate")}
        component={DateTimePicker}
        options={{
          disablePast: true,
          label: !isTest ? t('testForm.fields.dueDate') : t('testForm.fields.closeDate'),
          minDate: testCreateDate,
        }}
        noPaddingBottom
      />
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeDateTime: (date, field) => {
      dispatch(change("testForm", field, date));
      if (!date) dispatch(touch("testForm", field));
    },
  };
};

const mapStateToProps = (state, myProps) => {
  return {
    formValues: getFormValues("testForm")(state),
  };
};

const wrappedForm = reduxForm({
  form: "testForm", // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  // enableReinitialize: true,
  validate,
})(TestInfoStepThree);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
