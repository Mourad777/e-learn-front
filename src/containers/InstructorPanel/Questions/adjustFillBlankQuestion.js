export const adjustFillblankQuestion = (question) => {
  const blanksList = (question.fillBlankQuestions || {}).blanks || [];
  const answers = blanksList.map((item, index) => {
    const isAudio = item.audio && item.audio !== "";
    const answerOptions =(item.incorrectAnswers || [])
    .filter(i=>i)
    .reduce(function (
      result,
      item,
      index,
    ) {
      let propNumber;
      if (index === 0) propNumber = "One";
      if (index === 1) propNumber = "Two";
      if (index === 2) propNumber = "Three";
      result[`incorrectAnswer${propNumber}`] = item;
      return result;
    },
    {});
    return {
      answer: item.correctAnswer,
      selectableAnswer: item.selectableAnswer,
      answerOptions:answerOptions,
      marks: 1,
      audio: isAudio,
      browserAudioFile: isAudio ? item.audio : "",
      audioFile: isAudio ? item.audio : null,
    };
  });
  return {
    question: (question.fillBlankQuestions || {}).question,
    answers: answers,
    correctAnswers: blanksList.map((item) => item.correctAnswer),
  };
};
