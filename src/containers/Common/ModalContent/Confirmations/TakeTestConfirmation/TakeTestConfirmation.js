import React, { useEffect, useState } from "react";
import { reduxForm, getFormValues, Field, touch } from "redux-form";
import { connect } from "react-redux";
import Aux from "../../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../../store/actions/index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "../../../../../components/UI/FormElements/TextField/TextField";
import Button from "@material-ui/core/Button";
import PieChart from "../../../../../components/UI/PieChart/PieChart";
import { validate } from "./validate";
import TestInfo from "../../../../../containers/Forms/GradeTestForm/TestInfo/TestInfo";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

const TakeTestConfirmation = ({
  startTest,
  userId,
  token,
  modalDocument: testTaking = {},
  markAsSeen,
  fetchNotifications,
  notifications,
  testResults,
  modalDocument,
  modalType,
  width,
  formValues,
  touchField,
  configuration,
  closeModal,
  course,
  onStartAssignment,
  onContinueAssignment,
  loadedUser,
}) => {
  const [confirmCheckbox, setConfirmCheckBox] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  useEffect(() => {
    if (modalType === "startTestConfirmation") {
      const notificationToMark = (notifications || []).find((n) => {
        if (
          n.documentId === (modalDocument || {})._id &&
          n.documentType === "test"
        )
          return n;
        if (
          n.documentId === (modalDocument || {})._id &&
          n.documentType === "resetTest"
        )
          return n;
      });
      if (notificationToMark) {
        markAsSeen(notificationToMark._id, token);
        fetchNotifications(token);
      }
    }
  }, []);

  const handleCheckbox = (event) => {
    setConfirmCheckBox(event.target.checked);
  };

  let testType;
  if (testTaking.testType === "midterm") testType = "Midterm";
  if (testTaking.testType === "final") testType = "Final Exam";
  if (testTaking.testType === "quiz") testType = "Quiz";
  const isTestGraded = ((testResults || []).find(r => r.test === testTaking._id) || {}).graded;
  const isTestClosed = ((testResults || []).find(r => r.test === testTaking._id) || {}).closed;
  const isTestExcused = ((testResults || []).find(r => r.test === testTaking._id) || {}).isExcused;
  const isGradeViewable = ((!!testTaking.gradeReleaseDate && Date.now() > parseInt(testTaking.gradeReleaseDate)) || !testTaking.gradeReleaseDate) && isTestGraded;
  const isTestPastDue = Date.now() > parseInt(testTaking.dueDate) && !testTaking.assignment;
  const isAssignmentPastDue = Date.now() > (parseInt(testTaking.dueDate) + testTaking.lateDaysAllowed * 86400000) && testTaking.assignment;
  const isTestAvailableOnDatePassed = (Date.now() > parseInt(testTaking.availableOnDate));
  let status;
  if (!isTestAvailableOnDatePassed && !!testTaking.availableOnDate) {
    status = t("confirmations.takeTest.testNotAvailable");
    if (testTaking.assignment) {
      status = t("confirmations.takeTest.assignmentNotAvailable")
    }
  }
  if (isAssignmentPastDue) {
    status = t("confirmations.takeTest.assignmentPastDue")
  }
  if (isTestPastDue) {
    status = t("confirmations.takeTest.testPastDue")
  }
  if (isTestClosed && !isTestGraded) {
    status = t("confirmations.takeTest.gradePending")
    //grade pending
  }
  if (isTestExcused) {
    status = t("confirmations.takeTest.testExcused")
    if (testTaking.assignment) {
      status = t("confirmations.takeTest.assignmentExcused")
    }
  }
  const isTestActive = (!isTestPastDue || !testTaking.dueDate) && (isTestAvailableOnDatePassed || !testTaking.availableOnDate) && !isTestClosed

  const isAssignmentActive = (!isAssignmentPastDue || !testTaking.dueDate) && (isTestAvailableOnDatePassed || !testTaking.availableOnDate) && !isTestClosed
  // const testDueDate = parseInt(testTaking.dueDate);
  // const testTimerExpiryDate = Date.now() + parseInt(testTaking.timer) * 60000;
  // const dueDateIsFirst = testDueDate < testTimerExpiryDate;
  const pieChartData = [
    {
      id: `${width > 560 ? t("confirmations.takeTest.mc") : t("confirmations.takeTest.mcShort")} ${testTaking.sectionWeights.mcSection
        }%`,
      label: t("confirmations.takeTest.mc"),
      value: testTaking.sectionWeights.mcSection,
      color: "hsl(128, 70%, 50%)",
    },
    {
      id: `${t("confirmations.takeTest.essay")} ${testTaking.sectionWeights.essaySection}%`,
      label: t("confirmations.takeTest.essay"),
      value: testTaking.sectionWeights.essaySection,
      color: "hsl(88, 70%, 50%)",
    },
    {
      id: `${t("confirmations.takeTest.speaking")} ${testTaking.sectionWeights.speakingSection}%`,
      label: t("confirmations.takeTest.speaking"),
      value: testTaking.sectionWeights.speakingSection,
      color: "hsl(245, 70%, 50%)",
    },
    {
      id: `${width > 560 ? t("confirmations.takeTest.fillblanks") : t("confirmations.takeTest.fillblanksShort")} ${testTaking.sectionWeights.fillBlankSection
        }%`,
      label: t("confirmations.takeTest.fillblanks"),
      value: testTaking.sectionWeights.fillBlankSection,
      color: "hsl(340, 70%, 50%)",
    },
  ].filter((sec) => sec.value);

  const assignmentDataInProgress = (testResults || []).find((item) => item.test === testTaking._id);
  return (
    <div>
      <Typography align="center" gutterBottom variant="subtitle1" color="error">{status}</Typography>
      <TestInfo test={testTaking} startTest />
      {Object.values(testTaking.sectionWeights).filter((i) => i).length > 1 && (
        <div style={{ height: width > 450 ? 300 : 200 }}>
          <PieChart data={pieChartData} />
        </div>
      )}
      {(isAssignmentActive && testTaking.assignment) && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            color="primary"
            onClick={() => {
              if (!!assignmentDataInProgress) {
                // onContinueAssignment(
                //   testTaking._id,
                //   token,
                //   assignmentDataInProgress
                // );
                history.push(`/student-panel/course/${testTaking.course}/assignment-in-session/${testTaking._id}`)
              } else {
                // onStartAssignment(testTaking._id, token);
                history.push(`/student-panel/course/${testTaking.course}/assignment-in-session/${testTaking._id}`)
              }
              closeModal();
            }}
          >
            {t("confirmations.takeTest.startAssignment")}
          </Button>
        </div>
      )}
      {(isTestActive && !testTaking.assignment) && (<Aux>
        <Typography paragraph variant="caption" gutterBottom>
          {t("confirmations.takeTest.saveOften")}
        </Typography>
        {!loadedUser.isPassword && (
          <Typography color="error" paragraph variant="subtitle1" gutterBottom>
            {t("confirmations.takeTest.setUpPassword")}
          </Typography>
        )}
        <FormControlLabel
          disabled={!loadedUser.isPassword}
          control={
            <Checkbox
              checked={confirmCheckbox}
              onChange={handleCheckbox}
              value="checked"
            />
          }
          label={t("confirmations.takeTest.agree")}
        />
        <Button
          disabled={!confirmCheckbox}
          color="secondary"
          onClick={() => {
            const errors = validate(formValues);
            touchField("password");
            if (errors.password) return;
            startTest(testTaking._id, userId, token, formValues.password);
            
          }}
        >
          {t("confirmations.takeTest.startTest")}
        </Button>
        {confirmCheckbox && configuration.isPasswordRequiredStartTest && (
          <Aux>
            <Field
              component={TextField}
              name="password"
              simple
              label={t("confirmations.takeTest.loginPassword")}
              type="password"
              textLabel
              disabled={!loadedUser.isPassword}
            />
          </Aux>
        )}
      </Aux>)}
      {isGradeViewable && (<div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          color="primary"
          onClick={() => {
            history.push(`/student-panel/course/${course}/completed-${testTaking.assignment ? 'assignments' : 'tests'}/${testTaking._id}`)
            closeModal();
          }}
        >
          {testTaking.assignment ? t("confirmations.takeTest.reviewAssignment") : t("confirmations.takeTest.reviewTest")}
        </Button>
      </div>)}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    startTest: (testId, studentId, token, password) =>
      dispatch(
        actions.fetchTestStart(testId, studentId, token, null, null, password)
      ),
    closeModal: () => {
      dispatch(actions.closeModal());
    },
    markAsSeen: (id, token) => {
      dispatch(actions.markAsSeenStart(id, token));
    },
    fetchNotifications: (token) => {
      dispatch(actions.fetchNotificationsStart(token));
    },
    touchField: (field) => {
      dispatch(touch("takeTestConfirmation", field));
    },
    onStartAssignment: (assignmentId, token) => {
      dispatch(actions.fetchTestStart(assignmentId, true, token, null, false)); //second boolean = isStudent
    },
    onContinueAssignment: (assignmentId, token, assignmentDataInProgress) => {
      dispatch(
        actions.fetchTestStart(
          assignmentId,
          true, //isStudent
          token,
          assignmentDataInProgress,
          false
        )
      );
      dispatch(actions.setCoursePanel("assignment"));
    },
  };
};

const mapStateToProps = (state, myProps) => {
  const configuration = state.common.configuration;
  const match = myProps.match;
  const loadedUser = state.authentication.loadedUser;
  return {
    formValues: getFormValues("takeTestConfirmation")(state),
    userId: state.authentication.userId,
    token: state.authentication.token,
    modalDocument: state.common.modalDocument,
    modalType: state.common.modalType,
    testResults: (state.studentTest.testResults || {}).testResults,
    notifications: state.common.notifications,
    width: state.common.width,
    configuration,
    initialValues: { configuration, loadedUser },
    course: state.common.selectedCourse,
    loadedUser,
  };
};

const wrappedForm = reduxForm({
  form: "takeTestConfirmation",
  validate: validate,
  destroyOnUnmount: true,
  touchOnBlur: false,
})(TakeTestConfirmation);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
