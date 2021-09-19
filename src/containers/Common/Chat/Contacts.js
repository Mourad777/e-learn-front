import React, { useEffect,useState, useRef } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import moment from "moment";
import { Avatar } from "@material-ui/core";
import socketIOClient from "socket.io-client";
import StyledBadge from "./StyledBadge";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import momentTZ from "moment-timezone";
import { getCourse } from "../../../utility/getCourse";
import { useLocation, matchPath, useHistory } from "react-router-dom";
import {
  isOfficeHourCheck,
  getStartOrEndTime,
} from "../../../utility/officehour-check";
import { runChatTimeout } from "./util/chatTimout";

const Contacts = ({
  students,
  course,
  userId,
  selectedCourse,
  configuration,
  fetchStudents,
}) => {
  const history = useHistory()
  const [isOfficeHour, setIsOfficeHour] = useState(false);

  const currentLocation = useLocation().pathname
  const instructorPanel = !!matchPath(currentLocation, {
    path: "/instructor-panel/course/:courseId/chat/contacts",
    exact: true,
  });
  const studentPanel = !!matchPath(currentLocation, {
    path: "/student-panel/course/:courseId/chat/contacts",
    exact: true,
  });
  const { t } = useTranslation();
  const [activeUsers, setActiveUsers] = React.useState([]);
  let chatAlwaysOpen = configuration.isChatAllowedOutsideOfficehours;
  if (studentPanel) {
    chatAlwaysOpen = (configuration.coursesIsChatAllowedOutsideOfficehours || []).includes(course._id)
  }
  // http://localhost:3000/instructor-panel/course/5f890b35b9ab74be4e6d1f50/chat/user/5f88e5a218b86ea43934c94e
  const mounted = useRef();
  useEffect(()=>{
    if (!students && !mounted.current && selectedCourse) {
      fetchStudents(selectedCourse, localStorage.getItem('token'))
      mounted.current = true;
    }
  })



  useEffect(() => {
    if (!selectedCourse) return
    const token = localStorage.getItem('token')
    const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
      query: { token },
    });

    socket.emit("initializeContacts");

    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });
    return () => socket.off("activeUsers");
  }, [selectedCourse]);

  useEffect(() => {
    const { isIrregOfficeHour, isRegOfficeHour } = isOfficeHourCheck(
      course || {},
      Date.now()
    );

    if (isIrregOfficeHour || isRegOfficeHour) {
      setIsOfficeHour(true);
    } else {
      setIsOfficeHour(false);
    }


    let timeoutId;
    const startEndTime = getStartOrEndTime(course, Date.now());
    runChatTimeout(startEndTime,timeoutId,course,setIsOfficeHour);
    return () => {
      clearTimeout(timeoutId)
    }
  }, [course])

  const handleSelChatUser = (user) => {
    history.push(`/${studentPanel ? 'student' : 'instructor'}-panel/course/${selectedCourse}/chat/user/${user}`);
  };

  const officeHours = (
    <Aux>
      {!isOfficeHour && !chatAlwaysOpen && (
        <Typography gutterBottom variant="subtitle1">
          {studentPanel
            ? t("chat.chatInstructorOnlyOfficeHours")
            : t("chat.chatStudentOnlyOfficeHours")}
        </Typography>
      )}
      {(course.regularOfficeHours || []).map((item, index) => {
        const tz = momentTZ(new Date(Date.now())).tz(item.timezoneRegion).format('z')
        return (
          <Aux key={item._id}>
            <Aux>
              <Typography
                variant="caption"
                style={{ display: "block", fontWeight: "bold" }}
              >
                {t(`courseForm.days.${item.day.toLowerCase()}`)}
              </Typography>

              <Typography variant="caption">
                {`${t("chat.from")} ${item.startTime} ${t("chat.to")} ${item.endTime
                  } ${tz}`}
              </Typography>
            </Aux>
          </Aux>
        )
      })}
      {(course.irregularOfficeHours || []).map((item, index) => {
        const tz = momentTZ(new Date(Date.now())).tz(item.timezoneRegion).format('z')
        return (
          <Aux key={item._id}>
            <Aux>
              <Typography
                variant="caption"
                style={{ display: "block", fontWeight: "bold" }}
              >{`${moment(parseInt(item.date))
                .locale(localStorage.getItem("i18nextLng"))
                .format("MMMM DD YYYY")} `}</Typography>
              <Typography variant="caption">{` ${t("chat.from")} ${item.startTime
                } ${t("chat.to")} ${item.endTime} ${tz}`}</Typography>
            </Aux>
          </Aux>
        )
      })}
    </Aux>
  );

  if (!course) return null;
  const instructor = course.courseInstructor || {}
  return (
    <Aux>
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.chat")}</Typography>
      <List>
        {studentPanel && (
          <Aux>
            {!isOfficeHour && studentPanel && !chatAlwaysOpen && (
              <Aux>{officeHours}</Aux>
            )}
            <ListItem>
              <ListItemText secondary={t("chat.instructor")} />
            </ListItem>
            <ListItem
              disabled={!isOfficeHour && !chatAlwaysOpen}
              button
              onClick={() => handleSelChatUser(course.courseInstructor._id)}
            >
              {activeUsers.includes(instructor._id) ? (
                <StyledBadge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  <Avatar
                    style={{ marginRight: 10 }}
                    src={instructor.profilePicture}
                  />
                </StyledBadge>
              ) : (
                <Avatar
                  style={{ marginRight: 10 }}
                  src={instructor.profilePicture}
                />
              )}

              <ListItemText
                primary={`${instructor.firstName} ${instructor.lastName}`}
              />
            </ListItem>
          </Aux>
        )}
        <Aux>
          {!isOfficeHour && !studentPanel && !chatAlwaysOpen && <Aux>{officeHours}</Aux>}
          {(students || []).map((student, i) => (
            <Aux key={student._id}>
              {userId !== student._id && (
                <Aux>
                  {(i === 0 && instructorPanel) ||
                    (i === 1 && studentPanel && (
                      <ListItem>
                        <ListItemText secondary={t("chat.students")} />
                      </ListItem>
                    ))}
                  {i === 0 && (
                    <ListItem>
                      <ListItemText secondary={t("chat.students")} />
                    </ListItem>
                  )}
                  <ListItem
                    disabled={instructorPanel && !isOfficeHour && !chatAlwaysOpen}
                    button
                    onClick={() => handleSelChatUser(student._id)}
                  >
                    {activeUsers.includes(student._id) ? (
                      <StyledBadge
                        overlap="circle"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                      >
                        <Avatar
                          style={{ marginRight: 10 }}
                          src={student.profilePicture}
                        />
                      </StyledBadge>
                    ) : (
                      <Avatar
                        style={{ marginRight: 10 }}
                        src={student.profilePicture}
                      />
                    )}

                    <ListItemText
                      primary={`${student.firstName} ${student.lastName}`}
                    />
                    <ListItemText
                      secondary={`ID: ${student._id.replace(/\D/g, "")}`}
                    />
                  </ListItem>
                </Aux>
              )}
            </Aux>
          ))}
        </Aux>
      </List>
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setChatUser: (user) => {
      dispatch(actions.setChatUser(user));
    },
    setTab: (tab) => {
      dispatch(actions.setTab(tab));
    },
    fetchStudents: (courseId, token) =>
      dispatch(actions.fetchStudentsStart(courseId, token)),
  };
};

const mapStateToProps = (state) => {
  const populatedCourse = getCourse(state.common.courses, state.common.selectedCourse);
  return {
    selectedCourse: state.common.selectedCourse,
    students: state.common.students,
    course: populatedCourse,
    userId: state.authentication.userId,
    token: state.authentication.token,
    configuration: state.common.configuration,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
