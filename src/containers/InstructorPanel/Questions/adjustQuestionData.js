export const adjustQuestionData = (q) => {
  const foundSpeakingQuestion = (q || {}).speakingQuestion || {};
  let loadedQuestion = q;
  if ((q || {}).type === "speaking") {
    loadedQuestion = {
      ...q,
      speakingQuestion: [
        {
          question: foundSpeakingQuestion.question,
          questionRecordedBlob: foundSpeakingQuestion.audioQuestion
            ? foundSpeakingQuestion.audioQuestion
            : "",
          recordedBlob: foundSpeakingQuestion.audio
            ? foundSpeakingQuestion.audio
            : "",
          audioFileQuestion: foundSpeakingQuestion.audioQuestion,
          audioFile: foundSpeakingQuestion.audio,
          audioAnswer:
            foundSpeakingQuestion.audio && foundSpeakingQuestion.audio !== ""
              ? true
              : false,
          audioQuestion:
            foundSpeakingQuestion.audioQuestion &&
            foundSpeakingQuestion.audioQuestion !== ""
              ? true
              : false,
        },
      ],
    };
  }
  const foundFillBlankQuestion = (q || {}).fillBlankQuestions || {};
  const blanks = foundFillBlankQuestion.blanks || [];
  if ((q || {}).type === "fillInBlank") {
    loadedQuestion = {
      ...q,
      fillBlankQuestions: {
        question: foundFillBlankQuestion.question,
        answers: blanks.map((blank) => {
          // const incorAns = blank.incorrectAnswers || [];
          const incorrectAnswers =(blank.incorrectAnswers || [])
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
            answer: blank.correctAnswer,
            audioFile: blank.audio,
            browserAudioFile: blank.audio ? blank.audio : "",
            audio: blank.audio && blank.audio !== "" ? true : false,
            selectableAnswer: blank.selectableAnswer,
            answerOptions: incorrectAnswers,
          };
        }),
        correctAnswers: blanks.map((blank) => blank.correctAnswer),
      },
    };
  }
  return loadedQuestion;
};
