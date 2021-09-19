import React from "react";
import { reduxForm, getFormValues } from "redux-form";
import { connect } from "react-redux";
import { validate } from "./validate";
import * as actions from "../../../store/actions/index";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { Redirect } from "react-router";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const AuthenticationForm = ({
  page,
  history,
  formValues,
  formIsSignup,
  formIsForgotPassword,
  login,
  setSignupFormPage,
  sendPasswordResetLink,
  submitAuthForm
}) => {
  const userType = localStorage.getItem('userType');
  const formErrors = validate(formValues) || {};

  const stepOneCompleted =
    !formErrors.firstName &&
    !formErrors.lastName &&
    !formErrors.sex &&
    !formErrors.dob;

  const stepTwoCompleted =
    !formErrors.type &&
    !formErrors.email &&
    !formErrors.password &&
    !formErrors.confirmPassword;

  return (
    <Aux>

      {(userType === 'student') && <Redirect to={"/student-panel/courses"} />}
      {(userType === 'instructor') && <Redirect to={"/instructor-panel/courses"} />}

      <Card>
        <CardContent>
          {(page === 1 || !formIsSignup) && (
            <StepOne
              page={page}
              completed={stepOneCompleted}
              submitForm={(isSignup) => {
                if (!isSignup && !formIsForgotPassword)
                  login({ ...formValues, history });
                if (isSignup) setSignupFormPage(2);
                if (formIsForgotPassword)
                  sendPasswordResetLink(formValues);
              }}
            />
          )}
          {page === 2 && formIsSignup && (
            <StepTwo
              page={page}
              previousPage={() => setSignupFormPage(1)}
              nextPage={() => setSignupFormPage(3)}
              completed={stepTwoCompleted}
              submitForm={(isSignup) =>
                submitAuthForm({ ...formValues, language: localStorage.getItem('i18nextLng') || 'en' }, isSignup)
              }
            />
          )}
        </CardContent>
      </Card>
    </Aux>
  );
}

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("authenticationForm")(state),
    formIsSignup: state.authentication.formIsSignup,
    formIsForgotPassword: state.authentication.formIsForgotPassword,
    page: state.authentication.signupFormPage,
    token: state.authentication.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (formValues, isSignup) => {
      dispatch(actions.authenticationStart(formValues, isSignup));
    },
    submitAuthForm: (formValues, isSignup) =>
      dispatch(actions.createAccountStart(formValues, isSignup)),
    sendPasswordResetLink: (formValues) => {
      dispatch(actions.sendPasswordResetLinkStart(formValues));
    },
    setSignupFormPage: (page) => {
      dispatch(actions.setSignupFormPage(page));
    },
  };
};

const wrappedForm = reduxForm({
  form: "authenticationForm",
  validate: validate,
  destroyOnUnmount: true,
  touchOnBlur: false,
})(AuthenticationForm);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);