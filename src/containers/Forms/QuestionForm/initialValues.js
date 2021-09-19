export const getInitialValues = (creatingQuestionType) => {
  const defaultFillBlankText =
    '<p>Highlight a <mark class="marker-yellow">piece of text</mark> to create a blank.</p>';
  let initialValues = {
    difficulty: "medium",
    language: "english",
  };
  if (creatingQuestionType === "mc")
    initialValues = {
      ...initialValues,
      mcQuestion: {
        answers: ["option 1", "option 2"],
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
          { marks: 1, selectableAnswer: false, answer: "piece of text" },
        ],
        correctAnswers: ["piece of text"],
      },
    };
  return initialValues;
};
