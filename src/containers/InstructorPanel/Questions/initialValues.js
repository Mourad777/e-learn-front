export const getInitialValues = (creatingQuestionType,t) => {
  const defaultFillBlankText =
  t("questionForm.fillblanksSectionDefaultText");
  let initialValues = {
    difficulty: "medium",
    language: t("questionForm.english"),
  };
  if (creatingQuestionType === "mc")
    initialValues = {
      ...initialValues,
      mcQuestion: {
        answers: [`${t("questionForm.option")} 1`, `${t("questionForm.option")} 2`],
        correctAnswers: ["1"],
      },
    };
  if (creatingQuestionType === "essay")
    initialValues = {
      ...initialValues,
      essayQuestion: {
        question: "",
      },
    };
  if (creatingQuestionType === "speaking")
    initialValues = {
      ...initialValues,
      speakingQuestion: [
        {
          audioAnswer: false,
          audioQuestion: false,
        },
      ],
    };
  if (creatingQuestionType === "fillInBlank")
    initialValues = {
      ...initialValues,
      fillBlankQuestions: {
        question: defaultFillBlankText,
        answers: [
          { marks: 1, selectableAnswer: false, answer:t("questionForm.pieceOfText") },
        ],
        correctAnswers: [t("questionForm.pieceOfText")],
      },
    };
  return initialValues;
};
