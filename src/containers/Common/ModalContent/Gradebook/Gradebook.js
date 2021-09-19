import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Field,
  reduxForm,
  getFormValues,
  getFormSyncErrors,
  touch,
} from "redux-form";
import * as actions from "../../../../store/actions/index";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import SubmitButton from "../../../../components/UI/Button/SubmitButton";
import ProgressReport from "../../ProgressReport/ProgressReport";
import { useTheme } from "@material-ui/core/styles";
import { OutlinedInput } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { getStudentProgress } from "../../../InstructorPanel/utility/getStudentProgress";
import Switch from "../../../../components/UI/Switch/Switch";
import NumberPicker from "../../../../components/UI/FormElements/NumberPicker/NumberPicker";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import MultiLineField from "../../../../components/UI/FormElements/MultiLineField/MultiLineField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import validate from "./validate";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../../utility/getCourse";
import { useParams } from "react-router-dom";

const getTotalWeight = (course, results) => {
  const excusedTestIds = ((results || []).filter(r => r.isExcused) || []).map(re => re.test);
  const unExcusedTests = (course.tests || []).filter(te => !excusedTestIds.includes(te._id));

  const totalWeight = unExcusedTests.reduce(
    (prev, curr) => prev + curr.weight,
    0
  );

  return totalWeight;
}

const isFailedRequiredTest = (course, student) => {
  const failedRequiredTest = course.tests.find((t) => {
    const associatedResult = student.testResults.find((r) => r.test === t._id);
    if (!associatedResult && t.passingRequired) return true;
    return t.passingRequired && associatedResult.grade < t.passingGrade;
  });
  return failedRequiredTest;
};


const getFinalGrade = (course, results) => {
  const excusedTestIds = ((results || []).filter(r => r.isExcused) || []).map(re => re.test);
  const unExcusedTests = (course.tests || []).filter(te => !excusedTestIds.includes(te._id) && te.isGradeIncluded && te.weight > 0);
  const finalGrade = (unExcusedTests || []).reduce((prev, curr) => {
    const result = results.find((r) => r.graded && r.test === curr._id);
    if (!result) return prev;
    return prev + (curr.weight / getTotalWeight(course, results)) * result.grade;
  }, 0);
  const finalGradeRounded = parseFloat(parseFloat(finalGrade).toFixed(2)).toString()
  if (unExcusedTests.length === 0) return 100
  return finalGradeRounded
  //  === 'NaN' ? 0 : finalGradeRounded
};

const getStudentResults = (course, student) => {
  return (((course.studentsEnrollRequests || []).find(er => er.student._id === student._id)).student || {}).testResults;
}

const getClassAverage = (course, students) => {
  const average = students.reduce((prev, currStudent) => {
    const currentFinalGrade = getFinalGrade(course, currStudent.testResults);
    return prev + parseFloat(currentFinalGrade);
  }, 0);
  const ave = parseFloat(
    parseFloat(average / students.length).toFixed(2)
  ).toString()

  return ave === "NaN" ? 0 : ave;
};

