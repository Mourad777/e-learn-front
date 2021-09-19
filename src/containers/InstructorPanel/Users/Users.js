import React from "react"
import { connect } from "react-redux"
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { Avatar } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import Aux from "../../../hoc/Auxiliary/Auxiliary"

const Users = ({ instructors, students, userId, configuration, isStudent, history }) => {
    const { t } = useTranslation("common")
    let users;
    if (!isStudent) users = instructors;
    if (isStudent) users = students;
    const isApproveInstructorAccounts = configuration.isApproveInstructorAccounts
    const isApproveStudentAccounts = configuration.isApproveStudentAccounts
    const isApprovalRequired = (isApproveInstructorAccounts && !isStudent) || (isApproveStudentAccounts && isStudent)
    return (
        <Aux>
            <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.users")}</Typography>
            <List style={{ marginTop: 40 }}>
                {(users || []).filter(user => user._id !== userId).map(u => (
                    <ListItem onClick={
                        () => history.push(`/users/${isStudent ? 'student' : 'instructor'}s/${u._id}`)
                    } button key={u._id}>
                        <Avatar src={u.profilePicture} />
                        <span style={{ marginLeft: 15 }}>{`${u.firstName} ${u.lastName}`}</span>
                        <Typography
                            style={{ marginLeft: 10, marginRight: 10 }}
                            variant="caption"
                            color="error"
                        >
                            {!u.isAccountApproved && isApprovalRequired ? t("userSummary.pendingApproval") : u.isAccountSuspended ? t("userSummary.suspended") : ""}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Aux>
    )
}

const mapStateToProps = (state) => {
    return {
        instructors: state.instructorCourse.instructors,
        userId: state.authentication.userId,
        token: state.authentication.token,
        students: state.instructorStudent.allStudents,
        configuration: state.common.configuration,
    }
}

export default connect(mapStateToProps)(Users)