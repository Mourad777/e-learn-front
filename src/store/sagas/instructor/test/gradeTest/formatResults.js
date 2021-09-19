const getAdditionalNotes = (question) => {
  return ((question || {}).additionalNotes || "")
    .replace(/"/g, "'")
    .replace(/(\r\n|\n|\r)/gm, " ");
};

const getMarks = (question) => {
  return parseFloat((question || {}).marks || 0).toFixed(2);
};

export const formatResults = (formValues,feedbackAudioKeys) => {
  let formattedMultipleChoiceResults = "";
  ((formValues || {}).mcSection || []).forEach((question) => {
    formattedMultipleChoiceResults += `{ 
              marks: ${getMarks(question)}, 
              additionalNotes: "${getAdditionalNotes(question)}" }`;
  });

  let formattedEssayResults = "";
  ((formValues || {}).essaySection || []).forEach((question) => {
    formattedEssayResults += `{ 
                marks: ${getMarks(question)} , 
                additionalNotes: "${getAdditionalNotes(question)}", 
                instructorCorrection: "${(
                  (question || {}).instructorCorrection || ""
                ).replace(/"/g, "'")}",
                allowCorrection: ${(question || {}).allowCorrection || false}
               }`;
  });

  let formattedSpeakingResults = "";
  ((formValues || {}).speakingSection || []).forEach((question, index) => {
    formattedSpeakingResults += `{ 
                marks: ${getMarks(question)}, 
                additionalNotes: "${getAdditionalNotes(question)}",  
                feedbackAudio: ${JSON.stringify(
                  feedbackAudioKeys[index] || ""
                )} 
              }`;
  });

  let formattedFillBlankResults = "";
  ((formValues || {}).fillInBlankSection || []).forEach((question) => {
    formattedFillBlankResults += `{ 
            marks: ${getMarks(question)}, 
            additionalNotes: "${getAdditionalNotes(question)}" }`;
  });
  return {
    formattedMultipleChoiceResults,
    formattedEssayResults,
    formattedSpeakingResults,
    formattedFillBlankResults,
  };
};
