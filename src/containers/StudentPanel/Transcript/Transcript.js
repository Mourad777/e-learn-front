import React from 'react'
import { connect } from 'react-redux'
import { useTranslation } from "react-i18next";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Aux from "../../../hoc/Auxiliary/Auxiliary"
import Typography from "@material-ui/core/Typography";

const getGPA = (courses) => {
    const numberOfCoursesGraded = courses.filter(c => c.grade).length
    const gpa = courses.reduce((prev, curr) => {
        if (curr.grade) {
            return curr.grade + prev
        }
        return prev
    }, 0)
    const isAtleastOneGradedCourse = courses.findIndex(c => c.grade) > -1;
    if (!isAtleastOneGradedCourse) return 'N/A'
    return `${gpa / numberOfCoursesGraded}%`
}

const Transcript = ({ courses, isDarkTheme, configuration, studentLoggedIn }) => {
    const { t } = useTranslation("common")
    const boxStyle = {
        backgroundColor: isDarkTheme ? "#424242" : "white",
        padding: 10,
        margin: "10px auto 10px auto",
    };
    const transcriptCourses = (courses || []).filter(c => c.enrolled || (c.droppedOut && parseInt(c.courseDropDeadline) < Date.now() && configuration.isEnrollAllowedAfterDropCourse));
    return (
        <Aux>
            <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.transcript")}</Typography>
            <div style={boxStyle}>
                <Table aria-label="simple table">
                    <TableBody>
                        {transcriptCourses.map((c) => {
                            return (
                                <TableRow key={c._id}>
                                    <TableCell component="td" scope="row">
                                        {c.courseName}
                                    </TableCell>
                                    <TableCell align="right">{c.grade ? c.grade + '%' : t("transcript.gradePending")}</TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell component="tf" scope="row">
                                <span style={{ fontWeight: 'bold' }} > {t("transcript.gpa")}</span>
                            </TableCell>
                            <TableCell align="right"> <span style={{ fontWeight: 'bold' }} > {getGPA(transcriptCourses)}</span></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </Aux>
    )
}

const mapStateToProps = (state) => {
    return {
        courses: state.common.courses,
        configuration: state.common.configuration,
        isDarkTheme: state.common.isDarkTheme,
        studentLoggedIn: state.authentication.studentLoggedIn,
    }
}

export default connect(mapStateToProps)(Transcript)