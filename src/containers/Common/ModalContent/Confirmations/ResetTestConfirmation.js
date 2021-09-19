import React, { Component } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../store/actions/index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import MultiLineField from "../../../../components/UI/FormElements/MultiLineField/MultiLineField";
import { OutlinedInput } from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { getCourse } from "../../../../utility/getCourse";

class ResetTestConfirmation extends Component {
  state = {
    confirmCheckbox: false,
    message: "",
  };

  handleCheckbox = (event) => {
    this.setState({ confirmCheckbox: event.target.checked });
  };

  handleMessage = (event) => {
    this.setState({ message: event.target.value });
  };

  render() {
    const { modalDocument, token, resetTest, course, t } = this.props;
    return (
      <div>
        {modalDocument.student ? (
          <Aux>
            <Typography paragraph variant="h6" gutterBottom>
              {modalDocument.assignment
                ?  t("confirmations.resetTest.resetingAssignment")
                :  t("confirmations.resetTest.resetingTest")}
            </Typography>
            <Typography paragraph variant="h6" gutterBottom>
              {`${modalDocument.student.firstName} ${
                modalDocument.assignment
                  ? t("confirmations.resetTest.willBeAbleAssignment")
                  : t("confirmations.resetTest.willBeAbleTest")
              }`}
            </Typography>
            <Typography paragraph variant="h6" gutterBottom>
              {t("confirmations.resetTest.gradeWillBeDeleted")}
            </Typography>
            <MultiLineField
              label={t("confirmations.resetTest.reason")}
              options={{
                multiline: true,
                rows: 3,
                variant: OutlinedInput,
              }}
              textLabel
              input={{
                value: this.state.message,
                onChange: this.handleMessage,
              }}
            />
          </Aux>
        ) : (
          <Aux>
            <Typography paragraph variant="h6" gutterBottom>
              {modalDocument.assignment
                ? t("confirmations.resetTest.resetingAssignment")
                : t("confirmations.resetTest.resetingTest")}
            </Typography>
            <Typography paragraph variant="h6" gutterBottom>
              {modalDocument.assignment
                ? t("confirmations.resetTest.everyStudentCanRetakeAssignment")
                : t("confirmations.resetTest.everyStudentCanRetakeTest")}
            </Typography>
            <Typography paragraph variant="h6" gutterBottom>
              {t("confirmations.resetTest.studentsGradeWillBeErased")}
            </Typography>
          </Aux>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.confirmCheckbox}
              onChange={this.handleCheckbox}
              value="checked"
            />
          }
          label={t("confirmations.resetTest.agree")}
        />
        <Button
          disabled={!this.state.confirmCheckbox}
          color="secondary"
          onClick={() => {
            resetTest(
              modalDocument._id,
              (modalDocument.student || {})._id,
              course._id,
              this.state.message,
              token
            );
          }}
        >
          {modalDocument.assignment
            ? t("confirmations.resetTest.resetAssignment")
            : t("confirmations.resetTest.resetTest")}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetTest: (testId, studentId, courseId, message, token) =>
      dispatch(
        actions.resetTestStart(testId, studentId, courseId, message, token)
      ),
  };
};

const mapStateToProps = (state) => {
  const populatedCourse = getCourse(state.common.courses,state.common.selectedCourse);
  return {
    token: state.authentication.token,
    modalDocument: state.common.modalDocument,
    course:populatedCourse,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(ResetTestConfirmation));
