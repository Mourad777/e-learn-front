import React from "react";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import classes from "./Tests.modules.css";
import Accordion from "../../../components/UI/Accordion/Accordion";
import { ListItemIcon } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AssessmentIcon from "@material-ui/icons/Assessment";
import EditIcon from "@material-ui/icons/Edit";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";
import { useHistory } from "react-router-dom";

const CompletedTests = ({
  testResults,
  isTest,
  isAssignment,
  folder,
  isModules,
  course,
  courses,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const tr = t;
  const folderIds = (folder || []).map((item) => item.documentId) || [];
  return (
    <Aux>
      {!isModules && <Typography align="center" variant="h4" gutterBottom>{isTest ? t("layout.drawer.tests") : t("layout.drawer.assignments")}</Typography>}
      {((testResults || {}).testResults || []).map((test, index) => {
        if (!test.closed || test.isExcused) return null;
        const testId = (test || {}).test;
        const populatedCourse = getCourse(courses, course)
        const allTests = (populatedCourse || {}).tests;
        const insTest =
          (allTests || []).find((test) => {
            return test._id === testId;
          }) || {};
        if (insTest.course !== course) return null; //filter out test results that don't belong in this course
        const areCompletedTests =
          (testResults || {}).testResults.findIndex((t) => t.closed) > -1;
        if (!areCompletedTests)
          return (
            <Typography variant="subtitle1">
              {isTest
                ? tr("tests.notCompletedTests")
                : tr("tests.notCompletedAssignments")}
            </Typography>
          );
        function createData(info, value) {
          return { info, value };
        }
        const rowsSectionsMarks = [
          ((insTest || {}).sectionWeights || {}).mcSection
            ? createData(
              tr("testReview.multiplechoicesection"),
              `${((test || {}).multiplechoiceSection || {}).grade}%`
            )
            : null,
          ((insTest || {}).sectionWeights || {}).essaySection
            ? createData(
              tr("testReview.essaysection"),
              `${((test || {}).essaySection || {}).grade}%`
            )
            : null,
          ((insTest || {}).sectionWeights || {}).speakingSection
            ? createData(
              tr("testReview.speakingsection"),
              `${((test || {}).speakingSection || {}).grade}%`
            )
            : null,
          ((insTest || {}).sectionWeights || {}).fillBlankSection
            ? createData(
              tr("testReview.fillintheblankssection"),
              `${((test || {}).fillInBlanksSection || {}).grade}%`
            )
            : null,
        ].filter((item) => item !== null);

        const summary = (
          <Aux>
            <Typography variant="h5" gutterBottom>
              {tr("tests.summary")}
            </Typography>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                {rowsSectionsMarks.map((row, index) => {
                  return (
                    <TableRow
                      className={index === 0 ? classes.MuiTableRow : ""}
                      key={row.info}
                    >
                      <TableCell
                        className={index === 0 ? classes.MuiTableCell : ""}
                        component="th"
                        scope="row"
                      >
                        {row.info}
                      </TableCell>
                      <TableCell
                        className={index === 0 ? classes.MuiTableCell : ""}
                        align="right"
                      >
                        {row.value}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Aux>
        );
        //The test has been submitted by the student but the instructor
        //has not yet graded it
        //Should display grade availability date if date has not yet passed
        //else it should display grade pending
        if (isAssignment && !insTest.assignment) return null;
        if (isTest && insTest.assignment) return null;
        if (
          (!test.graded ||
            (insTest.gradeReleaseDate > Date.now() &&
              insTest.gradeReleaseDate) ||
            (!test.grade && test.grade !== 0)) &&
          test.closed
        )
          return (
            <Aux key={test._id}>
              {!isModules && (
                <Accordion
                  index={index}
                  disabled
                  noDetails
                  summary={
                    insTest.testName + " " + tr(`tests.${insTest.testType}`)
                  }
                  secondaryText={
                    insTest.gradeReleaseDate > Date.now()
                      ? tr("tests.gradesReleaseOn") +
                      " " +
                      moment(parseInt(insTest.gradeReleaseDate))
                        .locale(localStorage.getItem("i18nextLng"))
                        .format("dddd, MMMM DD YYYY, HH:mm")
                      : tr("tests.gradePending")
                  }
                />
              )}
              {/*not yet graded modules case*/}
              {isModules && folderIds.includes(test.test) && (
                <ListItem style={{ display: "block" }} disabled>
                  <div style={{ display: "flex" }}>
                    <FormControlLabel
                      control={<Checkbox checked value="checked" />}
                    />
                    <ListItemIcon style={{ margin: "auto", minWidth: "30px" }}>
                      {isTest ? (
                        <AssessmentIcon color="primary" />
                      ) : (
                        <EditIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={insTest.testName} />
                  </div>
                  <ListItemText
                    // primary={insTest.testName}
                    secondary={
                      insTest.gradeReleaseDate > Date.now()
                        ? tr("tests.gradesReleaseOn") +
                        " " +
                        moment(parseInt(insTest.gradeReleaseDate))
                          .locale(localStorage.getItem("i18nextLng"))
                          .format("dddd, MMMM DD YYYY, HH:mm")
                        : tr("tests.gradePending")
                    }
                  />
                </ListItem>
              )}
            </Aux>
          );
        return (
          <Aux key={test._id}>
            {!isModules && (
              <Accordion
                index={index}
                summary={`${insTest.testName} ${insTest.testType.charAt(0).toUpperCase() +
                  insTest.testType.slice(1)
                  } ${(test || {}).grade}%`}
              >
                {summary}
                <Button
                  fullWidth
                  color="primary"
                  onClick={() => {
                    history.push(`/student-panel/course/${course}/completed-${insTest.assignment ? 'assignments' : 'tests'}/${insTest._id}`)
                  }}
                >
                  {isTest ? tr("tests.reviewTest") : tr("tests.reviewAssignment")}

                </Button>
              </Accordion>
            )}
            {isModules && folderIds.includes(test.test) && (
              <ListItem
                button
                onClick={() => {
                  history.push(`/student-panel/course/${course}/completed-${insTest.assignment ? 'assignments' : 'tests'}/${insTest._id}`)
                }}
                style={{ display: "block" }}
              >
                <div style={{ display: "flex" }}>
                  <FormControlLabel
                    control={<Checkbox checked value="checked" />}
                  />
                  <ListItemIcon style={{ margin: "auto", minWidth: "30px" }}>
                    {isTest ? (
                      <AssessmentIcon color="primary" />
                    ) : (
                      <EditIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${insTest.testName} ${(test || {}).grade}%`}
                  />
                </div>
              </ListItem>
            )}
          </Aux>
        );
      })}
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    courses: state.common.courses,
    course: state.common.selectedCourse,
    testResults: state.studentTest.testResults,
    studentId: state.authentication.userId,
    token: state.authentication.token,
  };
};

export default connect(mapStateToProps)(CompletedTests);
