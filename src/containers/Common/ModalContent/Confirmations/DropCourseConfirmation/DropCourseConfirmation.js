import React, { Component } from "react";
import { connect } from "react-redux";
import classes from "./DropCourseConfirmation.module.css";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../../store/actions/index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { withTranslation } from "react-i18next";

class EnrollmentSummary extends Component {
  state = {
    confirmCheckbox: false,
  };

  handleChange = (event) => {
    this.setState({ confirmCheckbox: event.target.checked });
  };

  resetCheckbox = (event) => {
    this.setState({ confirmCheckbox: false });
  };

  render() {
    const { modalDocument, token, userId, drop, t, configuration } = this.props;
    const dropPenalty = configuration.dropCourseGrade;
    const isEnrollAllowedAfterDropCourse = configuration.isEnrollAllowedAfterDropCourse;
    return (
      <div>
        <Typography paragraph variant="h6" gutterBottom>
          {t("confirmations.dropCourse.youAreDropping") + " "}
          <span className={classes.Bold}>
            {(modalDocument || {}).courseName}
          </span>
        </Typography>
        {(modalDocument || {}).courseDropDeadline &&
          parseInt((modalDocument || {}).courseDropDeadline) > Date.now() && (
            <Typography paragraph variant="h6" gutterBottom>
              {`${t("confirmations.dropCourse.deadlineNotYet")} ${isEnrollAllowedAfterDropCourse ? "" : t("confirmations.dropCourse.noEnroll")}` }
            </Typography>
          )}
        {(modalDocument || {}).courseDropDeadline &&
          parseInt((modalDocument || {}).courseDropDeadline) < Date.now() &&
          (modalDocument || {}).courseDropDeadline && (
            <Typography paragraph variant="h6" gutterBottom>
              {t("confirmations.dropCourse.deadlinePassed")}
            </Typography>
          )}

        {(modalDocument || {}).enrollmentEndDate &&
          parseInt((modalDocument || {}).enrollmentEndDate) > Date.now() && (
            <Typography paragraph variant="h6" gutterBottom>
              { t("confirmations.dropCourse.youCanReenroll")}
            </Typography>
          )}
        {parseInt((modalDocument || {}).enrollmentEndDate) < Date.now() &&
          (modalDocument || {}).enrollmentEndDate && (
            <Typography paragraph variant="h6" gutterBottom>
              {t("confirmations.dropCourse.youCanNotReenroll")}
            </Typography>
          )}

        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.confirmCheckbox}
              onChange={this.handleChange}
              value="checked"
            />
          }
          label={t("confirmations.dropCourse.agree")}
        />
        <Button
          disabled={!this.state.confirmCheckbox}
          // variant="outlined"
          color="secondary"
          onClick={() => {
            drop(userId, modalDocument._id, token);
          }}
        >
          {t("confirmations.dropCourse.dropCourse")}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    drop: (userId, courseId, token) => {
      dispatch(actions.dropCourseStart(userId, courseId, token));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    courses: state.common.courses,
    courseDropping: state.studentCourse.courseDropping,
    modalDocument: state.common.modalDocument,
    token: state.authentication.token,
    userId: state.authentication.userId,
    configuration: state.common.configuration,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(EnrollmentSummary));
