import React from "react";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import classes from "../GradeTestForm.module.css";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import moment from "moment";
import { useTranslation } from "react-i18next";
import MultiLineField from "../../../../components/UI/FormElements/MultiLineField/MultiLineField";
import { OutlinedInput } from "@material-ui/core";
import { getCourse } from "../../../../utility/getCourse";

const TestInfo = ({ test, student, startTest, course, isDarkTheme }) => {
  const { t } = useTranslation();
  const currWeight = parseFloat(test.weight);
  const totalWeight = ((course||{}).tests||[]).reduce(
    (prev, curr) => prev + curr.weight,
    0
  );

  const percentWeight = parseFloat(
    ((currWeight / totalWeight) * 100).toFixed(2)
  );

  const isTest = !test.assignment;
  const rowValues = [
    student
      ? [t("testInfo.student"), `${student.firstName} ${student.lastName}`]
      : null,
    student
      ? [t("testInfo.studentId"), `${(student._id || "").replace(/\D/g, "")}`]
      : null,
    [isTest ? t("testInfo.test") : t("testInfo.assignment"), test.testName],
    [t("testInfo.weight"), `${Number.isNaN(percentWeight) ? 0 : percentWeight}%`],
    isTest
      ? [
          t("testInfo.lessonsAllowed"),
          !test.blockedNotes ? t("testInfo.yes") : t("testInfo.no"),
        ]
      : null,
    isTest
      ? [
          t("testInfo.timer"),
          test.timer
            ? `${test.timer} ${
                test.timer == 1
                  ? t("testInfo.minute")
                  : t("testInfo.plural.minute")
              }`
            : t("testInfo.no"),
        ]
      : null,
    isTest ? [t("testInfo.type"), t(`testInfo.${test.testType}`)] : null,
    isTest
      ? [
          t("testInfo.passingRequired"),
          test.passingRequired ? t("testInfo.yes") : t("testInfo.no"),
        ]
      : null,
    test.passingGrade
      ? [t("testInfo.passingGrade"), `${test.passingGrade}%`]
      : null,
    !isTest
      ? [
          t("testInfo.lateSubmissionAllowed"),
          test.allowLateSubmission ? t("testInfo.yes") : t("testInfo.no"),
        ]
      : null,
    !isTest && test.allowLateSubmission
      ? [t("testInfo.dailyPenalty"), `${test.latePenalty}%`]
      : null,
    !isTest && test.allowLateSubmission
      ? [t("testInfo.maxLateDaysAllowed"), test.lateDaysAllowed]
      : null,
    test.availableOnDate
    //  && !startTest
      ? [
          t("testInfo.availableOnDate"),
          moment(parseInt(test.availableOnDate))
            .locale(localStorage.getItem("i18nextLng"))
            .format("dddd, MMMM DD YYYY, HH:mm"),
        ]
      : null,

    test.dueDate
      ? [
          !isTest ? t("testInfo.dueDate") : t("testInfo.closeDate"),
          moment(parseInt(test.dueDate))
            .locale(localStorage.getItem("i18nextLng"))
            .format("dddd, MMMM DD YYYY, HH:mm"),
        ]
      : null,
    test.gradeReleaseDate
      ? [
          t("testInfo.gradeReleaseDate"),
          moment(parseInt(test.gradeReleaseDate))
            .locale(localStorage.getItem("i18nextLng"))
            .format("dddd, MMMM DD YYYY, HH:mm"),
        ]
      : null,
  ].filter((i) => i);

  const boxStyle = {
    backgroundColor:isDarkTheme ?  "#424242" : "white",
    padding: "5px",
    borderRadius: "4px",
  };
  return (
    <div style={boxStyle}>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {rowValues.map((r, i) => (
            <TableRow key={i} className={classes.MuiTableRow}>
              <TableCell component="th" scope="row">
                {r[0]}
              </TableCell>
              <TableCell align="right">{r[1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {test.notes && (
        <MultiLineField
          label={t("testForm.fields.notes")}
          input={{value:test.notes}}
          options={{
            multiline: true,
            rows: 3,
            variant: OutlinedInput,
            readOnly:true,
          }}
          textLabel
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const populatedCourse = getCourse(state.common.courses,state.common.selectedCourse);
  return {
    course:populatedCourse,
    isDarkTheme: state.common.isDarkTheme,
  };
};

export default connect(mapStateToProps)(TestInfo);
