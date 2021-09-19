import React from "react"
import BeenhereIcon from '@material-ui/icons/Beenhere';
import AssessmentIcon from "@material-ui/icons/Assessment";
import EditIcon from "@material-ui/icons/Edit";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import PublishIcon from "@material-ui/icons/Publish";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import BlockIcon from "@material-ui/icons/Block";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import EventIcon from "@material-ui/icons/Event";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import UpdateIcon from "@material-ui/icons/Update";
import { Avatar } from "@material-ui/core";

const NotificationIcon = ({ n, courses }) => {
  let notificationIcon;

  if (n.documentType === "courseOfficeHours") {
    notificationIcon = (
      <UpdateIcon color={n.seen ? "disabled" : "primary"} />
    );
  }
  if (n.documentType === "assignment") {
    notificationIcon = (
      <EditIcon color={n.seen ? "disabled" : "primary"} />
    );
  }
  if (n.documentType === "test") {
    notificationIcon = (
      <AssessmentIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "lesson") {
    notificationIcon = (
      <ChromeReaderModeIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "testReview") {
    notificationIcon = (
      <SpellcheckIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "assignmentReview") {
    notificationIcon = (
      <SpellcheckIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "testExcused") {
    notificationIcon = (
      <BeenhereIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "assignmentExcused") {
    notificationIcon = (
      <BeenhereIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "resetTest") {
    notificationIcon = (
      <RestorePageIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }

  if (n.documentType === "resetAssignment") {
    notificationIcon = (
      <RestorePageIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "testSubmitted") {
    notificationIcon = (
      <PublishIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "assignmentSubmitted") {
    notificationIcon = (
      <PublishIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }

  if (n.documentType === "courseEnrollRequest") {
    notificationIcon = (
      <PersonAddIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "autoEnroll") {
    notificationIcon = (
      <PersonAddIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "newStudentAccount") {
    notificationIcon = (
      <PersonAddIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "newInstructorAccount") {
    notificationIcon = (
      <PersonAddIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "courseEnrollDeny") {
    notificationIcon = (
      <BlockIcon color={n.seen ? "disabled" : "primary"} />
    );
  }
  if (n.documentType === "courseEnrollApprove") {
    notificationIcon = (
      <LibraryAddCheckIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "courseDrop") {
    notificationIcon = (
      <DesktopAccessDisabledIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (n.documentType === "courseDropDeadline") {
    notificationIcon = (
      <EventIcon color={n.seen ? "disabled" : "primary"} />
    );
  }
  if (
    n.documentType === "courseGrade" &&
    (courses || []).findIndex(
      (c) => c._id === n.documentId && c.completed
    ) > -1
  ) {
    notificationIcon = (
      <CheckCircleIcon
        color={n.seen ? "disabled" : "primary"}
      />
    );
  }
  if (
    n.documentType === "courseGrade" &&
    (courses || []).findIndex(
      (c) => c._id === n.documentId && !c.completed
    ) > -1
  ) {
    notificationIcon = (
      <CancelIcon color={n.seen ? "disabled" : "primary"} />
    );
  }
  // if (n.avatar)
  //   notificationIcon = <Avatar src={n.avatar} />;
  if (n.documentType === 'chat')
    notificationIcon = <Avatar src={n.avatar} />;

  return notificationIcon
}

export default NotificationIcon