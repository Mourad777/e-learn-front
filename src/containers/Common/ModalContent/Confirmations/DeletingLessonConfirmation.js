import React, { Component } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../store/actions/index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { withTranslation } from "react-i18next";

class DeleteLessonConfirmation extends Component {
  state = {
    confirmCheckbox: false,
  };

  handleChange = (event) => {
    this.setState({ confirmCheckbox: event.target.checked });
  };
  render() {
    const { deleteLesson, modalDocument: lesson = {}, token, t } = this.props;
    return (
      <div>
        <Typography paragraph variant="h6" gutterBottom>
          {`${t("confirmations.deleteLesson.youAreDeleting")} ${
            lesson.lessonName
          }`}
        </Typography>
        <Typography paragraph variant="h6" gutterBottom>
          {t("confirmations.deleteLesson.noAccess")}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.confirmCheckbox}
              onChange={this.handleChange}
              value="checked"
            />
          }
          label={t("confirmations.deleteLesson.agree")}
        />
        <Button
          disabled={!this.state.confirmCheckbox}
          color="secondary"
          onClick={() => {
            deleteLesson(lesson._id, token);
          }}
        >
          {t("confirmations.deleteLesson.deleteLesson")}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteLesson: (id, token) => {
      dispatch(actions.deleteLessonStart(id, token));
    },
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
)(withTranslation("common")(DeleteLessonConfirmation));
