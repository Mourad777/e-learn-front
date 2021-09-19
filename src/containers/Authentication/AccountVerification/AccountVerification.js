import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import Button from "@material-ui/core/Button";
import classes from "./AccountVerification.module.css";
import * as actions from "../../../store/actions/index";
import Typography from "@material-ui/core/Typography";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { validate } from "./validate";
import {
  Field,
  reduxForm,
  getFormSyncErrors,
  getFormValues,
  touch,
} from "redux-form";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useTranslation } from "react-i18next";

export const VerifyAccount = ({ formErrors, formValues, resendVerificationEmail, history, touchField, verifyAccount, match, forgotPasswordPage, loading }) => {

  const { t } = useTranslation("common");
  const [isTokenExpired,setIsTokenExpired] = useState(false);
  useEffect(()=>{
    if(formErrors.isTokenExpired) {
      setIsTokenExpired(true)
    }
  },[formErrors])
  const onSubmit = () => {
    touchField("password");
    const errors = validate(formValues);
    if (errors.password) return;
    verifyAccount(
      (formValues || {}).password,
      match.params.token,
      match.params.accountType,
      history,
    );
  };

  const onLoginPage = () => {
    history.push("/authentication");
  };

  const handleForgotPasswordPage = (event) => {
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("profilePicture");
    localStorage.removeItem("refreshTokenExpiration");
    history.push("/authentication");
    forgotPasswordPage();
  };


  const form = (
    <div>
      {isTokenExpired && (
        <Typography align="center" gutterBottom variant="subtitle1" color="error">{t('auth.errors.tokenExpired')}</Typography>
      )}
      <Spinner transparent active={loading} />
      <Field
        name="password"
        component={TextField}
        label={t("auth.password")}
        type="password"
        disabled={isTokenExpired}
      />
      {isTokenExpired && (
        <Field
          name="email"
          component={TextField}
          label={t("auth.email")}
        />
      )}
      <div className={classes.ButtonContainer}>
        {(formErrors.password || "").includes(
          "alreadyVerified"
        ) ? (
          <Button color="primary" onClick={onLoginPage}>{t("auth.signIn")}</Button>
        ) : (
          <Button disabled={isTokenExpired} color="primary" onClick={onSubmit}>{t("auth.buttons.verifyAccount")}</Button>
        )}
      </div>






      {(isTokenExpired === true) && (
        <div style={{
          color: '#2196f3',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: 15,
          padding: 5,
          border: '#2196f3 2px solid',
          borderRadius: 2,
        }}>
          <span
            onClick={() => {
              resendVerificationEmail(formValues.email, formValues.type);
            }}
          >
            {t("auth.buttons.resendEmail")}
          </span>
        </div>
      )
      }




      {!isTokenExpired && (
        <div style={{ margin: "15px 0" }}>
          <span
            style={{
              color: "#2196f3",
              textAlign: "left",
              cursor: "pointer",
              margin: "15px 0",
            }}
            onClick={handleForgotPasswordPage}
          >
            {t("auth.forgotPassword")}
          </span>
        </div>
      )}
    </div >
  );
  return (
    <Card>
      <CardContent>
        <Typography align="center" style={{ margin: "20px 0" }} variant="h5">
          {t("auth.accountVerification")}
        </Typography>
        {form}
      </CardContent>
    </Card>
  );

}

const mapStateToProps = (state,myProps) => {
  const userType = myProps.match.params.accountType;
  return {
    formValues: getFormValues("verifyAccount")(state),
    formErrors: getFormSyncErrors("verifyAccount")(state),
    loading: state.authentication.loading,
    formValues: getFormValues("verifyAccount")(state),
    formErrors: getFormSyncErrors("verifyAccount")(state),
    initialValues:{
      type:userType,
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    verifyAccount: (password, token, accountType, history) =>
      dispatch(actions.accountVerificationStart(password, token, accountType, history)),
    resendVerificationEmail: (email, accountType) => {
      dispatch(actions.resendEmailVerificationStart(email, accountType));
    },
    forgotPasswordPage: () => {
      dispatch(actions.forgotPasswordPage());
    },
    touchField: (field) => {
      dispatch(touch("verifyAccount", field));
    },

  };
};

const wrappedForm = reduxForm({
  form: "verifyAccount",
  destroyOnUnmount: true,
  touchOnBlur: true,
  validate,
})(VerifyAccount);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
