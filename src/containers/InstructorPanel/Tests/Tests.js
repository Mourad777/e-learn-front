import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";
import { useHistory } from "react-router-dom";
import StyledBadge from "../../Common/Chat/StyledBadge";

const Tests = ({
  course,
  courses,
  token,
  openModal,
  isTest,
  isAssignment,
  fetchQuestionBank,
  isLesson
}) => {
  const history = useHistory();
  const students = []
  const populatedCourse = getCourse(courses, course);
  (populatedCourse.studentsEnrollRequests || []).forEach(re => students.push(re.student));
  const { t } = useTranslation()
  const [warning, setWarning] = useState(-1);
  const [timeoutIds, setTimeoutIds] = useState([]);
  const testsAttempted = [];
  (students || []).forEach((s) => {
    s.testResults.forEach((r) => {
      testsAttempted.push(r.test);
    });
  });

  useEffect(() => {
    fetchQuestionBank(course, token)
  }, [])

  useEffect(() => {
    return () => {
      timeoutIds.forEach((tId) => {
        clearTimeout(tId);
      });
    };
  }, [timeoutIds]);

  const handleEdit = (e, item, index) => {
    e.stopPropagation();
    if (testsAttempted.includes(item._id)) {
      setWarning(index);
      const toId = setTimeout(() => {
        setWarning(-1);
        clearTimeout(toId);
      }, 3000);
      setTimeoutIds([...timeoutIds, toId]);
      return;
    }
    history.push(`/instructor-panel/course/${course}/${isTest ? 'test' : 'assignment'}/${item._id}/edit`)
  };

  return (
    <Aux>
      <Typography align="center" variant="h4" gutterBottom>{t(`layout.drawer.${isTest ? "tests" : "assignments"}`)}</Typography>
      <List>
        {(populatedCourse.tests || []).map((item, index) => {
          if (item.assignment && isTest) return null;
          if (!item.assignment && isAssignment) return null;
          return (
            <Aux key={item._id}>
              <ListItem
                dense
                button
                onClick={() => {
                  openModal(item, "testSummary");
                }}
              >
                {(item.published) && (
                  <div style={{ position: 'absolute', left: 0 }} >
                    <StyledBadge
                      overlap="circle"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      variant="dot"
                    />
                  </div>
                )}
                <ListItemText primary={item.testName} />
                <ListItemText
                  secondary={
                    item.testType.charAt(0).toUpperCase() +
                    item.testType.slice(1)
                  }
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(item, "resetTest");
                  }}
                >
                  <RestorePageIcon
                    color={warning === index ? "primary" : "inherit"}
                  />
                </IconButton>
                <IconButton
                  disabled={warning === index}
                  onClick={(e) => handleEdit(e, item, index)}
                >
                  <EditIcon
                    color={warning !== index ? "primary" : "secondary"}
                  />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(item, "deleteTest");
                  }}
                >
                  <DeleteIcon color="secondary" />
                </IconButton>
              </ListItem>
              {testsAttempted.includes(item._id) && warning === index && (
                <Typography variant="caption" color="error">{isTest ? t("testForm.errors.resetTestToMakeChanges") : t("testForm.errors.resetAssignmentToMakeChanges")}</Typography>
              )}
            </Aux>
          );
        })}
      </List>
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (document, type) => dispatch(actions.openModal(document, type)),
    fetchQuestionBank: (courseId, token) =>
      dispatch(actions.fetchQuestionBankStart(courseId, token)),
  };
};

const mapStateToProps = (state) => {
  return {
    course: state.common.selectedCourse,
    courses: state.common.courses,
    token: state.authentication.token,
    notifications: state.common.notifications,

    // students: state.common.students,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tests);
