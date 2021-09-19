import React, { Component } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../store/actions/index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { withTranslation } from "react-i18next";

class DeleteTestConfirmation extends Component {
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
    const { modalDocument, token, deleteTest, t } = this.props;
    return (
      <div>
        <Typography paragraph variant="h6" gutterBottom>
          {modalDocument.assignment
            ? t("confirmations.deleteTest.assignmentGradeRemoved")
            : t("confirmations.deleteTest.testGradeRemoved")}
        </Typography>
        <Typography paragraph variant="h6" gutterBottom>
          {t("confirmations.deleteTest.questionBankNotAffected")}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.confirmCheckbox}
              onChange={this.handleChange}
              value="checked"
            />
          }
          label={t("confirmations.deleteTest.agree")}
        />
        <Button
          disabled={!this.state.confirmCheckbox}
          color="secondary"
          onClick={() => {
            deleteTest(modalDocument._id, token);
          }}
        >
          {modalDocument.assignment
            ? t("confirmations.deleteTest.deleteAssignment")
            : t("confirmations.deleteTest.deleteTest")}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteTest: (id, token) => dispatch(actions.deleteTestStart(id, token)),
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
)(withTranslation("common")(DeleteTestConfirmation));
