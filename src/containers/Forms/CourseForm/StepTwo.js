import React from "react";
import { Field, reduxForm, change } from "redux-form";
import {validate} from "./validate";
import DateTimePicker from "../../../components/UI/FormElements/DateTimePicker/DateTimePicker";
import { connect } from "react-redux";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

const CourseFormStepTwo = ({changeDateTime, createdAt}) => {

    const {t} = useTranslation('common')
    return (
      <Aux>
        <Typography paragraph variant="h5" gutterBottom>
        {t("courseForm.importantDates")}
        </Typography>
        <Field
          name="enrollmentPeriod"
          component={DateTimePicker}
          fullWidth
          options={{
            minDate:createdAt,
            disablePast: true,
            label: t("courseForm.fields.enrollmentPeriod"),
          }}
          type="dateTimeRange"
          handleChange={(date) =>
            changeDateTime(date, "enrollmentPeriod")
          }
        />
        <Field
          name="courseTimeline"
          component={DateTimePicker}
          fullWidth
          options={{
            disablePast: true,
            label: t("courseForm.fields.courseDuration"),
            minDate:createdAt,
          }}
          type="dateTimeRange"
          handleChange={(date) =>
            changeDateTime(date, "courseTimeline")
          }
        />
        <Field
          name="courseDropDeadline"
          component={DateTimePicker}
          fullWidth
          options={{
            disablePast: true,
            label: t("courseForm.fields.deadlineToDrop"),
            minDate:createdAt,
          }}
          type="dateTime"
          handleChange={(date) =>
            changeDateTime(date, "courseDropDeadline")
          }
        />
      </Aux>
    );
  
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeDateTime: (date, field) => {
      dispatch(change("courseForm", field, date));
    },
  };
};

const wrappedForm = reduxForm({
  form: "courseForm",
  validate: validate,
  destroyOnUnmount: false,
})(CourseFormStepTwo);

export default connect(null, mapDispatchToProps)(wrappedForm);