const Gradebook = ({
  token,
  course,
  enrollRequest,
  formValues = {},
  formErrors,
  gradeCourse,
  touchField,
  configuration,
  isDarkTheme,
  history,
}) => {
  const { t: tr } = useTranslation();
  const params = useParams()

  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const theme = useTheme();
  const student = (enrollRequest || {}).student
  if (!student) return null;
  const passingGrade = configuration.coursePassGrade;
  const boxStyle = {
    backgroundColor: isDarkTheme ? "#424242" : "white",
    padding: 10,
    margin: "10px auto 10px auto",
  };

  const studentResults = getStudentResults(course, student)
  const students = (course.studentsEnrollRequests || []).map(er => er.student);
  // const isDroppedOut 
  const tests = course.tests.filter((t) => !t.assignment);
  const assignments = course.tests.filter((t) => t.assignment);

  const failedRequiredTest = isFailedRequiredTest(course, student);

  const getHeaderRow = (type) => {
    return (
      <TableRow>
        <TableCell component="th" scope="row">
          {tr(`gradeBook.${type}`)}
        </TableCell>
        <TableCell component="th" align="right">
          {tr("gradeBook.weight")}
        </TableCell>
        <TableCell component="th" align="right">
          {tr("gradeBook.result")}
        </TableCell>
        {type === "test" && (
          <TableCell component="th" align="right">
            {tr("gradeBook.passingRequired")}
          </TableCell>
        )}
      </TableRow>
    );
  };

  const onSubmit = (minGrade) => {
    const errors = validate(formValues, minGrade);
    touchField("gradeAdjusted");
    if (!errors.isValid) {
      handleValidity(false);
      return;
    }
    const suggestedGrade = getFinalGrade(course, studentResults);
    let passed = formValues.gradeOverride
      ? formValues.gradeAdjusted > passingGrade
      : getFinalGrade(course, studentResults) > passingGrade;
    if (failedRequiredTest && formValues.failOverride === false) passed = false;
    if (formValues.failOverride === true) passed = true;
    gradeCourse(
      formValues,
      student._id,
      course._id,
      parseFloat(parseFloat(suggestedGrade).toFixed(2)),
      passed,
      token,
      history,
    );
  };

  const handleValidity = (value) => {
    setIsValid(value);
  };

  const handleCheckboxChange = () => {
    setConfirmCheckbox((prevState) => !prevState);
  };

  const getTestGrade = (t) => {
    const grade = (
      studentResults.find((r) => r.test === t._id && r.graded) || {}
    ).grade;
    // const isExcused =
    //   !!studentResults.find((r) => r.test === t._id && r.isExcused);
    const result = (studentResults || []).find((r) => r.test === t._id) || {};
    const isExcused = result.isExcused
    const isDeadline = t.dueDate;
    const allowLateSubmission = t.allowLateSubmission;
    const lateDaysAllowed = t.lateDaysAllowed;
    const isClosed = result.closed;

    let dueDate = parseInt(t.dueDate)
    if (allowLateSubmission) dueDate = parseInt(t.dueDate) + (lateDaysAllowed * 86400000)
    const dueDatePassed = Date.now() > dueDate;
    if (isDeadline && !isExcused && !isClosed && dueDatePassed) {
      return tr('gradeBook.missedDueDate')
    }
    if (isExcused) return tr('gradeBook.excused')
    return grade ? grade + "%" : "-";
  };

  const getTestWeight = (testWeight, totalWeight) => {
    const weight = ((testWeight / totalWeight) * 100).toFixed(2)
    if (weight === "NaN") {
      return 0
    }
    return weight

  }
  const isDeadlinePassed = parseInt(course.courseDropDeadline) < Date.now();
  const isDropCourseDeadline = !!course.courseDropDeadline;
  const isDroppedOut = (enrollRequest || {}).droppedOut;
  // const isStudentDroppedOut
  const minGrade = configuration.dropCourseGrade;
  let blockGradeMessage;
  if (isDroppedOut && !isDropCourseDeadline && configuration.isEnrollAllowedAfterDropCourse) {
    blockGradeMessage = tr("gradeBook.errors.droppedOutNoDropDeadline")
  }
  if (isDroppedOut && isDropCourseDeadline && !isDeadlinePassed && configuration.isEnrollAllowedAfterDropCourse) {
    blockGradeMessage = tr("gradeBook.errors.droppedOutDropDeadlineNotYetPassed")
  }

  const isGraded = !!((course||{}).studentGrades||[]).find(gr=>gr.student === student._id)
  return (
    <Aux>
      {(assignments.length > 0 || tests.length > 0) && (
        <Accordion
          index="progressReportGradebook"
          summary={tr("gradeBook.showProgressReport")}
          expandedSummary={tr("gradeBook.hideProgressReport")}
        >
          <ProgressReport student={student} />
        </Accordion>
      )}
      {assignments.length > 0 && (
        <div style={boxStyle}>
          <Typography paragraph variant="h6" gutterBottom>
            {tr("gradeBook.assignments")}
          </Typography>
          <Table aria-label="simple table">
            <TableBody>
              {getHeaderRow("assignment")}
              {assignments.map((a, i) => (
                <TableRow key={a._id}>
                  <TableCell scope="row">{a.testName}</TableCell>
                  <TableCell align="right">{studentResults.find(rs => rs.isExcused && rs.test === a._id) ? 'N/A' : `${getTestWeight(a.weight, getTotalWeight(course, studentResults))}%`}</TableCell>
                  <TableCell align="right">{getTestGrade(a)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {tests.length > 0 && (
        <div style={boxStyle}>
          <Typography paragraph variant="h6" gutterBottom>
            {tr("gradeBook.tests")}
          </Typography>
          <Table aria-label="simple table">
            <TableBody>
              {getHeaderRow("test")}
              {tests.map((t, i) => (
                <TableRow key={t._id}>
                  <TableCell scope="row">
                    <span style={{ display: "block" }}>{t.testName}</span>
                    <span style={{ display: "block", fontSize: "0.7em" }}>
                      {tr(`testInfo.${t.testType}`)}
                    </span>
                  </TableCell>
                  <TableCell align="right">{studentResults.find(rs => rs.isExcused && rs.test === t._id) ? 'N/A' : `${getTestWeight(t.weight, getTotalWeight(course, studentResults))}%`}</TableCell>
                  <TableCell align="right">{getTestGrade(t)}</TableCell>
                  <TableCell align="right">
                    {t.passingRequired
                      ? `${tr("gradeBook.yes")} ${t.passingGrade}%`
                      : tr("gradeBook.no")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div style={boxStyle}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {tr("gradeBook.courseProgress")}
              </TableCell>
              <TableCell align="right">{`${getStudentProgress(
                course,
                student,
                studentResults,
              )}%`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                {tr("gradeBook.classAverage")}
              </TableCell>
              <TableCell align="right">{`${getClassAverage(course, students)}%`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                {tr("gradeBook.passingGrade")}
              </TableCell>
              <TableCell align="right">{`${passingGrade}%`}</TableCell>
            </TableRow>
            {!(formValues || {}).gradeOverride && (
              <TableRow>
                <TableCell component="th" scope="row">
                  <span> {tr("gradeBook.finalGrade")}</span>{" "}
                  {(getFinalGrade(course, studentResults) >= passingGrade &&
                    !failedRequiredTest) ||
                    formValues.failOverride ? (
                    <span style={{ color: "#4caf50", marginLeft: 5 }}>
                      {tr("gradeBook.passed")}
                    </span>
                  ) : (
                    <span style={{ color: "red", marginLeft: 5 }}>
                      {" "}
                      {tr("gradeBook.failed")}
                    </span>
                  )}
                </TableCell>
                <TableCell align="right">{`${getFinalGrade(course,
                  studentResults
                )}%`}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* {((isDropCourseDeadline && isDeadlinePassed) || !isDropCourseDeadline) && (
        <Aux> */}

      <Field
        name="gradeOverride"
        options={{ label: tr("gradeBook.overrideGrade"), checked: false }}
        component={Switch}
      />
      <Field
        name="failOverride"
        options={{
          label: tr("gradeBook.overrideFail"),
          checked: false,
          disabled: failedRequiredTest
            ? false
            : formValues.gradeOverride
              ? formValues.gradeAdjusted >= passingGrade
              : getFinalGrade(course, studentResults) >= passingGrade,
        }}
        component={Switch}
      />
      <div style={{ display: "flex", justifyContent: "start" }}>
        <Field
          name="gradeAdjusted"
          component={NumberPicker}
          options={{
            label: tr("gradeBook.gradeAdjustment"),
            size: "small",
            disabled: !(formValues || {}).gradeOverride,
          }}
        />
        {formValues.gradeOverride &&
          parseFloat(formValues.gradeAdjusted) >= 0 &&
          parseFloat(formValues.gradeAdjusted) <= 100 && (
            <Aux>
              {(parseFloat(formValues.gradeAdjusted) >= passingGrade &&
                !failedRequiredTest) ||
                formValues.failOverride ? (
                <span
                  style={{ color: "#4caf50", marginLeft: 25, lineHeight: 3 }}
                >
                  {tr("gradeBook.passed")}
                </span>
              ) : (
                <span style={{ color: "red", marginLeft: 25, lineHeight: 3 }}>
                  {tr("gradeBook.failed")}
                </span>
              )}
            </Aux>
          )}
      </div>
      {failedRequiredTest && (
        <Typography paragraph variant="body1" gutterBottom color="error">
          {tr("gradeBook.requiredTestNotPassed")}
        </Typography>
      )}
      <div style={{ marginBottom: 20 }}>
        <Typography paragraph variant="body1" gutterBottom>
          {tr("gradeBook.gradeAdjustmentExplanation")}
        </Typography>
        <Field
          name="gradeAdjustmentExplanation"
          component={MultiLineField}
          label={tr("gradeBook.gradeAdjustmentExplanation")}
          options={{
            multiline: true,
            rows: 3,
            variant: OutlinedInput,
            disabled: !(formValues || {}).gradeOverride,
          }}
        />
      </div>
      <Typography paragraph variant="caption">
        {tr("gradeBook.warning")}
      </Typography>

      {blockGradeMessage && (
        <Typography paragraph color="error" variant="subtitle1">
          {blockGradeMessage}
        </Typography>
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={confirmCheckbox}
            onChange={handleCheckboxChange}
            value="checked"
            disabled={!!blockGradeMessage}
          />
        }
        label={tr("gradeBook.agree")}
      />
      {
        (getFinalGrade(course, studentResults) < configuration.dropCourseGrade && !formValues.gradeOverride) && (
          <Typography paragraph color="error" variant="caption">
            {formErrors.gradeAdjusted}
          </Typography>
        )
      }

      <SubmitButton
        clicked={() => onSubmit(minGrade)}
        disabled={!confirmCheckbox}
        isError={!(isValid || formErrors.isValid)}
      >
        {isGraded ? tr("gradeBook.buttons.updateFinalGrade") :  tr("gradeBook.buttons.postGrade")}
      </SubmitButton>

      {/* </Aux>
      )} */}
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    approveEnroll: (student, course, token) =>
      dispatch(actions.enrollCourseStart(student, course, token)),
    touchField: (field) => {
      dispatch(touch("gradeCourse", field));
    },
    denyEnroll: (student, course, token) =>
      dispatch(actions.enrollDenyStart(student, course, token)),
    gradeCourse: (
      formValues,
      courseId,
      studentId,
      suggestedGrade,
      passed,
      token,
      history,
    ) => {
      dispatch(
        actions.gradeCourseStart(
          formValues,
          courseId,
          studentId,
          suggestedGrade,
          passed,
          token,
          history,
        )
      );
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const match = ownProps.match
  const selectedCourse = state.common.selectedCourse;
  const courses = state.common.courses;
  const populatedCourse = getCourse(courses, selectedCourse) || {};
  const student = ((populatedCourse.studentsEnrollRequests || []).find(rq => rq.student._id === match.params.studentId) || {}).student;
  const enrollRequest = (populatedCourse.studentsEnrollRequests || []).find(rq => rq.student._id === match.params.studentId) || {}
  if (!student) return {}
  const config = state.common.configuration;
  const minGrade = config.dropCourseGrade
  const passingGrade = populatedCourse.passingGrade || 50;
  const grade = (populatedCourse.studentGrades || []).find(
    (g) => g.student === student._id
  );
  const autoFinalGrade = getFinalGrade(populatedCourse, getStudentResults(populatedCourse, student))
  let initialValues;
  if (grade) {
    const isFailOverride =
      (grade.grade < passingGrade ||
        (isFailedRequiredTest(populatedCourse, student))) && grade.passed;

    initialValues = {
      gradeOverride: grade.gradeOverride,
      gradeAdjusted: grade.gradeOverride ? grade.grade : null,
      gradeAdjustmentExplanation: grade.gradeAdjustmentExplanation,
      failOverride: isFailOverride,
      minGrade,
      autoGrade: autoFinalGrade,
    };
  } else {
    initialValues = {
      failOverride: false,
      gradeOverride: false,
      minGrade,
      autoGrade: autoFinalGrade,
    };
  }
  return {
    formValues: getFormValues("gradeCourse")(state),
    formErrors: getFormSyncErrors("gradeCourse")(state),
    courses: courses,
    course: populatedCourse,
    students: state.common.students,
    enrollRequest,
    token: state.authentication.token,
    initialValues,
    configuration: config,
    isDarkTheme: state.common.isDarkTheme,
  };
};

const wrappedForm = reduxForm({
  form: "gradeCourse",
  enableReinitialize: true,
  validate: validate,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(Gradebook);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
