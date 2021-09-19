import  {adjustFillblankQuestion} from "./adjustFillBlankQuestion"

export const addQuestionToTest = (question, index, onAddQToTest, onBlockSync) => {
  if (question.type === "mc")
    onAddQToTest(`mcQuestions.${index}`, {...question.mcQuestion,marks:1});
  if (question.type === "essay")
    onAddQToTest(`essayQuestions.${index}`, {...question.essayQuestion,marks:1});
  if (question.type === "speaking") {
    const fixedQuestion = {
      questionRecordedBlob:
        (question.speakingQuestion || {}).audioQuestion &&
        (question.speakingQuestion || {}).audioQuestion !== ""
          ? (question.speakingQuestion || {}).audioQuestion
          : "",
      recordedBlob:
        (question.speakingQuestion || {}).audio &&
        (question.speakingQuestion || {}).audio !== ""
          ? (question.speakingQuestion || {}).audio
          : "",
      question: (question.speakingQuestion || {}).question,
      audioAnswer: (question.speakingQuestion || {}).audio ? true : false,
      audioQuestion: (question.speakingQuestion || {}).audioQuestion
        ? true
        : false,
      audioFile: (question.speakingQuestion || {}).audio,
      audioFileQuestion: (question.speakingQuestion || {}).audioQuestion,
      marks: 1,
    };
    onAddQToTest(`speakingQuestions.${index}`, fixedQuestion);
  }
  if (question.type === "fillInBlank") {
    const fixedQuestion = adjustFillblankQuestion(question);
    onAddQToTest("fillBlankQuestions", fixedQuestion);
    onBlockSync();
  }
};