import i18n from "../../i18n/index"

const validate = (formValues = {}) => {
  const errors = {};
  errors.isValid = true
  if (!(formValues.coursePassGrade > 0 && formValues.coursePassGrade <= 100)) {
    errors.coursePassGrade = i18n.t("config.errors.greaterThanZeroLessThanEqualOneHundred");
    errors.isValid = false
  }

  if(formValues.isDropCoursePenalty){
    if (!(formValues.dropCourseGrade < formValues.coursePassGrade)) {
      errors.dropCourseGrade = i18n.t("config.errors.dropGradeLessThanPassGrade");
      errors.coursePassGrade = i18n.t("config.errors.passGradeMoreThanDropGrade");
      errors.isValid = false
    }
    if (!(formValues.dropCourseGrade >= 0 && formValues.dropCourseGrade < 100)) {
      errors.dropCourseGrade = i18n.t("config.errors.greaterEqualToZeroLessThanOneHundred");
      errors.isValid = false
    }
  }
  if(formValues.isInstructorCoursesLimit) {
    if (!( Number.isInteger(parseFloat(formValues.instructorCoursesLimit)) && (formValues.instructorCoursesLimit >= 1 && formValues.instructorCoursesLimit <= 100) )) {
      errors.instructorCoursesLimit = i18n.t("config.errors.intGreaterThanEqualOneLessThanEqualOneHundred");
      errors.isValid = false
    }
  }

  if (!(formValues.studentFileSizeLimit >= 0.1 && formValues.studentFileSizeLimit <= 1000)) {
    errors.studentFileSizeLimit = i18n.t("config.errors.greaterThanEqualPointOneLessThanEqualOneThousand");
    errors.isValid = false
  }


  if (!(formValues.instructorFileSizeLimit >= 0.1 && formValues.instructorFileSizeLimit <= 1000)) {
    errors.instructorFileSizeLimit = i18n.t("config.errors.greaterThanEqualPointOneLessThanEqualOneThousand");
    errors.isValid = false
  }

  if (!(formValues.voiceRecordTimeLimit >= 1 && formValues.voiceRecordTimeLimit <= 1000)) {
    errors.voiceRecordTimeLimit = i18n.t("config.errors.greaterThanEqualOneLessThanEqualOneThousand");
    errors.isValid = false
  }

  return errors;
};

export default validate