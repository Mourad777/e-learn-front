import React, { useEffect } from "react";
import { connect } from "react-redux";
import classes from "./Notification.module.css";
import Typography from "@material-ui/core/Typography";
import { Avatar } from "@material-ui/core";
import * as actions from "../../../store/actions/index";
import { useTranslation } from "react-i18next";

const Notification = ({
  notification,
  onNotificationClick,
  coursePanel,
  tab,
  testInSession,
  token,
  fetchNotifications,
  markAsSeen,
}) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (tab === 1 && coursePanel === "chat") {
      markAsSeen(notification._id, token);
    }
  }, []);
  if (testInSession || (tab === 1 && coursePanel === "chat")) {
    return null;
  }
  if (notification.returnNull) return null;
  let ext;
  if (notification.file) ext = notification.file.toLowerCase().split(".").pop();
  let icon;
  if (ext === "pdf") icon = <i className="far fa-file-pdf fa-2x"></i>;
  if (ext === "mp3") icon = <i className="fas fa-file-audio fa-2x"></i>;
  if (ext === "docx" || ext === "doc")
    icon = <i className="fas fa-file-word fa-2x"></i>;
  if (ext === "jpeg" || ext === "jpg" || ext === "jfif")
    icon = <i className="fas fa-file-image fa-2x"></i>;
  if (ext === "avi" || ext === "mp4" || ext === "mkv" || ext === "webm")
    icon = <i className="far fa-file-video fa-2x"></i>;
  return (
    <div
      style={{
        transform: notification ? "translateY(0)" : "translateY(-100vh)",
        opacity: notification ? "1" : "0",
        cursor: "pointer",
      }}
      className={[
        classes.notification,
        classes[notification.type],
        //   noDrawer ? classes.noDrawer : classes.withDrawer
      ].join(" ")}
      onClick={() =>
        onNotificationClick(
          {
            _id: notification.senderId,
            firstName: notification.senderFirstName,
            lastName: notification.senderLastName,
            profilePicture: notification.avatar,
          },
          notification.courseId,
          notification.userType,
          notification.type
        )
      }
    >
      {notification.avatar && <Avatar src={notification.avatar} />}
      <Typography variant="subtitle1">{`${notification.senderFirstName} ${
        notification.senderLastName
      } ${t("notifications.from")} ${notification.courseName}`}</Typography>
      {icon}
      <Typography variant="subtitle1">
        {notification.message.slice(0, 25) + "..."}
      </Typography>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    markAsSeen: (id, token) => {
      dispatch(actions.markAsSeenStart(id, token));
    },
    fetchNotifications: (token) => {
      dispatch(actions.fetchNotificationsStart(token));
    },
  };
};
const mapStateToProps = (state) => {
  return {
    tab: state.common.tab,
    coursePanel: state.common.coursePanel,
    testInSession: state.studentTest.testInSession,
    token: state.authentication.token,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
