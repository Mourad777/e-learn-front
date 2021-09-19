import React from "react";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import classes from "./ReviewTest.module.css";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { Field } from "redux-form";
import { OutlinedInput } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const getTotalMarks = (section, testReviewing) => {
  const instructorTest = (testReviewing || {}).instructorTest;
  if (section === "mcSection")
    return ((instructorTest || {}).multipleChoiceQuestions || []).reduce(
      (a, b) => a + b.marks,
      0
    );
  if (section === "essay")
    return ((instructorTest || {}).essayQuestions || []).reduce(
      (a, b) => a + b.marks,
      0
    );
  if (section === "speaking")
    return ((instructorTest || {}).speakingQuestions || []).reduce(
      (a, b) => a + b.marks,
      0
    );
  if (section === "fillInBlanks")
    return (
      ((instructorTest || {}).fillInBlanksQuestions || {}).blanks || []
    ).reduce((a, b) => a + b.marks, 0);
};

const getStudentMarks = (section, testReviewing) => {
  const testResult = (testReviewing || {}).testResult;
  if (section === "mcSection")
    return (
      ((testResult || {}).multiplechoiceSection || []).answers || []
    ).reduce((a, b) => a + b.marks, 0);
  if (section === "essay")
    return (((testResult || {}).essaySection || []).answers || []).reduce(
      (a, b) => a + b.marks,
      0
    );
  if (section === "speaking")
    return (((testResult || {}).speakingSection || []).answers || []).reduce(
      (a, b) => a + b.marks,
      0
    );
  if (section === "fillInBlanks")
    return (
      ((testResult || {}).fillInBlanksSection || {}).answers || []
    ).reduce((a, b) => a + b.marks, 0);
};

function createData(info, value) {
  return { info, value };
}
const getRowSectionsMarks = (testReviewing) => {
  const sections = [
    "Multiple-choice section",
    "Essay section",
    "Speaking section",
    "Fill-in-the-blanks section",
  ];
  const camelCaseSections = ["mcSection", "essay", "speaking", "fillInBlanks"];
  const rowsSectionsMarks = camelCaseSections.map((section, index) => {
    const marks =
      parseFloat(getTotalMarks(section, testReviewing).toFixed(2)) > 0
        ? createData(
          sections[index],
          `${parseFloat(
            getStudentMarks(section, testReviewing).toFixed(2)
          )} / ${parseFloat(
            getTotalMarks(section, testReviewing).toFixed(2)
          )}`
        )
        : null;
    return marks;
  });
  return rowsSectionsMarks;
};

const getFinalGradeRow = (testResult, test) => {
  const finalGradeRow = [
    createData(
      test ? "Test Grade" : "Assignment Grade",
      `${testResult.grade}%`
    ),
  ];
  return finalGradeRow;
};

const Summary = ({ instructorTest, test, testResult = {}, testReviewing, isDarkTheme }) => {
  const { t } = useTranslation();
  return (
    <div className={isDarkTheme ? classes.SummaryContainerDark : classes.SummaryContainer}>
      <Typography variant="h5" gutterBottom>
        {t("testReview.summary")}
      </Typography>
      {!!(testResult || {}).latePenalty && (
        <Typography className={classes.RedText} variant="h6" gutterBottom>
          {`${t("testReview.latePenalty")}: ${(testResult || {}).latePenalty}%`}
        </Typography>
      )}
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {getRowSectionsMarks(testReviewing).map((row, index) => {
            if (!row) return null;
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
                  {t(
                    `testReview.${(row.info || "")
                      .replace(/ /g, "")
                      .replace(/-/g, "")
                      .toLowerCase()}`
                  )}
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
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {getFinalGradeRow(testResult, test).map((row, index) => {
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
                  <span>
                    {t(
                      `testReview.${(row.info || "")
                        .replace(/ /g, "")
                        .toLowerCase()}`
                    )}
                  </span>{" "}
                  {instructorTest.passingGrade && (
                    <Aux>
                      {parseFloat(row.value) >=
                        (instructorTest || {}).passingGrade ? (
                          <span style={{ color: "#4caf50", marginLeft: 5 }}>
                            {t("testReview.passed")}
                          </span>
                        ) : (
                          <span style={{ color: "red", marginLeft: 5 }}>
                            {t("testReview.failed")}
                          </span>
                        )}
                    </Aux>
                  )}
                </TableCell>
                <TableCell
                  className={index === 0 ? classes.MuiTableCell : ""}
                  align="right"
                >
                  <Typography variant="body1" gutterBottom>
                    {row.value}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Typography variant="caption" gutterBottom>
        {!instructorTest.assignment
          ? t("testReview.gradeAdjustedForWeights")
          : t("testReview.gradeAdjustedForWeightsAndLatePenalty")}
      </Typography>
      {(testResult || {}).gradeOverride && (
        <Aux>
          <Typography
            className={classes.RedText}
            variant="subtitle1"
            gutterBottom
          >
            {t("testReview.instructorAdjustedGrade")}
          </Typography>
          {(testResult || {}).gradeAdjustmentExplanation && (
            <Aux>
              <Typography variant="body1">
                {t("testReview.gradeAdjustmentExplanation")}
              </Typography>
              <Field
                name="testResult.gradeAdjustmentExplanation"
                component={MultiLineField}
                options={{
                  multiline: true,
                  rows: 2,
                  variant: OutlinedInput,
                  readOnly: true,
                }}
              />
            </Aux>
          )}
        </Aux>
      )}
    </div>
  );
};

export default Summary;
