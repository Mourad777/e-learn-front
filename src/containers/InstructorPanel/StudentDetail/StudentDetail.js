import React from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { Avatar, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";

const handleStudent = (student, type, course, history) => {
  console.log('1 history',history)
  if (type === 'processEnrollmentRequest') {
    history.push(`/instructor-panel/course/${course}/students/requested/${student._id}`)
  } else {
    history.push(`/instructor-panel/course/${course}/students/enrolled/${student._id}`)
  }
};


const StudentDetail = ({ enrollmentRequests, course, courses, history }) => {

  const populatedCourse = getCourse(courses, course)
  const studentRequests = populatedCourse.studentsEnrollRequests || []
  const pendingRequests =
    studentRequests.filter(
      (r) => !r.approved && !r.denied && !r.droppedOut
    ) || [];

  const deniedRequests =
    studentRequests.filter((r) => r.denied) || [];
  const studentsEnrolled =
    studentRequests.filter((r) => r.approved) || [];
  const studentsDroppedOut =
    studentRequests.filter((r) => r.droppedOut) || [];

  const { t } = useTranslation();

  return enrollmentRequests ? (
    <Aux>
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.students")}</Typography>
      {pendingRequests.length > 0 && (
        <Typography paragraph variant="h6" gutterBottom>
          {t("students.pendingRequests")}
        </Typography>
      )}
      <List>
        {pendingRequests.map((request, index) => (
          <ListItem
            button
            key={request.student._id}
            onClick={() =>
              handleStudent(request.student, "processEnrollmentRequest",course, history)
            }
          >
            {" "}
            <Avatar src={request.student.profilePicture} />
            {`${request.student.firstName} ${request.student.lastName}`}
          </ListItem>
        ))}
      </List>
      {deniedRequests.length > 0 && (
        <Typography paragraph variant="h6" gutterBottom>
          {t("students.requestsDenied")}
        </Typography>
      )}

      <List>
        {deniedRequests.map((request) => {
          // if(studentsEnrollmentRequested.findIndex(s=>s._id === student._id) > -1) return null;
          return (
            <ListItem
              button
              key={request.student._id}
              onClick={() => handleStudent(request.student,"userSummary", course, history)}
            >
              {" "}
              <Avatar src={request.student.profilePicture} />
              <ListItemText
                style={{ marginLeft: "5px" }}
                primary={`${request.student.firstName} ${request.student.lastName}`}
              />
              {request.resubmissionAllowed && (
                <Typography
                  style={{ marginLeft: "10px" }}
                  variant="caption"
                  color="primary"
                >
                  {t("students.resubmissionAllowed")}
                </Typography>
              )}
            </ListItem>
          );
        })}
      </List>
    </Aux>
  ) : (
    <Aux>
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.students")}</Typography>
      <List>
        {[...(studentsEnrolled || []), ...(studentsDroppedOut || [])].map(
          (request, i) => {
            const isDroppedOut =
              (studentsDroppedOut || []).findIndex(
                (r) => r.student._id === request.student._id
              ) > -1;
            return (
              <div
                key={`${request.student._id}[${request.droppedOut ? "dropped" : "enrolled"
                  }]`}
                style={{ display: 'flex' }}
              >
                <ListItem
                  button
                  onClick={() =>
                    handleStudent(request.student,"userSummary", course, history)
                  }
                >
                  {" "}
                  <Avatar src={request.student.profilePicture} />
                  <ListItemText
                    style={{ marginLeft: "5px" }}
                    primary={`${request.student.firstName} ${request.student.lastName}`}
                  />
                  {isDroppedOut && (
                    <Typography
                      style={{ marginLeft: 10, marginRight: 10 }}
                      variant="caption"
                      color="error"
                    >
                      {t("students.droppedOut")}
                    </Typography>
                  )}

                </ListItem>
                <Button
                  style={{ minWidth: 90, maxHeight: 36 }}
                  // disabled={request.droppedOut}
                  color="primary"
                  onClick={(e) => history.push(`/instructor-panel/course/${course}/students/gradebook/${request.student._id}`)}
                >
                  {t("students.buttons.gradebook")}
                </Button>
              </div>
            );
          }
        )}
      </List>
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (document, type) => dispatch(actions.openModal(document, type)),
  };
};

const mapStateToProps = (state) => {
  return {
    courses: state.common.courses,
    course: state.common.selectedCourse,
    students: state.common.students,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetail);
