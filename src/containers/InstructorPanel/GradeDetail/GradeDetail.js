import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import Autosuggest from "../../../components/UI/FormElements/Autosuggest/Autosuggest";
import RadioGroup from "../../../components/UI/FormElements/RadioGroup/RadioGroup";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import moment from "moment";
import * as actions from "../../../store/actions/index";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
  MuiTableRowBlue: {
    background: "#2196f3",
  },
  MuiTableRowDanger: {
    background: "#f44336",
  },
  WhiteText: {
    color: "white",
  },
  DangerText: {
    color: "#f44336",
  },
  SuccessText: {
    color: "#4caf50",
  },
  MuiButton: {
    marginLeft: "20px",
    "&:hover": {
      border: "1px solid #1976d2",
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
    },
  },
  MuiButtonDark: {
    backgroundColor: "#595959",
    marginLeft: "20px",
    "&:hover": {
      border: "1px solid #1976d2",
      backgroundColor: "#424242",
      color: "#1976d2",
    },
  },
  studentFilterContainer: {
    width: "100%",
    // height: "100px",
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 10,
    marginTop: 30,
  },
});

function GradeDetail({
  isTest,
  isAssignment,
  course,
  students = [],
  token,
  closeTest,
  openModal,
  isDarkTheme,
  history,
}) {
  const { t } = useTranslation();
  const [student, setStudent] = useState("");
  const [test, setTest] = useState("");
  const [studentId, setStudentId] = useState("");
  const [filter, setFilter] = useState("studentName");
  const [workFilter, setWorkFilter] = useState("all");

  useEffect(() => {
    const student = (students || [])[0];
    if (student) {
      setStudent(`${student.firstName} ${student.lastName}`);
      setStudentId(student._id.replace(/\D/g, ""));
      const firstTest = isTest
        ? (course.tests || []).filter((t) => !t.assignment)[0]
        : (course.tests || []).filter((t) => t.assignment)[0];

      setTest((firstTest || {}).testName);
    }
  }, [JSON.stringify(students)]);
  const classes = useStyles();

  function createData(info, value) {
    return { info, value };
  }

  const tests = course.tests.filter((item) => !item.assignment && item.published) || [];
  const getInstructorTest = (testId) => {
    const test = course.tests.find((t) => t._id === testId);
    return test;
  };
  const assignments = course.tests.filter((item) => item.assignment && item.published) || [];
  const testsIds = tests.map((item) => item._id);
  const assignmentsIds = assignments.map((item) => item._id);

  const testResults = [];
  const allPassedTests = tests
    .filter((test) => {
      const dueDate = parseInt(test.dueDate);
      if (Date.now() > dueDate) return test;
      return null;
    })
    .map((test) => test._id);
  const allPassedAssignments = assignments
    .filter((assignment) => {
      const dueDate = parseInt(assignment.dueDate);
      const daysLate = Math.ceil((Date.now() - dueDate) / 86400000);
      const exceededLateDays = daysLate > (assignment.lateDaysAllowed || 0);
      if (exceededLateDays) return assignment;
      return null;
    })
    .map((assignment) => assignment._id);

  //if test panel put all test results in array
  const missedTests = [];
  const incompleteTests = [];
  if (isTest) {
    (students || []).forEach((student) => {
      student.testResults.forEach((testResult) => {
        const result = {
          student: student,
          testResult: testResult,
          test: tests.find((test) => test._id === testResult.test),
        };
        //test submitted
        if (testsIds.includes(testResult.test) && testResult.closed)
          testResults.push(result);
        //test started but never submitted

        if (
          (testsIds.includes(testResult.test) &&
            !testResult.closed
            //  &&
            // allPassedTests.includes(testResult.test)
            )
             ||
          (testResult || {}).test === (student.testInSession || {}).test
        )
          incompleteTests.push(result);
      });
    });

    allPassedTests.forEach((testPastdue) => {
      (students || []).forEach((student) => {
        const result = {
          student: student,
          // testResult: assignmentResult,
          test: tests.find((test) => test._id === testPastdue),
        };
        const testsStarted = student.testResults.map((result) => result.test);
        if (!testsStarted.includes(testPastdue)) missedTests.push(result);
      });
    });
  }
  //if assignment panel put all assignment results in array
  const missedAssignments = [];
  const incompleteAssignments = [];
  if (isAssignment) {
    (students || []).forEach((student) =>
      student.testResults.forEach((re) => {
        const result = {
          student: student,
          testResult: re,
          test: assignments.find(
            (assignment) => assignment._id === re.test
          ),
        };
        //assignment submitted
        if (
          assignmentsIds.includes(re.test) &&
          re.closed
        )
          testResults.push(result);
        //assignment started but never submitted
        if (
          assignmentsIds.includes(re.test) &&
          !re.closed
          // &&
          // allPassedAssignments.includes(re.test)
        )
          incompleteAssignments.push(result);
      })
    );

    allPassedAssignments.forEach((passedAssignment) => {
      (students || []).forEach((student) => {
        const result = {
          student: student,
          // testResult: assignmentResult,
          test: assignments.find(
            (assignment) => assignment._id === passedAssignment
          ),
        };
        const testsStarted = student.testResults.map((result) => result.test);
        if (!testsStarted.includes(passedAssignment))
          missedAssignments.push(result);
      });
    });
  }

  const searchNames = (students || []).map((student) => {
    return `${student.firstName} ${student.lastName}`;
  });
  const searchTests = (tests || []).map((test) => {
    return test.testName;
  });
  const searchAssignments = (assignments || []).map((assignment) => {
    return assignment.testName;
  });
  const handleSelectedTest = (oldValue, selectedTest) => {
    setTest(selectedTest);
  };
  const handleSelectedStudentId = (oldValue, selectedStudentId) => {
    setStudentId(oldValue.target.value);
  };
  const handleSelectedName = (oldValue, selectedName) => {
    setStudent(selectedName);
  };
  const handleRadioButton = (e) => {
    setFilter(e.target.value);
  };
  const handleRadioButtonWork = (e) => {
    setWorkFilter(e.target.value);
  };
  const workFilterOptions = [
    {
      label: t("gradeWork.all"),
      value: "all",
      placement: "end",
      color: "primary",
    },
    {
      label: t("gradeWork.toReview"),
      value: "toReview",
      placement: "end",
      color: "primary",
    },
    {
      label: t("gradeWork.graded"),
      value: "graded",
      placement: "end",
      color: "primary",
    },
  ];
  const filterOptions = [
    {
      label: t("gradeWork.studentName"),
      value: "studentName",
      placement: "end",
      color: "primary",
    },
    {
      label: t("gradeWork.studentId"),
      value: "studentId",
      placement: "end",
      color: "primary",
    },
    {
      label: `${isTest ? t("gradeWork.test") : t("gradeWork.assignment")}`,
      value: "testName",
      placement: "end",
      color: "primary",
    },
  ];
  return (
    <Aux>
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.grades")}</Typography>
      <div className={classes.studentFilterContainer}>
        {filter === "studentName" && (
          <Autosuggest
            id="student-autocomplete"
            selectedOption={student}
            onOptionChange={handleSelectedName}
            options={searchNames}
            label={t("gradeWork.student")}
            width={300}
            margin={"0 0 22px 0"}
          />
        )}
        {filter === "testName" && (
          <Autosuggest
            id="test-autocomplete"
            selectedOption={test}
            onOptionChange={handleSelectedTest}
            options={isTest ? searchTests : searchAssignments}
            label={`${isTest ? t("gradeWork.test") : t("gradeWork.assignment")
              }`}
            width={300}
            margin={"0 0 22px 0"}
          />
        )}
        {filter === "studentId" && (
          <TextField
            fullWidth
            type="text"
            label={t("gradeWork.studentId")}
            input={{ value: studentId, onChange: handleSelectedStudentId }}
          />
        )}
      </div>
      <div className={classes.studentFilterContainer}>
        <RadioGroup
          title={t("gradeWork.searchBy")}
          options={filterOptions}
          input={{ value: filter, onChange: handleRadioButton }}
        />
        <RadioGroup
          title={
            isTest
              ? t("gradeWork.filterTests")
              : t("gradeWork.filterAssignments")
          }
          options={workFilterOptions}
          input={{ value: workFilter, onChange: handleRadioButtonWork }}
        />
      </div>
      <TableContainer>
        {testResults.map((result, index) => {
          const isDroppedOut = (course.studentsEnrollRequests || []).find(er => er.student._id === result.student._id && er.droppedOut)
          const isDeniedAccess = (course.studentsEnrollRequests || []).find(er => er.student._id === result.student._id && er.denied)
          const isApproved = (course.studentsEnrollRequests || []).find(er => er.student._id === result.student._id && er.approved)
          let status = "";
          if (isDroppedOut) {
            status = "Dropped out"
          }
          if (isDeniedAccess) {
            status = "Access denied"
          }
          if (!isApproved && !(isDroppedOut || isDeniedAccess)) return
          if (
            student !==
            `${result.student.firstName} ${result.student.lastName}` &&
            filter === "studentName"
          )
            return null;
          if (test !== result.test.testName && filter === "testName")
            return null;
          if (
            studentId.replace(/\D/g, "") !==
            result.student._id.replace(/\D/g, "") &&
            filter === "studentId"
          )
            return null;
          if (workFilter === "toReview" && (result.testResult || {}).graded)
            return null;
          if (workFilter === "graded" && !(result.testResult || {}).graded)
            return null;
          const isGraded = (result.testResult || {}).graded;
          const rows = [
            createData("", result.test.testName),
            createData(
              t("gradeWork.studentName"),
              `${result.student.firstName} ${result.student.lastName} ${!!status ? '- ' + status : ''}`
            ),
            result.test.gradeReleaseDate
              ? createData(
                t("gradeWork.gradeExpectedOn"),
                result.test.gradeReleaseDate
                  ? moment(parseInt(result.test.gradeReleaseDate))
                    .locale(localStorage.getItem("i18nextLng"))
                    .format("dddd, MMMM DD YYYY, HH:mm")
                  : ""
              )
              : null,
            createData(
              t("gradeWork.submittedOn"),
              (result.testResult || {}).submittedOn
                ? moment(parseInt((result.testResult || {}).submittedOn))
                  .locale(localStorage.getItem("i18nextLng"))
                  .format("dddd, MMMM DD YYYY, HH:mm")
                : ""
            ),
            //if the test is excused than status is excused
            //else if test is graded than status is graded
            //else status is grade pending
            createData(
              t("gradeWork.status"),
              (result.testResult || {}).isExcused ? t("gradeWork.buttons.excused") :
                (result.testResult || {}).graded ?
                  `${t("gradeWork.graded")} ${(result.testResult || {}).grade}%`
                  : t("gradeWork.gradePending")
            ),
          ];
          const isExcused = (result.testResult || {}).isExcused
          return (
            <Aux key={result.testResult._id}>
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  {rows.map((row, index) => {
                    let tableCellClass;
                    if (index === 0) tableCellClass = "WhiteText";
                    if (
                      index === 2 &&
                      parseInt(result.test.gradeReleaseDate) <
                      Date.now() + 86400000 &&
                      !isGraded
                    )
                      tableCellClass = "DangerText";
                    if (index === 4 && isGraded && !result.testResult.isExcused) tableCellClass = "SuccessText";
                    if (index === 4 && isGraded && result.testResult.isExcused) tableCellClass = "DangerText";
                    if (index === 4 && isExcused) tableCellClass = "DangerText"
                    if (!row) return;
                    return (
                      <TableRow
                        key={row.info + index}
                        className={index === 0 ? classes.MuiTableRowBlue : ""}
                      >
                        <TableCell
                          className={index === 0 ? classes.WhiteText : ""}
                          component="th"
                          scope="row"
                        >
                          {row.info}
                          {index === 0 && (
                            <Button
                              size="small"
                              className={!isApproved && isDarkTheme ? classes.MuiButtonDark : classes.MuiButton}
                              variant="outlined"
                              color="primary"
                              type="button"
                              title="Grade"
                              disabled={!!isDeniedAccess || !!isDroppedOut}
                              onClick={() => {
                                history.push(`/instructor-panel/course/${result.test.course}/grade-${result.test.assignment ? 'assignment': 'test'}s/student/${result.student._id}/${result.test.assignment ? 'assignment': 'test'}/${result.test._id}`);
                              }}
                            >
                              {(result.testResult || {}).graded ||
                                (result.testResult || {}).gradingInProgress
                                ? t("gradeWork.buttons.editGrade")
                                : t("gradeWork.buttons.grade")}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell
                          className={classes[tableCellClass]}
                          align="right"
                        >
                          {row.value}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>

                <Button
                  style={{ width: '40%' }}
                  disabled={!!isDeniedAccess || !!isDroppedOut}
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(
                      {
                        ...result.test,
                        student: result.student,
                      },
                      "resetTest"
                    );
                  }}
                >
                  {t("gradeWork.buttons.reset")}
                </Button>
                <Button
                  color="secondary"
                  style={{ width: '40%' }}
                  disabled={!!isDeniedAccess || !!isDroppedOut || !!result.testResult.isExcused}
                  onClick={() => {
                    const studentId = result.student._id;
                    const testId = result.test._id;
                    closeTest(
                      testId,
                      studentId,
                      token,
                      getInstructorTest(testId),
                      true,//to excuse test
                      history,
                    );
                  }}
                >
                  {result.testResult.isExcused ? t("gradeWork.buttons.excused") : t("gradeWork.buttons.excuse")}
                </Button>

              </div>
            </Aux>
          );
        })}
        {/* case for assignments or tests started but not completed in time seems to show work that is in progress */}
        {(isTest ? incompleteTests : incompleteAssignments).map((result) => {
          const isDroppedOut = (course.studentsEnrollRequests || []).find(er => er.student._id === result.student._id && er.droppedOut)
          const isDeniedAccess = (course.studentsEnrollRequests || []).find(er => er.student._id === result.student._id && er.denied)
          const isApproved = (course.studentsEnrollRequests || []).find(er => er.student._id === result.student._id && er.approved)
          let status = "";
          if (isDroppedOut) {
            status = "Dropped out"
          }
          if (isDeniedAccess) {
            status = "Access denied"
          }
          if (!isApproved && !(isDroppedOut || isDeniedAccess)) return
          const testFromResult = result.test || {};
          if (
            student !==
            `${result.student.firstName} ${result.student.lastName}` &&
            filter === "studentName"
          )
            return null;
          if (test !== testFromResult.testName && filter === "testName")
            return null;
          if (
            studentId.replace(/\D/g, "") !==
            result.student._id.replace(/\D/g, "") &&
            filter === "studentId"
          )
            return null;

          if (workFilter === "graded") return null;
          const rows = [
            createData("", testFromResult.testName),
            createData(
              t("gradeWork.student"),
              `${result.student.firstName} ${result.student.lastName} ${!!status ? '- ' + status : ''}`
            ),
            testFromResult.gradeReleaseDate
              ? createData(
                t("gradeWork.gradeExpectedOn"),
                testFromResult.gradeReleaseDate
                  ? moment(parseInt(testFromResult.gradeReleaseDate))
                    .locale(localStorage.getItem("i18nextLng"))
                    .format("dddd, MMMM DD YYYY, HH:mm")
                  : ""
              )
              : null,
            testFromResult.lastSavedOn
              ? createData(
                t("gradeWork.lastSavedOn"),
                (result.testResult || {}).lastSavedOn
                  ? moment(parseInt((result.testResult || {}).lastSavedOn))
                    .locale(localStorage.getItem("i18nextLng"))
                    .format("dddd, MMMM DD YYYY, HH:mm")
                  : ""
              )
              : null,
            createData(t("gradeWork.status"), t("gradeWork.inProgress")),
          ];
          return (
            <Aux key={result.testResult._id}>
              <Table
                key={result.testResult._id}
                className={classes.table}
                aria-label="simple table"
              >
                <TableBody>
                  {rows.map((row, index) => {
                    let tableCellClass;
                    if (index === 0) tableCellClass = "WhiteText";
                    if (index === 4) tableCellClass = "DangerText";
                    if (!row) return;
                    return (
                      <TableRow
                        key={row.info + index}
                        className={index === 0 ? classes.MuiTableRowBlue : ""}
                      >
                        <TableCell
                          className={index === 0 ? classes.WhiteText : ""}
                          component="th"
                          scope="row"
                        >
                          {row.info}
                          {index === 0 && (
                            <Button
                              disabled={!!isDeniedAccess || !!isDroppedOut}
                              size="small"
                              className={!isApproved && isDarkTheme ? classes.MuiButtonDark : classes.MuiButton}
                              variant="outlined"
                              color="primary"
                              type="button"
                              title="Grade"
                              onClick={() => {
                                const studentId = result.student._id;
                                const testId = testFromResult._id;
                                closeTest(
                                  testId,
                                  studentId,
                                  token,
                                  getInstructorTest(testId),
                                  false,
                                  history,
                                );
                              }}
                            >
                              {t("gradeWork.buttons.closeAndGrade")}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell
                          className={classes[tableCellClass]}
                          align="right"
                        >
                          {row.value}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>

                <Button
                  disabled={!!isDeniedAccess || !!isDroppedOut}
                  color="secondary"
                  style={{ width: '40%' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(
                      {
                        ...result.test,
                        student: result.student,
                      },
                      "resetTest"
                    );
                  }}
                >
                  {t("gradeWork.buttons.reset")}
                </Button>
                <Button
                  color="secondary"
                  style={{ width: '40%' }}
                  disabled={!!result.testResult.isExcused || !!isDeniedAccess || !!isDroppedOut}
                  onClick={() => {
                    const studentId = result.student._id;
                    const testId = result.test._id;
                    closeTest(
                      testId,
                      studentId,
                      token,
                      getInstructorTest(testId),
                      true,//to excuse test
                      history,
                    );
                  }}
                >
                  {result.testResult.isExcused ? t("gradeWork.buttons.excused") : t("gradeWork.buttons.excuse")}
                </Button>

              </div>

            </Aux>
          );
        })}
        {/* case for tests or assignments passed due and not attempted */}
        {(isTest ? missedTests : missedAssignments).map((result) => {
          const isDroppedOut = (course.studentsEnrollRequests || []).find(er => er.student._id === result.student._id && er.droppedOut)
          const isDeniedAccess = (course.studentsEnrollRequests || []).find(er => er.student._id === result.student._id && er.denied)
          const isApproved = (course.studentsEnrollRequests || []).find(er => er.student._id === result.student._id && er.approved)
          let status = "";
          if (isDroppedOut) {
            status = "Dropped out"
          }
          if (isDeniedAccess) {
            status = "Access denied"
          }
          if (!isApproved && !(isDroppedOut || isDeniedAccess)) return
          if (
            student !==
            `${result.student.firstName} ${result.student.lastName}` &&
            filter === "studentName"
          )
            return null;
          if (test !== result.test.testName && filter === "testName")
            return null;
          if (
            studentId.replace(/\D/g, "") !==
            result.student._id.replace(/\D/g, "") &&
            filter === "studentId"
          )
            return null;
          if (workFilter === "graded") return null;
          const rows = [
            createData("", result.test.testName),
            createData(
              t("gradeWork.student"),
              `${result.student.firstName} ${result.student.lastName} ${!!status ? '- ' + status : ''}`
            ),
            result.test.gradeReleaseDate
              ? createData(
                t("gradeWork.gradeExpectedOn"),
                result.test.gradeReleaseDate
                  ? moment(parseInt(result.test.gradeReleaseDate))
                    .locale(localStorage.getItem("i18nextLng"))
                    .format("dddd, MMMM DD YYYY, HH:mm")
                  : ""
              )
              : null,
            createData(t("gradeWork.status"), t("gradeWork.missed")),
          ];
          return (
            <Aux key={`${result.student.firstName}[${result.test._id}]`}>
              <Table
                className={classes.table}
                aria-label="simple table"
              >
                <TableBody>
                  {rows.map((row, index) => {
                    let tableRowClass;
                    if (index === 0) tableRowClass = "MuiTableRowBlue";
                    // if(index === 3 ) tableRowClass = 'MuiTableRowDanger'
                    let tableCellClass;
                    if (index === 0) tableCellClass = "WhiteText";
                    if (index === 3) tableCellClass = "DangerText";
                    if (!row) return;
                    return (
                      <TableRow
                        key={row.info + index}
                        className={classes[tableRowClass]}
                      >
                        <TableCell
                          className={index === 0 ? classes.WhiteText : ""}
                          component="th"
                          scope="row"
                        >
                          {row.info}
                          {index === 0 && (
                            <Aux>
                              <Button
                                size="small"
                                disabled={!!isDeniedAccess || !!isDroppedOut}
                                className={!isApproved && isDarkTheme ? classes.MuiButtonDark : classes.MuiButton}
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  const studentId = result.student._id;
                                  const testId = result.test._id;
                                  closeTest(
                                    testId,
                                    studentId,
                                    token,
                                    getInstructorTest(testId),
                                    false,
                                    history,
                                  );
                                }}
                              >
                                {t("gradeWork.buttons.closeAndGrade")}
                              </Button>
                            </Aux>
                          )}
                        </TableCell>
                        <TableCell
                          className={classes[tableCellClass]}
                          align="right"
                        >
                          {row.value}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                  disabled={!!isDeniedAccess || !!isDroppedOut || !!(result.testResult || {}).isExcused}
                  color="secondary"
                  style={{ width: '40%' }}
                  // disabled={result.testResult.isExcused}
                  onClick={() => {
                    const studentId = result.student._id;
                    const testId = result.test._id;
                    closeTest(
                      testId,
                      studentId,
                      token,
                      getInstructorTest(testId),
                      true,//to excuse test
                      history,
                    );
                  }}
                >
                  {
                    t("gradeWork.buttons.excuse")
                  }
                </Button>
              </div>
            </Aux>
          );
        })}

        {/* case for tests or assignments that do not have a test result (not yet attempted) */}
        {(students || []).map((st) => {
          const isDroppedOut = (course.studentsEnrollRequests || []).find(er => er.student._id === st._id && er.droppedOut)
          const isDeniedAccess = (course.studentsEnrollRequests || []).find(er => er.student._id === st._id && er.denied)
          const isApproved = (course.studentsEnrollRequests || []).find(er => er.student._id === st._id && er.approved)
          let status = "";
          if (isDroppedOut) {
            status = "Dropped out"
          }
          if (isDeniedAccess) {
            status = "Access denied"
          }
          if (!isApproved && !(isDroppedOut || isDeniedAccess)) return
          const publishedTests = course.tests.filter(t => t.published)
          return <Aux key={st._id}>
            {

              publishedTests.map(te => {
                //if a test result exists it means the test was attempted so omit this result
                const isTestResult = !!st.testResults.find(re => re.student === st._id && re.test === te._id)
                if (isTestResult) return null;
                //do not repeat tests from other tables
                const isMissedTest = missedTests.find(r => r.test._id === te._id);
                const isMissedAssignment = missedAssignments.find(r => r.test._id === te._id)
                const isIncompleteTest = incompleteTests.find(r => r.test._id === te._id);
                const isIncompleteAssignment = incompleteAssignments.find(r => r.test._id === te._id);
                if (isTest && te.assignment) return;
                if (!isTest && !te.assignment) return;
                if (isMissedTest || isMissedAssignment || isIncompleteTest || isIncompleteAssignment) return;
                if (
                  student !==
                  `${st.firstName} ${st.lastName}` &&
                  filter === "studentName"
                )
                  return null;
                if (test !== te.testName && filter === "testName")
                  return null;
                if (
                  studentId.replace(/\D/g, "") !==
                  st._id.replace(/\D/g, "") &&
                  filter === "studentId"
                )
                  return null;

                if (workFilter !== "all") return null;
                const rows = [
                  createData("", te.testName),
                  createData(
                    t("gradeWork.student"),
                    `${st.firstName} ${st.lastName} ${!!status ? '- ' + status : ''}`
                  ),
                  te.gradeReleaseDate
                    ? createData(
                      t("gradeWork.gradeExpectedOn"),
                      te.gradeReleaseDate
                        ? moment(parseInt(te.gradeReleaseDate))
                          .locale(localStorage.getItem("i18nextLng"))
                          .format("dddd, MMMM DD YYYY, HH:mm")
                        : ""
                    )
                    : null,
                  createData(t("gradeWork.status"), t("gradeWork.notAttempted")),
                ];
                return (
                  <Aux key={`${st.firstName}[${te._id}]`}>
                    <Table

                      className={classes.table}
                      aria-label="simple table"
                    >
                      <TableBody>
                        {rows.map((row, index) => {

                          let tableRowClass;
                          if (index === 0) tableRowClass = "MuiTableRowBlue";
                          // if(index === 3 ) tableRowClass = 'MuiTableRowDanger'
                          let tableCellClass;
                          if (index === 0) tableCellClass = "WhiteText";
                          // if (index === 3) tableCellClass = "DangerText";
                          if (!row) return;
                          return (
                            <TableRow
                              key={row.info + index}
                              className={classes[tableRowClass]}
                            >
                              <TableCell
                                className={index === 0 ? classes.WhiteText : ""}
                                component="th"
                                scope="row"
                              >
                                {row.info}
                              </TableCell>
                              <TableCell
                                className={classes[tableCellClass]}
                                align="right"
                              >
                                {row.value}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                      <Button
                        disabled={!!isDeniedAccess || !!isDroppedOut}
                        color="secondary"
                        style={{ width: '40%' }}
                        // disabled={result.testResult.isExcused}
                        onClick={() => {
                          const studentId = st._id;
                          const testId = te._id;
                          closeTest(
                            testId,
                            studentId,
                            token,
                            getInstructorTest(testId),
                            true,//to excuse test
                            history,
                          );
                        }}
                      >
                        {
                          // result.testResult.isExcused ? t("gradeWork.buttons.excused") : 
                          t("gradeWork.buttons.excuse")
                        }
                      </Button>

                    </div>
                  </Aux>
                );
              })
            }


          </Aux>


        })}
      </TableContainer>
    </Aux>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTestToGrade: (testId, student) =>
      dispatch(actions.setTestToGrade(testId, student)),
    setInitialGradeValues: (gradeValues) =>
      dispatch(actions.setInitialGradeValues(gradeValues)),
    closeTest: (testId, studentId, token, test, isExcused, history) => {
      dispatch(actions.closeTestStart(testId, studentId, token, test, isExcused,history));
    },
    openModal: (document, type) => dispatch(actions.openModal(document, type)),
  };
};

const mapStateToProps = (state) => {
  const course = state.common.selectedCourse;
  const courses = state.common.courses;
  const populatedCourse = getCourse(courses, course)
  //need to get students from course.studentEnrollRequests to account
  //for students who have dropped the course
  const students = [];
  if (populatedCourse) {
    (populatedCourse.studentsEnrollRequests || []).forEach(re => students.push(re.student));
  }
  return {
    token: state.authentication.token,
    selectedTest: state.instructorTest.selectedTest,
    testGrading: state.instructorTest.testGrading,
    course: populatedCourse,
    students,
    initialGradeValues: state.instructorTest.initialGradeValues,
    isDarkTheme: state.common.isDarkTheme,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GradeDetail);
