import React, { Component } from "react";
import {
  Field,
  FieldArray,
  reduxForm,
  formValueSelector,
  change,
} from "redux-form";
import { validate } from "./validate";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import MultipleSelect from "../../../components/UI/FormElements/MultipleSelect/MultipleSelect";
import DateTimePicker from "../../../components/UI/FormElements/DateTimePicker/DateTimePicker";
import { connect } from "react-redux";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import Card from "@material-ui/core/Card";

const renderIrregularOfficeHours = ({ fields, t, changeDateTime, createdAt, meta: { error, submitFailed } }) => {
  return (
    <Aux>
      {(fields || []).map((date, index) => {
        return (
          <Card
            style={{
              padding: "5px",
              margin: "15px 0 0 25px",
            }}
            key={date}
          >
            <Field
              name={`irregularOfficeHours.${index}.date`}
              type="date"
              component={DateTimePicker}
              handleChange={(date) =>
                changeDateTime(
                  date,
                  `irregularOfficeHours.${index}.date`
                )
              }
              options={{
                label: t("courseForm.fields.date"),
                disablePast: true,
                minDate: createdAt,
              }}
            />
            <Field
              name={`irregularOfficeHours.${index}.timeRange`}
              type="timeRange"
              component={DateTimePicker}
              handleChange={(timeRange) =>
                changeDateTime(
                  timeRange,
                  `irregularOfficeHours.${index}.timeRange`
                )
              }
              options={{
                label: t("courseForm.fields.timeRange"),
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  fields.remove(index);
                }}
                aria-label="delete"
              >
                {t("courseForm.buttons.removeDate")}
              </Button>
            </div>
          </Card>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          startIcon={<AddIcon />}
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            fields.push();
          }}
          aria-label="delete"
        >
          {t("courseForm.buttons.addDate")}
        </Button>
      </div>
    </Aux>
  );
};

const renderRegularOfficeHours = ({ fields, t, changeDateTime, regularOfficeHours, meta: { error, submitFailed } }) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div>
      {daysOfWeek.map((day, index) => {
        const daysAvailable =
          (regularOfficeHours || {}).days || [];
        const isDay = daysAvailable.includes(day);
        console.log('isday', isDay)
        if (isDay) {
          return (
            <Aux key={`${day}[${index}]`}>
              {isDay && <Card
                style={{
                  padding: "5px",
                  margin: "15px 0 0 25px",
                }}
                key={`${day}[${index}]`}
              >
                <Typography paragraph variant="h6" gutterBottom>
                  {t(
                    `courseForm.fields.weeklyOfficeHours.${day.toLowerCase()}OfficeHours`
                  )}
                </Typography>

                <Aux>
                  <Field
                    name={`regularOfficeHours.times.${day}.timeRange`}
                    type="timeRange"
                    component={DateTimePicker}
                    handleChange={(timeRange) =>
                      changeDateTime(
                        timeRange,
                        `regularOfficeHours.times.${day}.timeRange`
                      )
                    }
                    options={{
                      label: t("courseForm.fields.timeRange"),
                    }}
                  />
                </Aux>

              </Card>}
            </Aux>
          );
        }
        return null
      })}
    </div>
  );
};

const CourseFormStepThree = ({ changeDateTime, regularOfficeHours, createdAt }) => {
  const { t } = useTranslation('common')


  return (
    <Aux>
      <Typography
        paragraph
        variant="h5"
        gutterBottom
        style={{ marginTop: "40px" }}
      >
        {t("courseForm.weeklyOfficeHours")}
      </Typography>
      <Field
        name="regularOfficeHours.days"
        label={t("courseForm.fields.daysOfWeek")}
        component={MultipleSelect}
      />
      <FieldArray name="times" component={renderRegularOfficeHours}
        t={t}
        changeDateTime={changeDateTime}
        regularOfficeHours={regularOfficeHours}
        createdAt={createdAt}
      />
      <Typography
        paragraph
        variant="h5"
        style={{ marginTop: "40px" }}
        gutterBottom
      >
        {t("courseForm.specificDateOfficeHours")}
      </Typography>
      <div style={{ width: "100%" }}>
        <FieldArray
          name="irregularOfficeHours"
          component={renderIrregularOfficeHours}
          t={t}
          changeDateTime={changeDateTime}
          regularOfficeHours={regularOfficeHours}
          createdAt={createdAt}
        />
      </div>
    </Aux>
  );

}

const mapStateToProps = (state) => {
  const courseFormSelector = formValueSelector("courseForm");
  return {
    regularOfficeHours: courseFormSelector(state, `regularOfficeHours`),
    irregularOfficeHours: courseFormSelector(state, `irregularOfficeHours`),
  };
};

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
})(CourseFormStepThree);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
