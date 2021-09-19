const validate = (values) => {
  const errors = {
    mc: false,
    essay: false,
    speaking: false,
    fillblanks: false,
    allAnswersFilled:true,
  };
  (values.mcQuestions || []).forEach((q) => {
    if (q.length === 0) {
      errors.mc = true;
      errors.allAnswersFilled = false;
    }
  });
  (values.essayQuestions || []).forEach((q) => {
    if (!q) {
      errors.essay = true;
      errors.allAnswersFilled = false;
    }
  });
  (values.speakingQuestions || []).forEach((q) => {
    if (!q.audioFile) {
      errors.speaking = true;
      errors.allAnswersFilled = false;
    }
  });

  ((values.fillBlankQuestions || {}).answers || []).forEach((q) => {
    if (!q || q === "Select the correct answer") {
      errors.fillblanks = true;
      errors.allAnswersFilled = false;
    }
  });
  return errors;
};

export default validate;
