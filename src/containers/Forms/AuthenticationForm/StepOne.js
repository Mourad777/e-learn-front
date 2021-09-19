import React, { Component } from "react";
import {
  Field,
  reduxForm,
  change,
  getFormValues,
  touch,
  destroy,
  getFormSyncErrors,
} from "redux-form";
import { connect } from "react-redux";
import { validate } from "./validate";
import DatePicker from "../../../components/UI/FormElements/DateTimePicker/DateTimePicker";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import DropdownSelect from "../../../components/UI/FormElements/DropdownSelect/DropdownSelect";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./AuthenticationForm.module.css";
import * as actions from "../../../store/actions/index";
import Typography from "@material-ui/core/Typography";
import Steps from "../../../components/UI/Steps/Steps";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { withTranslation } from "react-i18next";
import GoogleLogin from "./GoogleLogin"
// import GoogleLogout from "./GoogleLogin"
//return to login submit signIn auth.or
export class AuthenticationFormStepOne extends Component {
  state = {
    isValid: true,
  };
  setFormValidity(isValid) {
    this.setState({ isValid });
  }
  render() {
    const {
      loading,
      formValues = {},
      formIsSignup,
      completed,
      page,
      changeDOB,
      triggerSignupValidation,
      submitForm,
      pristine,
      toggleLoginSubmitForm,
      formIsForgotPassword,
      triggerPasswordResetValidation,
      triggerSigninValidation,
      forgotPassword,
      formErrors,
      resendVerificationEmail,
      isDarkTheme,
      t,
      i18n,
    } = this.props;
    const errors = validate(formValues || {}) || {};

    const signupFormInvalid =
      errors.firstName || errors.lastName || errors.dob || errors.sex
        ? true
        : false;

    const signinFormInvalid =
      errors.email || errors.password || errors.type ? true : false;
    const passwordResetFormInvalid = errors.email || errors.type ? true : false;

    let form;
    const dropdownOptions = [
      { value: "", primaryText: "" },
      { value: "student", primaryText: t("auth.student") },
      { value: "instructor", primaryText: t("auth.instructor") },
    ];
    const documentTypeOptions = [
      { value: "", primaryText: "" },
      { value: "en", primaryText: t("languages.english") },
      { value: "es", primaryText: t("languages.spanish") },
    ];
    const loginIsValid =
      ((!signinFormInvalid || this.state.isValid) && !formErrors.asyncError) ||
      false;
    const signupIsError = signupFormInvalid && !this.state.isValid;
    if (formIsSignup) {
      form = (
        <Aux>
          <div className={classes.header}>
            <Typography style={{ textAlign: "center" }} variant="h5">
              {t("auth.signUp")}
            </Typography>
            <div className={classes.steps}>
              <Steps
                completed={completed ? [0] : null}
                size="small"
                stepsLabels={["1", "2"]}
                activeStep={page - 1}
              />
            </div>
          </div>
          <Field
            name="firstName"
            error={errors.firstName}
            component={TextField}
            label={t("auth.firstName")}
          />
          <Field
            name="lastName"
            error={errors.lastName}
            component={TextField}
            label={t("auth.lastName")}
          />
          <Field
            error={errors.dob}
            name="dob"
            fullWidth
            component={DatePicker}
            type="date"
            maxDate={new Date(Date.now() - 31449600000 * 3)} //user must be atleast 3 years old
            options={{
              disableFuture: true,
              label: t("auth.dob"),
            }}
            handleChange={changeDOB}
          />
          <div className={classes.ButtonContainer}>
            <Button
              halfWidth
              type="submit"
              isDarkTheme={isDarkTheme}
              // disabled={pristine}
              isError={signupIsError}
              clicked={() => {
                if (signupFormInvalid || pristine) {
                  triggerSignupValidation();
                  this.setFormValidity(false);
                  return;
                }
                submitForm(true, false);
              }}
            >
              {t("auth.buttons.next")}
            </Button>
            <Button
              isDarkTheme={isDarkTheme}
              halfWidth
              clicked={() => {
                toggleLoginSubmitForm();
                this.setFormValidity(true);
              }}
            >
              {formIsSignup
                ? t("auth.buttons.switchToSignIn")
                : t("auth.buttons.switchToSignUp")}
            </Button>
          </div>
        </Aux>
      );
    } else {
      form = (
        <Aux>
          <div id="123" className={classes.header}>
            <Typography
              style={{ textAlign: "center", marginBottom: 30 }}
              gutterBottom
              variant="h5"
            >
              {t("auth.signIn")}
            </Typography>
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
            options={dropdownOptions}
            variant="outlined"
          />
          <GoogleLogin userType={formValues.type} />
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{
              position: 'relative',
              top: 11,
              background: isDarkTheme ? "#424242" : '#fff',
              display: 'inline-block',
              padding: '0 20px',
            }}>{t('auth.or')}</span>
            <div style={{ height: 3, background: '#2196f3' }}></div>
          </div>
          <Field
            name="email"
            error={errors.email}
            component={TextField}
            label={t("auth.email")}
          />
          <Field
            error={errors.password}
            name="password"
            component={TextField}
            label={t("auth.password")}
            type="password"
          />
          <div className="g-signin2" data-onsuccess="onSignIn"></div>
          <Typography align="center" color="secondary">
            {formErrors.accountSuspended}
          </Typography>
          {formErrors.type === t("auth.errors.notVerifiedCheckEmail") && (
            <div className={classes.ResendVerificationEmail}>
              <span
                onClick={() => {
                  resendVerificationEmail(formValues.email, formValues.type);
                  this.setFormValidity(true);
                }}
              >
                {t("auth.buttons.resendEmail")}
              </span>
            </div>
          )}
          <div className={classes.ButtonContainer}>
            <Button
              isDarkTheme={isDarkTheme}
              halfWidth
              isDarkTheme={isDarkTheme}
              isError={!loginIsValid}
              clicked={() => {
                if (signinFormInvalid || pristine) {
                  this.setFormValidity(false);
                  triggerSigninValidation();
                  return;
                }
                submitForm(false, false);
              }}
            >
              {formIsSignup
                ? t("auth.buttons.switchToSignIn")
                : t("auth.signIn")}
            </Button>

            <Button
              isDarkTheme={isDarkTheme}
              halfWidth
              clicked={() => {
                toggleLoginSubmitForm();
                this.setFormValidity(true);
              }}
            >
              {formIsSignup
                ? t("auth.buttons.switchToSignIn")
                : t("auth.buttons.switchToSignUp")}
            </Button>
          </div>
          <div style={{ margin: "15px 0" }}>
            <span
              className={classes.ForgotPassword}
              onClick={() => {
                forgotPassword();
                this.setFormValidity(true);
              }}
            >
              {t("auth.forgotPassword")}
            </span>
          </div>
        </Aux>
      );
    }
    if (formIsForgotPassword)
      form = (
        <Aux>
          <div className={classes.header}>
            <Typography
              style={{ textAlign: "center" }}
              gutterBottom
              variant="h5"
            >
              {t("auth.resetPassword")}
            </Typography>
          </div>
          <p>{t("auth.enterEmailToResetPassword")}</p>
          <Field
            name="email"
            error={errors.email}
            component={TextField}
            label={t("auth.email")}
          />
          <Field
            name="type"
            error={errors.type}
            component={DropdownSelect}
            label={t("auth.accountType")}
            options={dropdownOptions}
            variant="outlined"
          />
          <div className={classes.ButtonContainer}>
            <Button
              isDarkTheme={isDarkTheme}
              halfWidth
              clicked={(e) => {
                toggleLoginSubmitForm(e, "signin");
                this.setFormValidity(true);
              }}
            >
              {t("auth.buttons.returnToSignIn")}
            </Button>
            <Button
              isDarkTheme={isDarkTheme}
              halfWidth
              isError={passwordResetFormInvalid && !this.state.isValid}
              clicked={() => {
                if (passwordResetFormInvalid || pristine) {
                  this.setFormValidity(false);
                  triggerPasswordResetValidation();
                  return;
                }
                submitForm(false, true);
              }}
            >
              {t("auth.buttons.sendLink")}
            </Button>
          </div>
        </Aux>
      );
    //reset
    return (
      <Aux>
        <Spinner transparent active={loading} />
        {form}
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("authenticationForm")(state),
    formErrors: getFormSyncErrors("authenticationForm")(state),
    loading: state.authentication.loading,
    formIsSignup: state.authentication.formIsSignup,
    formIsForgotPassword: state.authentication.formIsForgotPassword,
    isDarkTheme: state.common.isDarkTheme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    triggerSignupValidation: () => {
      dispatch(touch("authenticationForm", "firstName"));
      dispatch(touch("authenticationForm", "lastName"));
      // dispatch(touch("authenticationForm", "sex"));
      dispatch(touch("authenticationForm", "dob"));
    },
    triggerSigninValidation: () => {
      dispatch(touch("authenticationForm", "email"));
      dispatch(touch("authenticationForm", "password"));
      dispatch(touch("authenticationForm", "type"));
    },
    triggerPasswordResetValidation: () => {
      dispatch(touch("authenticationForm", "email"));
      dispatch(touch("authenticationForm", "type"));
    },
    toggleLoginSubmitForm: (e, form) => {
      dispatch(actions.toggleForm(e, form));
      dispatch(destroy("authenticationForm"));
    },
    forgotPassword: () => {
      dispatch(actions.forgotPasswordPage());
      dispatch(destroy("authenticationForm"));
    },
    changeDOB: (date) => {
      dispatch(change("authenticationForm", "dob", date));
    },
    resendVerificationEmail: (email, accountType) => {
      dispatch(actions.resendEmailVerificationStart(email, accountType));
    },
  };
};

const wrappedForm = reduxForm({
  form: "authenticationForm",
  validate: validate,
  destroyOnUnmount: false,
  touchOnBlur: true,
})(withTranslation("common")(AuthenticationFormStepOne));

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
