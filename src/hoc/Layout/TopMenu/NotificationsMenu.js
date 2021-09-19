import React from "react"
import { connect } from "react-redux"
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Typography from "@material-ui/core/Typography";
import NotificationIcon from "./NotificationIcon";
import { ListItemIcon } from "@material-ui/core";
import { getNotificationContent } from "../util/getNotificationContent";
import { useTranslation } from "react-i18next";

const NotificationsMenu = ({
    notifications,
    handleClose,
    handleDoc,
    menuType,
    chatMenu,
    notificationsMenu,
    chatMenuOpen,
    notificationsMenuOpen,
    courses,
    studentTestResults,
    instructors,
    students,
}) => {
    const { t } = useTranslation("common");
    return (<Menu
        anchorEl={menuType === "chat" ? chatMenu : notificationsMenu}
        anchorOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        open={
            menuType === "chat" ? chatMenuOpen : notificationsMenuOpen
        }
        onClose={handleClose}
    >
        {(notifications || [])
            .filter((n) => {
                //filter to put chats in one category and other notifications in another category
                if (menuType === "chat") return n.documentType === "chat";
                if (menuType === "notifications")
                    return n.documentType !== "chat";
            })
            .map((n) => {
                const course =
                    (courses || []).find((c) => c._id === n.course) || {};
                const isTestPublished =
                    (course.tests || []).find(
                        (t) => t._id === n.documentId && t.published
                    ) || {};

                if ((n.documentType === "assignmentExcused" || n.documentType === "testExcused") && !isTestPublished) {
                    return null
                }
                return (
                    <MenuItem
                        style={{
                            whiteSpace: "normal",
                            opacity:
                                n.seen && n.documentType === "chat" ? 0.6 : 1,
                        }}
                        key={n._id}
                        onClick={() => handleDoc(n)}
                    >
                        <ListItemIcon><NotificationIcon courses={courses} n={n} /></ListItemIcon>
                        <div>
                            {n.senderFirstName && (
                                <Typography>{n.senderFirstName}</Typography>
                            )}
                            <Typography
                                variant="caption"
                                style={{ display: "block" }}
                            >
                                {getNotificationContent(n, courses, studentTestResults, t,students,instructors)}
                            </Typography>
                        </div>
                    </MenuItem>
                );
            })}
    </Menu>)
}

const mapStateToProps = (state) => {
    return {
        courses: state.common.courses,
        allStudents: state.common.allStudents,
        courses: state.common.courses,
        studentTestResults: state.studentTest.testResults,

        instructors: state.instructorCourse.instructors,
        students: state.instructorStudent.allStudents,
    };
};

export default connect(mapStateToProps)(NotificationsMenu);