import React, { Component } from "react";
import {
  Field,
  reduxForm,
  touch,
  destroy,
  getFormValues,
  getFormSyncErrors,
} from "redux-form";
import { connect } from "react-redux";
import { validate } from "./validate";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import CustomButton from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./AuthenticationForm.module.css";
import * as actions from "../../../store/actions/index";
import Typography from "@material-ui/core/Typography";
import Steps from "../../../components/UI/Steps/Steps";
import DropdownSelect from "../../../components/UI/FormElements/DropdownSelect/DropdownSelect";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { withTranslation } from "react-i18next";

export class AuthenticationFormStepTwo extends Component {
  state = {
    isValid: true,
  };
  setFormValidity(isValid) {
    this.setState({ isValid });
  }

  triggerValidation = () => {
    const { touchField, formValues = {} } = this.props;
    ["type", "password", "confirmPassword", "email"].forEach((f) => {
      touchField(f);
    });

    const errors = validate(formValues) || {};
    const signupFormInvalid =
      errors.email || errors.password || errors.confirmPassword || errors.type
        ? true
        : false;
    if (signupFormInvalid) this.setFormValidity(false);
  };

  render() {
    const {
      formIsSignup,
      formValues = {},
      page,
      completed,
      previousPage,
      toggleLoginSubmitForm,
      loading,
      pristine,
      setFormPage,
      submitForm,
      formErrors,
      isDarkTheme,
      t
    } = this.props;

    const dropdownOptions = [
      { value: "", primaryText: "" },
      { value: "student", primaryText: t('auth.student') },
      { value: "instructor", primaryText: t('auth.instructor') },
    ];
    const errors = validate(formValues) || {};
    const signupFormInvalid =
      errors.email || errors.password || errors.confirmPassword || errors.type
        ? true
        : false;

    const signupIsValid =
      ((!signupFormInvalid || this.state.isValid) && !formErrors.asyncError) ||
      false;

    return (
      <Aux>
        <Spinner transparent active={loading} />
        <div className={classes.header}>
          <Typography style={{ textAlign: "center" }} variant="h5">
            {t("auth.signUp")}
          </Typography>
        </div>
        <div className={classes.steps}>
          <Steps
            size="small"
            stepsLabels={["1", "2"]}
            activeStep={page - 1}
            completed={completed ? [0, 1] : [0]}
          />
        </div>
        {formErrors.noAdminAccount && (
          <Typography
            align="center"
            gutterBottom
            variant="subtitle1"
            color="error"
          >
            {t("auth.errors.noAdminAccount")}
          </Typography>
        )}
        <Field
          name="type"
          error={errors.type}
          component={DropdownSelect}
          label={t("auth.accountType")}
          variant="outlined"
          options={dropdownOptions}
        />
        <Field
          name="email"
          error={errors.email}
          component={TextField}
          label={t("auth.email")}
        />
        <Field
          name="password"
          error={errors.password}
          component={TextField}
          label={t("auth.password")}
          type="password"
        />
        <Field
          name="confirmPassword"
          error={errors.confirmPassword}
          component={TextField}
          label={t("auth.confirmPassword")}
          type="password"
        />
        <div className={classes.ButtonContainer}>
          <CustomButton
            isDarkTheme={isDarkTheme}
            halfWidth
            clicked={(e) => {
              e.preventDefault();
              previousPage();
            }}
          >
            {t("auth.buttons.back")}
          </CustomButton>
          <CustomButton
            isDarkTheme={isDarkTheme}
            halfWidth
            clicked={() => {
              if (signupFormInvalid || pristine) {
                this.triggerValidation();
                return;
              }
              submitForm(true);
            }}
            isError={!signupIsValid}
          >
            {t("auth.buttons.submit")}
          </CustomButton>
        </div>
        <div className={classes.ButtonContainer}>
          <CustomButton
            isDarkTheme={isDarkTheme}
            clicked={() => {
              toggleLoginSubmitForm();
              setFormPage(1);
            }}
          >
            {formIsSignup
              ? t("auth.buttons.switchToSignIn")
              : t("auth.buttons.switchToSignUp")}
          </CustomButton>
        </div>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("authenticationForm")(state),
    formErrors: getFormSyncErrors("authenticationForm")(state),
    loading: state.authentication.loading,
    error: state.authentication.error,
    isAuthenticated: state.authentication.token !== null,
    authRedirectPath: state.authentication.authRedirectPath,
    formIsSignup: state.authentication.formIsSignup,
    formIsForgotPassword: state.authentication.formIsForgotPassword,
    isDarkTheme: state.common.isDarkTheme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    touchField: (field) => {
      dispatch(touch("authenticationForm", field));
    },
    toggleLoginSubmitForm: (e) => {
      dispatch(actions.toggleForm(e));
      dispatch(destroy("authenticationForm"));
    },
    setFormPage: (page) => {
      dispatch(actions.setSignupFormPage(page));
    },
  };
};

const wrappedForm = reduxForm({
  form: "authenticationForm",
  validate: validate,
  destroyOnUnmount: false,
  touchOnBlur: true,
})((withTranslation("common")(AuthenticationFormStepTwo)));

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
