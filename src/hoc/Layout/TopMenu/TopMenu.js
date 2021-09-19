import React from "react"
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux"
import Badge from "@material-ui/core/Badge";
import { Avatar } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import NotificationsIcon from "@material-ui/icons/Notifications";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { NavLink } from "react-router-dom";
import CalendarMenu from "../Calendar/CalendarMenu";
import { handleDocument } from "../util/documentHandler";
import NotificationsMenu from "./NotificationsMenu"
import Aux from "../../Auxiliary/Auxiliary";
import { useHistory } from "react-router-dom";

const TopMenu = ({
    profilePicture,
    markAsSeen,
    courses,
    studentLoggedIn,
    instructorLoggedIn,
    fetchStudents,
    openModal,
    fetchModules,
    fetchQuestionBank,
    setCourse,
    handlePanelChange,
    token,
    testInSession,
    notifications,
}) => {
    const [calendar, setCalendar] = React.useState(null);
    const [chatMenu, setChatMenu] = React.useState(null);
    const [notificationsMenu, setNotificationsMenu] = React.useState(null);
    const [menuType, setMenuType] = React.useState(null);

    const chatMenuOpen = Boolean(chatMenu);
    const notificationsMenuOpen = Boolean(notificationsMenu);
    const history = useHistory();
    const handleCalendar = (event) => {
        // setSelectedDay(null);
        setCalendar(event.currentTarget);
    };

    const handleChatMenu = (event) => {
        if ((notifications || []).length === 0) return;
        setChatMenu(event.currentTarget);
        setMenuType("chat");
    };

    const handleNotificationsMenu = (event) => {
        if ((notifications || []).length === 0) return;
        setNotificationsMenu(event.currentTarget);
        setMenuType("notifications");
    };

    const handleClose = () => {
        setChatMenu(null);
        setNotificationsMenu(null);
        setCalendar(null);
    };

    const handleDoc = (notification, documentHandlerType) => {
        handleDocument(
            notification,
            documentHandlerType,
            markAsSeen,
            courses,
            studentLoggedIn,
            instructorLoggedIn,
            handleClose,
            fetchStudents,
            openModal,
            fetchModules,
            fetchQuestionBank,
            token,
            setCourse,
            history,
        )
    }

    const areNotifications =
        (notifications || []).filter((n) => n.documentType !== "chat").length > 0;
    const areChatMessages =
        (notifications || []).filter((n) => n.documentType === "chat").length > 0;


    return (
        <div style={{ height: '100%' }}>
            {!testInSession && (
                <Aux>
                    <Badge
                        style={{ marginRight: "10px", marginTop: "7px" }}
                        color="secondary"
                        badgeContent={
                            !testInSession
                                ? (notifications || []).filter(
                                    (n) => !n.seen && n.documentType === "chat"
                                ).length
                                : 0
                        }
                    >
                        <ChatIcon
                            style={{
                                cursor: areChatMessages ? "pointer" : "auto",
                            }}
                            edge="end"
                            color="inherit"
                            onClick={(e) => {
                                if (testInSession || !areChatMessages) return;
                                handleChatMenu(e);
                            }}
                        />
                    </Badge>
                    <Badge
                        style={{ marginRight: "10px", marginTop: "7px" }}
                        color="secondary"
                        badgeContent={
                            !testInSession
                                ? (notifications || []).filter(
                                    (n) => !n.seen && n.documentType !== "chat"
                                ).length
                                : 0
                        }
                    >
                        <NotificationsIcon
                            style={{
                                cursor:
                                    areNotifications && !testInSession
                                        ? "pointer"
                                        : "auto",
                            }}
                            onClick={(e) => {
                                if (!areNotifications) return;
                                if (testInSession) return;
                                handleNotificationsMenu(e);
                            }}
                        />
                    </Badge>
                    <Badge
                        style={{
                            marginRight: "10px",
                            marginTop: "7px",
                            cursor: "pointer",
                        }}
                        edge="end"
                        onClick={(e) => {
                            if (testInSession) return;
                            handleCalendar(e);
                        }}
                    >
                        <CalendarTodayIcon />
                    </Badge>
                </Aux>
            )}
            <Badge>
                {!testInSession ? <NavLink to={"/account"}>
                    <Avatar
                        style={{
                            cursor: !testInSession ? "pointer" : "auto",
                        }}
                        onClick={() => {
                            if (testInSession) return;
                            handlePanelChange(
                                ["All courses", "Your courses"],
                                "modules",
                                "exitCourse"
                            );
                        }}
                        src={profilePicture}
                    />
                </NavLink> :

                    <Avatar
                        style={{
                            cursor: !testInSession ? "pointer" : "auto",
                        }}
                        onClick={() => {
                            if (testInSession) return;
                            handlePanelChange(
                                ["All courses", "Your courses"],
                                "modules",
                                "exitCourse"
                            );
                        }}
                        src={profilePicture}
                    />

                }
            </Badge>
            <CalendarMenu handleDocument={handleDoc} handleClose={handleClose} calendar={calendar} />
            <NotificationsMenu
                handleClose={handleClose}
                handleDoc={handleDoc}
                menuType={menuType}
                chatMenu={chatMenu}
                notifications={notifications}
                notificationsMenu={notificationsMenu}
                chatMenuOpen={chatMenuOpen}
                notificationsMenuOpen={notificationsMenuOpen}
            />
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchStudents: (courseId, token, action) =>
            dispatch(actions.fetchStudentsStart(courseId, token, action)),
        fetchModules: (courseId, token) =>
            dispatch(actions.fetchModulesStart(courseId, token)),
        fetchQuestionBank: (courseId, token) =>
            dispatch(actions.fetchQuestionBankStart(courseId, token)),
        setCourse: (course) => {
            dispatch(actions.setCourse(course));
        },
        markAsSeen: (notificationId, token) => {
            dispatch(actions.markAsSeenStart(notificationId, token));
        },
        openModal: (document, documentType) => {
            dispatch(actions.openModal(document, documentType));
        },
    };
};


const mapStateToProps = (state) => {
    return {
        studentLoggedIn: state.authentication.studentLoggedIn,
        instructorLoggedIn: state.authentication.instructorLoggedIn,
        profilePicture: (state.authentication.loadedUser || {})
            .loadedProfilePicture,
        testInSession: state.studentTest.testInSession,
        notifications: state.common.notifications,
        courses: state.common.courses,
        token: state.authentication.token,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu)