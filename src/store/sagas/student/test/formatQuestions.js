export const formatQuestions = (formValues, test, answerAudioKeys) => {
  let formattedMultipleChoiceAnswers = "";
  ((test || {}).multipleChoiceQuestions || []).map((item, index) => {
    let answerList;
    if (((formValues || {}).mcQuestions || [])[index]) {
      answerList = ((formValues || {}).mcQuestions || [])[index];
    } else {
      answerList = item.answerOptions.map((item) => "");
    }
    (answerList || []).forEach((answer) => answer.replace(/"/g, "'"));
    formattedMultipleChoiceAnswers += `{ questionNumber: ${
      index + 1
    } , answers: ${JSON.stringify(answerList)} }`;
  });

  let formattedEssayAnswers = "";
  ((test || {}).essayQuestions || []).map((item, index) => {
    const answer = ((formValues || {}).essayQuestions || [])[index];
    formattedEssayAnswers += `{ questionNumber: ${index + 1} , answer: "${(
      answer || ""
    ).replace(/"/g, "'")}" }`;
  });

  let formattedSpeakingAnswers = "";
  ((test || {}).speakingQuestions || []).map((item, index) => {
    formattedSpeakingAnswers += `{ questionNumber: ${
      index + 1
    } , answer: ${JSON.stringify(answerAudioKeys[index] || "")} }`;
  });

  let formattedFillBlankAnswers = "";
  (((formValues || {}).fillBlankQuestions || {}).answers || []).map(
    (item, index) => {
      formattedFillBlankAnswers += `{ questionNumber: ${
        index + 1
      } , answer: "${(item || "").replace(/"/g, "'").trim()}" }`;
    }
  );
  return {
    formattedMultipleChoiceAnswers,
    formattedEssayAnswers,
    formattedSpeakingAnswers,
    formattedFillBlankAnswers,
  };
};
