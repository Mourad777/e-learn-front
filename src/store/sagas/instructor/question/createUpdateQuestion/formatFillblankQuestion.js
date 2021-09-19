export const formatFillblankQuestion = (
  formData,
  answers,
  fillInTheBlanksAudioKeys
) => {
  let formattedFillBlankQuestion = "";
  ((formData.fillBlankQuestions || {}).answers || []).map((item, index) => {
    const incorrectOptions = Object.values(answers[index].answerOptions || {});
    formattedFillBlankQuestion += `{ 
               incorrectAnswers: ${JSON.stringify(
                 (answers[index] || {}).selectableAnswer
                   ? incorrectOptions
                   : ["", "", ""]
               )}, 
               correctAnswer: "${((answers[index] || {}).answer || "").replace(
                 /"/g,
                 "'"
               )}", 
               selectableAnswer: ${
                 (answers[index] || {}).selectableAnswer || false
               }, 
               audio: ${JSON.stringify(fillInTheBlanksAudioKeys[index]) || ""},
               }`;
  });
  return formattedFillBlankQuestion;
};
