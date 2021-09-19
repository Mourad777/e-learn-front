import i18n from "../../../../i18n/index"

const validate = (values = {}) => {
  let minValue = 0;
  if (!!values.minGrade) {
    minValue = values.minGrade
  }
  const errors = {};
  let isValid = true;
  if (
    (parseFloat(values.gradeAdjusted) > 100 ||
      parseFloat(values.gradeAdjusted) < minValue) && values.gradeOverride
  ) {
    errors.gradeAdjusted = i18n.t("gradeBook.errors.finalGrade", {
      minValue
    });
    isValid = false;
  }
  if (
    (parseFloat(values.autoGrade) > 100 ||
      parseFloat(values.autoGrade) < minValue) && !values.gradeOverride
  ) {
    errors.gradeAdjusted = i18n.t("gradeBook.errors.finalGrade", {
      minValue
    });
    isValid = false;
  }
  if (
    values.gradeOverride && !values.gradeAdjusted
  ) {
    errors.gradeAdjusted = i18n.t("gradeBook.errors.required");
    isValid = false;
  }

  errors.isValid = isValid;
  return errors;
};

export default validate;
