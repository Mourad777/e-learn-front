import i18n from "../../../../../i18n/index";

export const validate = (formValues = {}) => {
  const errors = {};
  if (!(formValues.configuration || {}).isPasswordRequiredStartTest) return errors;
  if (!formValues.password) {
    errors.password = i18n.t("confirmations.takeTest.required");
  }

  return errors;
};
