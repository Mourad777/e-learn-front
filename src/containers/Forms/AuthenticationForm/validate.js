import { store } from "../../../index";
import i18n from "../../../i18n/index";

export const validate = (formValues = {}) => {
  const signupState = store.getState().authentication.formIsSignup;
  const errors = {};
  const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const namePatternAccents = /^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g;
  if (!formValues.firstName) {
    errors.firstName = i18n.t("auth.errors.enterFirstName");
  }
  if (!formValues.lastName) {
    errors.lastName = i18n.t("auth.errors.enterLastName");
  }

  if (!/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g.test(formValues.firstName)) {
    errors.firstName = i18n.t("auth.errors.enterFirstNameOnlyAlpha");
  }
  if (!/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g.test(formValues.lastName)) {
    errors.lastName = i18n.t("auth.errors.enterLastNameOnlyAlpha");
  }

  if (!formValues.type) {
    errors.type = i18n.t("auth.errors.makeSelection");
  }

  if (!formValues.dob) {
    errors.dob = i18n.t("auth.errors.enterDateOfBirth");
  }

  if (!emailPattern.test(formValues.email)) {
    errors.email = i18n.t("auth.errors.enterValidEmail");
  }
  if (!formValues.email) {
    errors.email = i18n.t("auth.errors.required");
  }

  if (!passwordPattern.test(formValues.password) && signupState) {
    errors.password = i18n.t("auth.errors.passwordConditions");
  }

  if (!formValues.password && !signupState) {
    errors.password = i18n.t("auth.errors.required");
  }

  if (!formValues.confirmPassword) {
    errors.confirmPassword = i18n.t("auth.errors.required");
  } else if (formValues.confirmPassword !== formValues.password) {
    errors.confirmPassword = i18n.t("auth.errors.passwordMismatched");
  }

  return errors;
};
