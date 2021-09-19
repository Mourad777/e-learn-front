import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import classes from "./CourseSyllabus.module.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import moment from "moment";
import DOMPurify from "dompurify";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { withTranslation } from "react-i18next";
import momentTZ from "moment-timezone";

class Syllabus extends Component {
  render() {
    const { modalDocument: course, configuration, t, isDarkTheme, isEnrollmentForm } = this.props;
    const boxStyle = {
      backgroundColor: isDarkTheme ? "" : "white",
      padding: 10,
      margin: "10px auto 10px auto",
    };
    const areImportantDates =
      course.courseStartDate ||
      course.courseEndDate ||
      course.courseDropDeadline ||
      course.enrollmentStartDate ||
      course.enrollmentEndDate;
    const courseDropGrade = configuration.dropCourseGrade;
    const courseInfo = [
      !isEnrollmentForm ? [t("syllabus.courseName"), course.courseName] : null,
      course.language
        ? [
          t("syllabus.language"),
          t(`languages.${course.language.toLowerCase()}`),
        ]
        : null,
      [
        t("syllabus.instructor"),
        `${course.courseInstructor.firstName} ${course.courseInstructor.lastName}`,
      ],
      [t("syllabus.instructorEmail"), course.courseInstructor.email],
      [t("syllabus.coursePassGrade"), `${configuration.coursePassGrade}%`],
      configuration.isDropCoursePenalty
        ? [t("syllabus.gradeIfCourseDropped"), `${courseDropGrade}%`]
        : null,
      course.cost ? [t("syllabus.cost"), `${course.cost} USD`] : null
    ].filter((i) => i);

    const importantDatesRows = [
      course.enrollmentStartDate
        ? [
          t("syllabus.enrollmentStart"),
          ` ${moment(parseInt(course.enrollmentStartDate))
            .locale(localStorage.getItem("i18nextLng"))
            .format("MMMM DD YYYY, HH:mm")}`,
        ]
        : null,
      course.enrollmentEndDate
        ? [
          t("syllabus.enrollmentDeadline"),
          ` ${moment(parseInt(course.enrollmentEndDate))
            .locale(localStorage.getItem("i18nextLng"))
            .format("MMMM DD YYYY, HH:mm")}`,
        ]
        : null,
      course.courseStartDate
        ? [
          t("syllabus.courseStartDate"),
          ` ${moment(parseInt(course.courseStartDate))
            .locale(localStorage.getItem("i18nextLng"))
            .format("MMMM DD YYYY, HH:mm")}`,
        ]
        : null,
      course.courseEndDate
        ? [
          t("syllabus.courseEndDate"),
          ` ${moment(parseInt(course.courseEndDate))
            .locale(localStorage.getItem("i18nextLng"))
            .format("MMMM DD YYYY, HH:mm")}`,
        ]
        : null,
      course.courseDropDeadline
        ? [
          t("syllabus.dropDeadline"),
          ` ${moment(parseInt(course.courseDropDeadline))
            .locale(localStorage.getItem("i18nextLng"))
            .format("MMMM DD YYYY, HH:mm")}`,
        ]
        : null,
    ].filter((i) => i);
    const areOfficeHours = !(
      (course.regularOfficeHours || []).length === 0 &&
      (course.irregularOfficeHours || []).length === 0
    );
    return (
      <Aux>
        <div style={boxStyle}>
          <Typography variant="h6">{t("syllabus.courseInfo")}</Typography>
          <Table aria-label="simple table">
            <TableBody>
              {courseInfo.map((r, i) => (
                <TableRow key={r[0]}>
                  <TableCell scope="row">{r[0]}</TableCell>
                  <TableCell align="right">{r[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div
          className={classes.Contained}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(course.syllabus),
          }}
        />

        {areImportantDates && (
          <div style={boxStyle}>
            <Typography variant="h6">{t("syllabus.importantDates")}</Typography>
            <Table aria-label="simple table">
              <TableBody>
                {importantDatesRows.map((r, i) => (
                  <TableRow key={r[0]}>
                    <TableCell scope="row">{r[0]}</TableCell>
                    <TableCell align="right">{r[1]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {(course.prerequisites || []).length > 0 && (
          <Typography variant="h6">{t("syllabus.coursePrereqs")}</Typography>
        )}
        <div style={boxStyle}>
          {(course.prerequisites || []).length === 0 ? (
            <Typography gutterBottom variant="h6">
              {t("syllabus.noCoursePrereqs")}
            </Typography>
          ) : (
            <List>
              {(course.prerequisites || []).map((course) => (
                <ListItem key={(course || "")._id}>
                  {(course || "").courseName}
                </ListItem>
              ))}
            </List>
          )}
        </div>
        {/* {!configuration.isChatAllowedOutsideOfficehours && ( */}
        <div style={boxStyle}>
          {!areOfficeHours ? (
            <Typography paragraph variant="h6">
              {t("syllabus.noOfficeHours")}
            </Typography>
          ) : (
            <Aux>
              {(course.regularOfficeHours || []).length > 0 && (
                <Typography gutterBottom variant="h6">
                  {t("syllabus.weeklyOfficehours")}
                </Typography>
              )}

              <Table aria-label="simple table">
                <TableBody>
                  {(course.regularOfficeHours || []).map((item, i) => (
                    <TableRow key={item.day}>
                      <TableCell scope="row">
                        {t(`courseForm.days.${item.day.toLowerCase()}`)}
                      </TableCell>
                      <TableCell align="right">{`${t("syllabus.from")} ${item.startTime
                        } ${t("syllabus.to")} ${item.endTime} ${momentTZ(new Date(Date.now())).tz(item.timezoneRegion).format('z')}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {(course.irregularOfficeHours || []).length > 0 && (
                <Typography gutterBottom variant="h6">
                  {t("syllabus.otherOfficehours")}
                </Typography>
              )}

              <Table aria-label="simple table">
                <TableBody>
                  {(course.irregularOfficeHours || []).map((item, i) => (
                    <TableRow key={item.date}>
                      <TableCell scope="row">{`${moment(parseInt(item.date))
                        .locale(localStorage.getItem("i18nextLng"))
                        .format("MMMM DD YYYY")} `}</TableCell>
                      <TableCell align="right">{`${t("syllabus.from")} ${item.startTime
                        } ${t("syllabus.to")} ${item.endTime} ${momentTZ(new Date(Date.now())).tz(item.timezoneRegion).format('z')}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Typography paragraph variant="subtitle1">
                {t("syllabus.askQuestionsViaChat")}
              </Typography>
            </Aux>
          )}
        </div>

      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modalDocument: state.common.modalDocument,
    courses: state.common.courses,
    isDarkTheme: state.common.isDarkTheme,
    configuration: state.common.configuration,
  };
};

export default connect(mapStateToProps)(withTranslation("common")(Syllabus));
