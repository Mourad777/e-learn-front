import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import moment from "moment";
import { ListItemIcon, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AssessmentIcon from "@material-ui/icons/Assessment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";

const IncompleteTests = ({
  testResults = {},
  isTest,
  token,
  folder,
  isModules,
  course = {},
  isAssignment,
  notifications,
  openModal,
  markAsSeen,
}) => {
  useEffect(() => {
    const testIds = (course.tests || []).filter((t) => !t.assignment).map((i) => i._id);
    const assignmentIds = ((course.tests || []))
      .filter((t) => t.assignment)
      .map((i) => i._id);

    const notificationToMark = (notifications || []).find((n) => {
      if (
        (testIds || []).includes(n.documentId) &&
        isTest &&
        n.documentType === "test" &&
        !n.seen
      )
        return n;
      if (
        (assignmentIds || []).includes(n.documentId) &&
        isAssignment &&
        n.documentType === "assignment" &&
        !n.seen
      )
        return n;
      if (
        (assignmentIds || []).includes(n.documentId) &&
        isAssignment &&
        n.documentType === "resetAssignment" &&
        !n.seen
      )
        return n;
    });
    if (notificationToMark) {
      markAsSeen(notificationToMark._id, token);
    }
  }, []);

  const incAsRefs = (testResults || {}).assignmentsInSession;
  const courseTestResults =
    ((testResults || {}).testResults || []).filter(
      (result) => result.course === course._id
    ) || [];

  const completedTestsIds = courseTestResults
    .filter((r) => {
      if (r.closed && !r.isExcused) return r.test;
      return null;
    })
    .map((item) => item.test);

  const excusedTestIds = (((testResults || {}).testResults || []).filter(re => re.isExcused) || []).map(r => r.test);
  // const allTests = courseTests.filter((item) => !item.assignment);
  const tests = (course.tests || []).filter((item) => !item.assignment);
  const assignments = (course.tests || []).filter((item) => item.assignment);
  const incompleteTests = tests
    .filter((test) => {
      if (!completedTestsIds.includes(test._id)) return !test.assignment;
      return null;
    })
    .filter((t) => t);
  // const allAssignments = courseTests.filter((item) => item.assignment);
  const incompleteAssignments = assignments.filter((test) => {
    if (!completedTestsIds.includes(test._id)) return test.assignment;
    return null;
  });
  let evaluations;
  if (isTest) evaluations = incompleteTests;
  if (isAssignment) evaluations = incompleteAssignments;
  const folderIds = (folder || []).map((item) => item.documentId) || [];
  const { t } = useTranslation();
  const tr = t
  return (
    <Aux>
      {!isModules && <Typography align="center" variant="h4" gutterBottom>{isTest ? t("layout.drawer.tests") : t("layout.drawer.assignments")}</Typography>}
      {(evaluations || []).map((t, index) => {
        //filter out tests/assignments that are not in the folder
        if (!folderIds.includes(t._id) && isModules) return null;

        //display assignments that have not yet been completed
        const dueDate = new Date(parseInt(t.dueDate || "")).getTime();
        const isPastDue = Date.now() > dueDate;
        const daysLate = Math.ceil((Date.now() - dueDate) / 86400000);
        const hasExceededLateDays = daysLate > (t.lateDaysAllowed || 0);
        const isOpened = parseInt(t.availableOnDate) < Date.now();
        if (t.assignment) {
          return (
            <Aux key={t._id}>
              {(incAsRefs || []).map((t) => t.assignment).includes(t._id) ? ( // case for assignments that were started but not completed
                <ListItem
                  // disabled={hasExceededLateDays}
                  style={{ display: "block" }}
                  button
                  onClick={(e) => {
                    e.stopPropagation();
                    const assignmentDataInProgress = (
                      (testResults || {}).testResults || []
                    ).find((item) => item.test === t._id);
                    // onContinueAssignment(
                    //   t._id,
                    //   token,
                    //   assignmentDataInProgress
                    // );
                    openModal(t, "startAssignmentConfirmation");
                    // history.push(`/student-panel/course/${course._id}/assignment-in-session`)
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {isModules && (
                      <Aux>
                        <FormControlLabel
                          control={<Checkbox checked={false} value="checked" />}
                        />
                        <ListItemIcon
                          style={{ margin: "auto", minWidth: "30px" }}
                        >
                          <EditIcon color="primary" />
                        </ListItemIcon>
                      </Aux>
                    )}
                    <ListItemText
                      primary={`${tr("tests.continueAssignment")} ${t.testName}`}
                    />
                  </div>
                  {hasExceededLateDays && (
                    <Typography style={{ color: "red" }}>
                      {tr("tests.missedDeadline")}
                    </Typography>
                  )}
                  {t.dueDate && (
                    <div>
                      <ListItemText
                        secondary={`
                     ${isPastDue ? tr("tests.assignmentWasDueOn") : tr("tests.assignmentIsDueOn")} ${moment(
                          parseInt(t.dueDate)
                        )
                            .locale(localStorage.getItem("i18nextLng"))
                            .format("dddd, MMMM DD YYYY, HH:mm")}
                    `}
                      />
                    </div>
                  )}
                </ListItem>
              ) : (
                // case for assignments that were not attempted
                <ListItem
                  style={{ display: "block" }}
                  // disabled={
                  //   (Date.now() < parseInt(t.availableOnDate || 0) ||
                  //     hasExceededLateDays) || excusedTestIds.includes(t._id)
                  // }
                  button
                  onClick={(e) => {
                    e.stopPropagation();
                    // onStartAssignment(t._id, token);
                    openModal(t, "startAssignmentConfirmation");
                    // history.push(`/student-panel/course/${course._id}/assignment-in-session`)
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {isModules && (
                      <Aux>
                        <FormControlLabel
                          control={<Checkbox checked={false} value="checked" />}
                        />
                        <ListItemIcon
                          style={{ margin: "auto", minWidth: "30px" }}
                        >
                          <EditIcon color="primary" />
                        </ListItemIcon>
                      </Aux>
                    )}
                    <ListItemText primary={`${tr("tests.startAssignment")} ${t.testName}`} />
                  </div>
                  {hasExceededLateDays && (
                    <Typography style={{ color: "red" }}>
                      {tr("tests.missedDeadline")}
                    </Typography>
                  )}
                  {
                    excusedTestIds.includes(t._id) && (
                      <Typography style={{ color: "red" }}>
                        {tr("tests.excused")}
                      </Typography>
                    )
                  }

                  {t.availableOnDate && (
                    <div>
                      <ListItemText
                        secondary={`
                         ${isOpened ? tr("tests.assignmentHasOpenedOn") : tr("tests.assignmentWillOpenOn")} ${moment(
                          parseInt(t.availableOnDate)
                        )
                            .locale(localStorage.getItem("i18nextLng"))
                            .format("dddd, MMMM DD YYYY, HH:mm")}
                      `}
                      />
                    </div>
                  )}
                  {t.dueDate && (
                    <div>
                      <ListItemText
                        secondary={`${hasExceededLateDays ? tr("tests.wasDueOn") : tr("tests.DueOn")
                          } ${moment(parseInt(t.dueDate))
                            .locale(localStorage.getItem("i18nextLng"))
                            .format("dddd, MMMM DD YYYY, HH:mm")}
                          `}
                      />
                    </div>
                  )}

                  {t.allowLateSubmission && !hasExceededLateDays && (
                    <Aux>
                      <ListItemText
                        secondary={`${t.latePenalty}% ${tr("tests.latePenalty")}
                      `}
                      />
                      <ListItemText
                        secondary={`${tr("tests.closesOn")} ${moment(
                          parseInt(t.dueDate) + t.lateDaysAllowed * 86400000
                        )
                          .locale(localStorage.getItem("i18nextLng"))
                          .format("dddd, MMMM DD YYYY, HH:mm")}
                          `}
                      />
                    </Aux>
                  )}


                  {t.allowLateSubmission &&
                    !hasExceededLateDays &&
                    isPastDue && (
                      <Typography
                        style={{ color: "red" }}
                      >{`${tr("tests.latePenaltyAccumulated")} ${daysLate * t.latePenalty
                        }%`}</Typography>
                    )}
                </ListItem>
              )}
            </Aux>
          );
        }

        //display tests that have not yet been completed
        if (!t.assignment) {
          const testAttempted =
            ((testResults || {}).testResults || []).findIndex(
              (result) => result.test === t._id
            ) !== -1;
          return (
            <Aux key={t._id}>
              <ListItem
                // disabled={
                //   Date.now() < parseInt(t.availableOnDate) ||
                //   hasExceededLateDays ||
                //   testAttempted
                // }
                style={{ display: "block" }}
                button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(t, "startTestConfirmation");
                }}
                key={t._id}
              >
                <div style={{ display: "flex" }}>
                  {isModules && (
                    <Aux>
                      <FormControlLabel
                        control={<Checkbox checked={false} value="checked" />}
                      />
                      <ListItemIcon
                        style={{ margin: "auto", minWidth: "30px" }}
                      >
                        <AssessmentIcon color="primary" />
                      </ListItemIcon>
                    </Aux>
                  )}
                  <ListItemText primary={t.testName} />
                  <Typography
                    style={{ marginTop: "8px" }}
                    variant="caption"
                    color={
                      t.testType === "final" || t.testType === "midterm"
                        ? "error"
                        : "inherit"
                    }
                  >
                    {tr(`tests.${t.testType}`)}
                  </Typography>
                </div>
                {t.availableOnDate && (
                  <div>
                    <ListItemText
                      secondary={`${isOpened
                        ? tr("tests.testHasOpenedOn")
                        : tr("tests.testWillOpenOn")
                        } ${moment(parseInt(t.availableOnDate))
                          .locale(localStorage.getItem("i18nextLng"))
                          .format("dddd, MMMM DD YYYY, HH:mm")}
              `}
                    />
                  </div>
                )}
                {t.dueDate && (
                  <div>
                    <ListItemText
                      secondary={`
                      ${hasExceededLateDays
                          ? tr("tests.testClosedOn")
                          : tr("tests.testClosesOn")
                        } 
                      ${moment(parseInt(t.dueDate))
                          .locale(localStorage.getItem("i18nextLng"))
                          .format("dddd, MMMM DD YYYY, HH:mm")}
                    `}
                    />
                  </div>
                )}
                {hasExceededLateDays && (
                  <Typography style={{ color: "red" }}>
                    {tr("tests.missedDeadline")}
                  </Typography>
                )}

                {
                  excusedTestIds.includes(t._id) && (
                    <Typography style={{ color: "red" }}>
                      {tr("tests.excused")}
                    </Typography>
                  )
                }
              </ListItem>
            </Aux>
          );
        }
      })}
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (document, type) => dispatch(actions.openModal(document, type)),
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
    markAsSeen: (id, token) => {
      dispatch(actions.markAsSeenStart(id, token));
    },
  };
};

const mapStateToProps = (state) => {
  const populatedCourse = getCourse(state.common.courses, state.common.selectedCourse);
  return {
    course: populatedCourse,
    testResults: state.studentTest.testResults,
    token: state.authentication.token,
    notifications: state.common.notifications,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IncompleteTests);
