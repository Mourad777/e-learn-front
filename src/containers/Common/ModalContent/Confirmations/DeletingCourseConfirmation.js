import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../store/actions/index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { withTranslation } from "react-i18next";

class DeleteCourseConfirmation extends Component {
  state = {
    confirmCheckbox: false,
  };

  handleChange = (event) => {
    this.setState({ confirmCheckbox: event.target.checked });
  };

  render() {
    const {
      modalDocument,
      deleteCourse,
      token,
      deActivateCourse,
      t,
    } = this.props;
    return (
      <div>
        <Typography paragraph variant="h6" gutterBottom>
          {`${t("confirmations.deleteCourse.youAreDeleting")} ${
            (modalDocument || {}).courseName
          }`}
        </Typography>
        <Typography paragraph variant="body1" gutterBottom>
          {t("confirmations.deleteCourse.deletingCourseWillDeleteContent")}
        </Typography>
        <Typography paragraph variant="body1" gutterBottom>
          {t("confirmations.deleteCourse.studentsNoAccess")}
        </Typography>
        <Typography paragraph variant="body1" gutterBottom>
          {t("confirmations.deleteCourse.courseRemovedFromRecord")}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.confirmCheckbox}
              onChange={this.handleChange}
              value="checked"
            />
          }
          label={t("confirmations.deleteCourse.agree")}
        />
        <Button
          disabled={!this.state.confirmCheckbox}
          color="secondary"
          onClick={() => {
            deleteCourse(modalDocument._id, token);
          }}
        >
          {t("confirmations.deleteCourse.deleteCourse")}
        </Button>

        {(modalDocument || {}).courseActive && (
          <Aux>
            <Typography paragraph variant="h6" gutterBottom>
              {t("confirmations.deleteCourse.deactivateAlternative")}
            </Typography>
            <Typography paragraph variant="body1" gutterBottom>
              {t("confirmations.deleteCourse.courseRemainsAccessibleToYou")}
            </Typography>
            <Typography paragraph variant="body1" gutterBottom>
              {t("confirmations.deleteCourse.wontEraseContent")}
            </Typography>
            <Button
              color="secondary"
              fullWidth
              onClick={() => {
                deActivateCourse(modalDocument._id, token);
              }}
            >
              {t("confirmations.deleteCourse.deactivate")}
            </Button>
          </Aux>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCourse: (courseId, token) =>
      dispatch(actions.deleteCourseStart(courseId, token)),
    deActivateCourse: (courseId, token) =>
      dispatch(actions.toggleCourseStateStart(courseId, token)),
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.authentication.token,
    modalDocument: state.common.modalDocument,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(DeleteCourseConfirmation));
