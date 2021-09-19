import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, getFormValues } from "redux-form";
import validate from "../validate";
import NumberPicker from "../../../../components/UI/FormElements/NumberPicker/NumberPicker";
import RadioGroup from "../../../../components/UI/FormElements/RadioGroup/RadioGroup";
import TextField from "../../../../components/UI/FormElements/TextField/TextField";
import Switch from "../../../../components/UI/Switch/Switch";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { useTranslation } from "react-i18next";
import PieChart from "../../../../components/UI/PieChart/PieChart";
import MultiLineField from "../../../../components/UI/FormElements/MultiLineField/MultiLineField";
import { OutlinedInput } from "@material-ui/core";
import { getCourse } from "../../../../utility/getCourse";

const getTotalWeight = (tests, currTest = {}) => {
  const totalWeight = tests.reduce((prev, curr) => {
    if (curr._id !== currTest._id) return prev + curr.weight;
    return prev;
  }, 0);
  const currentWeight = currTest.testWeight || currTest.assignmentWeight;
  if (!currentWeight || parseFloat(currentWeight) < 0) return totalWeight;
  return totalWeight + (currTest.isGradeIncluded ? parseFloat(parseFloat(currentWeight).toFixed(2)) : 0);
};

const TestInfoStepOne = ({ isTest, course,courses, formValues = {} }) => {
  const populatedCourse = getCourse(courses,course);
  
  const { t } = useTranslation("common");
  if(!populatedCourse)return null
  const typeOptions = [
    {
      label: t("testForm.fields.quiz"),
      value: "quiz",
      placement: "end",
      color: "primary",
    },
    {
      label: t("testForm.fields.midterm"),
      value: "midterm",
      placement: "end",
      color: "primary",
    },
    {
      label: t("testForm.fields.final"),
      value: "final",
      placement: "end",
      color: "primary",
    },
  ];
  const testWeightOptions = {
    label: `${isTest
      ? t("testForm.fields.testWeight")
      : t("testForm.fields.assignmentWeight")
      }`,
    size: "small",
    disabled: !formValues.isGradeIncluded,
  };
  const testTimeOptions = {
    label: t("testForm.fields.testTime"),
    size: "small",
    disabled: !formValues.timedTest,
    minWidth: 223,
  };
  const passGradeOptions = {
    label: t("testForm.fields.passingGrade"),
    size: "small",
    // disabled: !formValues.passRequired,
  };
  const passGradeRequiredOptions = {
    label: t("testForm.fields.passingRequired"),
    size: "small",
    disabled: formValues.testType === "quiz",
  };
  const latePenaltyOptions = {
    label: t("testForm.fields.dailyPenalty"),
    size: "small",
    disabled: !formValues.allowLateSubmission,
    minWidth: 223,
  };
  const lateDaysAllowedOptions = {
    label: t("testForm.fields.lateDaysAllowed"),
    size: "small",
    disabled: !formValues.allowLateSubmission,
    minWidth: 223,
  };
  const switchOptions = {
    label: t("testForm.fields.timedTest"),
    checked: false,
  };
  const blockedNotesSwitchOptions = {
    label: t("testForm.fields.blockLessons"),
    checked: false,
  };
  const blockedSubmissionSwitchOptions = {
    label: t("testForm.fields.allowLateSubmission"),
    checked: false,
  };
  const publishSwitchOptions = {
    label: t("testForm.fields.publish"),
    checked: false,
  };
  const excludeGradeSwitchOptions = {
    label: t("testForm.fields.includeGrade"),
    checked: true,
  };
  const testWeightIsValid =
    formValues.testWeight ||
    (formValues.assignmentWeight &&
      parseFloat(formValues.testWeight || formValues.assignmentWeight) > 0 &&
      parseFloat(formValues.testWeight || formValues.assignmentWeight) <= 1000);

  const rowValues = (populatedCourse.tests||[])
    .map((test) => {
      if (test._id === formValues._id) return null;
      return [
        `${test.testName} (${test.assignment
          ? t("testForm.assignment")
          : t(`testForm.fields.${test.testType}`)
        })`,
        `${test.weight} ${t("testForm.points")} (${parseFloat(
          parseFloat(
            (test.weight / getTotalWeight(populatedCourse.tests, formValues)) * 100
          ).toFixed(2)
        ).toString()}%)`,
      ];
    })
    .filter((i) => i);
  // color: "hsl(128, 70%, 50%)",
  // color: "hsl(340, 70%, 50%)",
  const percentWeight = parseFloat(
    (parseInt(formValues.testWeight || formValues.assignmentWeight || 0) /
      getTotalWeight(populatedCourse.tests, formValues)) *
    100
  ).toFixed(2);
  const pieChartData = [
    {
      id: `${isTest ? t("testForm.currentTest") : t("testForm.currentAssignment")
        } ${parseFloat(parseFloat(percentWeight).toFixed(2)).toString()}%`,
      label: isTest
        ? t("testForm.currentTest")
        : t("testForm.currentAssignment"),
      value: parseFloat(parseFloat(percentWeight).toFixed(2)).toString(),
      color: "hsl(88, 70%, 50%)",
    },
    {
      id: `${t("testForm.others")} ${parseFloat(
        parseFloat(100 - percentWeight).toFixed(2)
      ).toString()}%`,
      label: t("testForm.others"),
      value: parseFloat(parseFloat(100 - percentWeight).toFixed(2)).toString(),
      color: "hsl(245, 70%, 50%)",
    },
  ];
  return (
    <Aux>
      <Typography paragraph variant="h4" gutterBottom>
        {isTest
          ? t("testForm.testCustomization")
          : t("testForm.assignmentCustomization")}
      </Typography>
      <Field
        name={isTest ? "testName" : "assignmentName"}
        type="text"
        component={TextField}
        label={
          isTest
            ? t("testForm.fields.testName")
            : t("testForm.fields.assignmentName")
        }
      />
      <Field
        name="published"
        options={publishSwitchOptions}
        component={Switch}
      />
      <Field
        name="isGradeIncluded"
        options={excludeGradeSwitchOptions}
        component={Switch}
      />
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <Field
          name={isTest ? "testWeight" : "assignmentWeight"}
          component={NumberPicker}
          options={testWeightOptions}

        />
        {(!!testWeightIsValid && !!formValues.isGradeIncluded) && (
          <div style={{ minWidth: 50 }}>
            <Typography
              style={{ lineHeight: 3, marginLeft: 10 }}
              paragraph
              variant="body1"
              gutterBottom
            >
              {` / ${getTotalWeight(populatedCourse.tests, formValues)}`}
            </Typography>
          </div>
        )}
      </div>
      {(!!testWeightIsValid && !!formValues.isGradeIncluded) && (
        <div>
          <Typography paragraph variant="body1">
            {t("testForm.worthXOfTheCourse", {
              weight: formValues.isGradeIncluded ? parseFloat(
                parseFloat(percentWeight).toFixed(2)
              ).toString() : 0
            })}
          </Typography>
        </div>
      )}
      {(!!testWeightIsValid && !!formValues.isGradeIncluded) && (
        <div style={{ height: 200 }}>
          <PieChart data={pieChartData} testForm />
        </div>
      )}
      <Accordion
        index={"testWeightDistribution"}
        summary={t("testForm.otherTestsWeights")}
      >
        <Table aria-label="simple table">
          <TableBody>
            {rowValues.map((r, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {r[0]}
                </TableCell>
                <TableCell align="right">{r[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Accordion>
      {isTest ? (
        <Aux>
          <Field
            name="blockedNotes"
            options={blockedNotesSwitchOptions}
            component={Switch}
          />
          <Field name="timedTest" options={switchOptions} component={Switch} />

          <Field
            name="testTime"
            component={NumberPicker}
            options={testTimeOptions}
          />

          <Field
            component={RadioGroup}
            name="testType"
            title={t("testForm.fields.testType")}
            required={true}
            // label={"Test Type"}
            options={typeOptions}
            orientation="horizontal"
          />
          <Field
            name="passingRequired"
            options={passGradeRequiredOptions}
            component={Switch}
          />
          <Field
            name="passingGrade"
            component={NumberPicker}
            compact
            options={passGradeOptions}
          />
          <Field
            name={"notes"}
            component={MultiLineField}
            placeholder={t("testForm.fields.notesPlaceholder")}
            label={t("testForm.fields.notes")}
            options={{
              multiline: true,
              rows: 3,
              variant: OutlinedInput,
            }}
            textLabel
          />
        </Aux>
      ) : (
          <Aux>
            <Field
              name="allowLateSubmission"
              options={blockedSubmissionSwitchOptions}
              component={Switch}
            />
            <Field
              disabled={true}
              name="latePenalty"
              component={NumberPicker}
              compact
              options={latePenaltyOptions}
            />
            <Field
              disabled={true}
              name="lateDaysAllowed"
              component={NumberPicker}
              compact
              options={lateDaysAllowedOptions}
            />
          </Aux>
        )}
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("testForm")(state),
    course: state.common.selectedCourse,
    courses: state.common.courses,
  };
};

const wrappedForm = reduxForm({
  form: "testForm",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(TestInfoStepOne);

export default connect(mapStateToProps)(wrappedForm);
