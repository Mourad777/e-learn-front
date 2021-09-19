import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import classes from "./GradeTestForm.module.css";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { useTranslation } from "react-i18next";

const Summary = ({
  onGetRowSectionMarks,
  onGetFinalGradeRow,
  formValues,
  test,
  isTest,
}) => {
  const { t } = useTranslation();
  return (
    <Aux>
      <Typography variant="h5" gutterBottom>
        {t("gradeTestForm.summary")}
      </Typography>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {onGetRowSectionMarks(test).map((row, index) => {
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
                    `gradeTestForm.${(row.info || "")
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
      {!(formValues || {}).gradeOverride && (
        <Aux>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {onGetFinalGradeRow(test).map((row, index) => {
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
                      <Typography variant="body1" gutterBottom>
                        <span>
                          {t(
                            `gradeTestForm.${(row.info || "")
                              .replace(" ", "")
                              .replace("-", "")
                              .toLowerCase()}`
                          )}
                        </span>
                        {(test || {}).passingGrade && (
                          <Aux>
                            {parseFloat(row.value) >=
                            (test || {}).passingGrade ? (
                              <span style={{ color: "#4caf50", marginLeft: 5 }}>
                                {t("gradeTestForm.passed")}
                              </span>
                            ) : (
                              <span style={{ color: "red", marginLeft: 5 }}>
                                {t("gradeTestForm.failed")}
                              </span>
                            )}
                          </Aux>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell
                      className={index === 0 ? classes.MuiTableCell : ""}
                      align="right"
                    >
                      <Typography variant="body1" gutterBottom>
                        {parseFloat(parseFloat(row.value || 0).toFixed(2))}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Typography variant="caption" gutterBottom>
            {isTest
              ? t("gradeTestForm.gradeAdjustedForWeights")
              : t("gradeTestForm.gradeAdjustedForWeightsAndLatePenalty")}
          </Typography>
        </Aux>
      )}
    </Aux>
  );
};

export default Summary;
