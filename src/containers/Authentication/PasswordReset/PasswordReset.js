import React, { useEffect, useState } from "react";
import {
  Field,
  reduxForm,
  getFormSyncErrors,
  getFormValues,
  touch,
} from "redux-form";
import { connect } from "react-redux";
import { validate } from "./validate";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import Button from "../../../components/UI/Button/Button";
import classes from "./PasswordReset.module.css";
import * as actions from "../../../store/actions/index";
import Typography from "@material-ui/core/Typography";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { useTranslation } from "react-i18next";

const PasswordReset = ({ formErrors, triggerPasswordResetValidation, formValues, loading, logout, submitNewPassword, match, history }) => {
  const [isValid, setIsValid] = useState(true)
  const { t } = useTranslation('common')
  const setFormValidity = (isValid) => {
    setIsValid(isValid)
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) logout()
  }, [])

  const onSubmit = () => {
    const formInvalid = formErrors.password || formErrors.confirmPassword;
    if (formInvalid) {
      setIsValid(false)
      return;
    }
    submitNewPassword(
      formValues,
      match.params.token,
      match.params.accountType,
      history,
    );
  };


  const formInvalid = formErrors.password || formErrors.confirmPassword;
  const form = (
    <div>
      <Spinner transparent active={loading} />
      <Field
        name="password"
        component={TextField}
        label={t("account.newPassword")}
        type="password"
      />
      <Field
        name="confirmPassword"
        component={TextField}
        label={t("account.confirmPassword")}
        type="password"
      />
      <div className={classes.ButtonContainer}>
        <Button
          isError={!isValid && formInvalid}
          btnType="SubmitForm"
          clicked={() => {
            if (formInvalid) {
              triggerPasswordResetValidation();
              setFormValidity(false);
              return;
            }
            onSubmit();
          }}
        >
          {t("account.buttons.setNewPassword")}
        </Button>
      </div>
    </div>
  );
  return (
    <div className={classes.Auth}>
      <Typography style={{ margin: "20px 0" }} variant="h5">
        {t("account.passwordReset")}
      </Typography>
      {form}
    </div>
  );

}

const mapStateToProps = (state) => {
  return {
    loading: state.authentication.loading,
    error: state.authentication.error,
    isAuthenticated: state.authentication.token !== null,
    authRedirectPath: state.authentication.authRedirectPath,
    formValues: getFormValues("passwordReset")(state),
    formErrors: getFormSyncErrors("passwordReset")(state),
    token: state.authentication.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitNewPassword: (formValues, token, accountType,history) =>
      dispatch(actions.changePasswordStart(formValues, token, accountType, history)),
    logout: () =>
      dispatch(actions.logout()),
    triggerPasswordResetValidation: () => {
      dispatch(touch("passwordReset", "password"));
      dispatch(touch("passwordReset", "confirmPassword"));
    },
  };
};

const wrappedForm = reduxForm({
  form: "passwordReset",
  validate: validate,
  destroyOnUnmount: true,
  touchOnBlur: true,
})(PasswordReset);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);