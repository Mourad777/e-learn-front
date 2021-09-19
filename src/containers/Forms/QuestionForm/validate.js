import i18n from "../../../i18n/index"

const validate = (values) => {
  const errors = {
    mcQuestion: {},
    essayQuestion: {},
    speakingQuestion: [{}],
    fillBlankQuestions: {},
  };
  const checkDuplicates = (arr) => {
    const duplicates = (arr || []).reduce((acc, el, i, arr) => {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
      return acc;
    }, []);
    return duplicates;
  };
  //mc question form
  if (values.mcQuestion) {
    const mcq = values.mcQuestion;
    if (!values.mcQuestion.question) {
      errors.mcQuestion.question = i18n.t("questionForm.errors.required");
    }
    let correctAnswersError;
    if (
      ((mcq.answers || []).includes(undefined) ||
        (mcq.answers || []).includes("")) &&
      (mcq.answers || []).length > 1
    ) {
      correctAnswersError = i18n.t("questionForm.errors.answersCantBeEmpty");
    }
    if ((mcq.answers || []).length < 2) {
      correctAnswersError = i18n.t("questionForm.errors.atleastTwoAnswers");
    }
    if (
      (mcq.answers || []).length === (mcq.correctAnswers || []).length &&
      (mcq.answers || []).length > 1
    ) {
      correctAnswersError = i18n.t("questionForm.errors.atleastOneUnchecked");
    }

    if (
      (!mcq.correctAnswers || (mcq.correctAnswers || []).length === 0) &&
      (mcq.answers || []).length > 1
    ) {
      correctAnswersError = i18n.t("questionForm.errors.selectAtleastOneAnswer");
    }
    const trimmedAnswers = (mcq.answers || []).map((item) =>
      (item || "").trim()
    );
    const duplicates = checkDuplicates(trimmedAnswers);
    if ((mcq.answers || []).length > 1 && (duplicates || []).length > 0) {
      correctAnswersError = i18n.t("questionForm.errors.answersDifferent");
    }
    errors.mcQuestion.correctAnswers = correctAnswersError;
    if (correctAnswersError || errors.mcQuestion.question) {
      errors.mcQuestionError = true;
    }
  }
  //essay question form
  if (values.essayQuestion) {
    if (!values.essayQuestion.question) {
      errors.essayQuestion.question = i18n.t("questionForm.errors.required");
      errors.essayQuestionError = true;
    }
  }
  //speaking question form
  if (values.speakingQuestion) {
    const speakingQuestion = (values.speakingQuestion || {})[0] || {};
    if (!speakingQuestion.question && !speakingQuestion.audioQuestion) {
      errors.speakingQuestion[0].question =
      i18n.t("questionForm.errors.requiredOrMakeAudioQuestion");
    }
    if (
      !speakingQuestion.questionRecordedBlob &&
      speakingQuestion.audioQuestion
    ) {
      errors.speakingQuestion[0].questionRecordedBlob =
      i18n.t("questionForm.errors.requiredOrMakeTextQuestion");
    }
    if (
      speakingQuestion.audioFileQuestion instanceof File &&
      speakingQuestion.audioFileQuestion.size > values.instructorFileSizeLimit * 1000 * 1000 && 
      speakingQuestion.audioQuestion
    ) {
      errors.speakingQuestion[0].questionRecordedBlob =
        `${i18n.t("questionForm.errors.audioCannotExceed")} ${values.instructorFileSizeLimit}MB`;
    }
    if (
      speakingQuestion.audioFile instanceof File &&
      speakingQuestion.audioFile.size > values.instructorFileSizeLimit * 1000 * 1000 &&
      speakingQuestion.audioAnswer
    ) {
      errors.speakingQuestion[0].recordedBlob =
        `${i18n.t("questionForm.errors.audioCannotExceed")} ${values.instructorFileSizeLimit}MB`;
    }
    if (!speakingQuestion.recordedBlob && speakingQuestion.audioAnswer) {
      errors.speakingQuestion[0].recordedBlob =
      i18n.t("questionForm.errors.requiredOrDisableAudioAnswer") 
    }
    if (
      errors.speakingQuestion[0].question ||
      errors.speakingQuestion[0].questionRecordedBlob ||
      errors.speakingQuestion[0].recordedBlob
    ) {
      errors.speakingQuestionError = true;
    }
  }
  //fill-in-the-blanks question form is validated in by the test form validator
  return errors;
};

export default validate;
