import i18n from "../../../i18n/index";

const validate = (values = {}) => {
  const errors = {
    slides: [],
    isValid: true,
  };
  if (!values.lessonName || !(values.lessonName||'').trim()) {
    errors.isValid = false;
    errors.lessonName = i18n.t("lessonForm.errors.required");
  }
  Array.from(values.lessons || []).forEach((lesson) => {
    if (
      values._id !== lesson._id &&
      (lesson.lessonName || "").toLowerCase().trim() ===
        (values.lessonName || "").toLowerCase().trim()
    ) {
      errors.isValid = false;
      errors.lessonName = i18n.t("lessonForm.errors.noDuplicateLessonNames");
    }
  });
  const courseStart = parseInt((values.course || {}).courseStartDate);
  const courseEnd = parseInt((values.course || {}).courseEndDate);
  const availableOn = new Date(values.availableOnDate).getTime();
  if (
    courseStart &&
    courseEnd &&
    availableOn &&
    (!(availableOn > courseStart) || !(availableOn < courseEnd))
  ) {
    errors.availableOnDate = i18n.t(
      "lessonForm.errors.availableOnDateInCourseDuration"
    );
    errors.isValid = false;
  }
  errors.slides = Array.from(values.slides || {}).map((slide) => {
    const slideErrors = {};
    if (!slide.slideContent && !slide.videoContent) {
      errors.isValid = false;
      slideErrors.slideContent = i18n.t("lessonForm.errors.required");
    }
    if (!slide.loadedVideo && slide.videoContent) {
      errors.isValid = false;
      slideErrors.videoFile = i18n.t("lessonForm.errors.uploadOrDisable");
    }

    if (
      slide.audioFile instanceof File &&
      slide.audioUpload &&
      (slide.audioFile || {}).size >
        values.instructorFileSizeLimit * 1000 * 1000
    ) {
      errors.isValid = false;

      slideErrors.audioFile = `${i18n.t("lessonForm.errors.audioCannotExceed")} ${
        values.instructorFileSizeLimit
      }MB`;
    }

    if (
      slide.videoFile instanceof File &&
      slide.videoContent &&
      (slide.videoFile || {}).size >
        values.instructorFileSizeLimit * 1000 * 1000
    ) {
      errors.isValid = false;

      slideErrors.videoFile = `${i18n.t("lessonForm.errors.videoCannotExceed")} ${
        values.instructorFileSizeLimit
      }MB`;
    }
    if(!slideErrors.videoFile && !slideErrors.audioFile && !slideErrors.slideContent){
      return null
    }
    return slideErrors;
  });
 
  return errors;
};

export default validate;
