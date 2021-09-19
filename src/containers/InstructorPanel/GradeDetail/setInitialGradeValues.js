const setInitialGradeValues = (
  testResult,
  instructorTest,
) => {
  if(!testResult || !instructorTest)return {}
  const gradingInProgress = testResult.gradingInProgress;
  const testGraded = testResult.graded;
  const userMcAnswers = (testResult.multiplechoiceSection || {}).answers;
  const userFillBlanksAnswers = (testResult.fillInBlanksSection || {}).answers;

  const mcSectionMarks = ((instructorTest || {}).multipleChoiceQuestions || []).map(
    (question, qIdx) => {
      const qAtIdx =
        ((testResult.multiplechoiceSection || {}).answers || [])[qIdx] || {};
      if (gradingInProgress || testGraded){
        return {
          marks: qAtIdx.marks,
          additionalNotes: qAtIdx.additionalNotes,
        };
      }
      const correctAnswers = ((question || {}).answerOptions || []).filter(
        (answer, index) => {
          if (
            ((question || {}).correctAnswers || []).includes(
              (index + 1).toString()
            )
          ) {
            return answer;
          }
        }
      );
      function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }
      const compareAnswers = arraysEqual(
        correctAnswers,
        (
          (userMcAnswers || []).find(
            (item) => item.questionNumber === qIdx + 1
          ) || {}
        ).answers || []
      );
      if (compareAnswers) {
        return { marks: (question || {}).marks };
      } else {
        return { marks: 0 };
      }
    }
  );

  const essaySectionMarks = ((instructorTest || {}).essayQuestions || []).map(
    (question, qIdx) => {
      const qAtIdx =
        ((testResult.essaySection || {}).answers || [])[qIdx] || {};
      if (gradingInProgress || testGraded)
        return {
          marks: qAtIdx.marks,
          additionalNotes: qAtIdx.additionalNotes,
          instructorCorrection: qAtIdx.instructorCorrection,
          allowCorrection: qAtIdx.allowCorrection,
        };
      return {
        marks: 0,
        instructorCorrection: qAtIdx.answer,
      };
    }
  );

  const speakingSectionMarks = ((instructorTest || {}).speakingQuestions || []).map(
    (question, qIdx) => {
      const qAtIdx =
        ((testResult.speakingSection || {}).answers || [])[qIdx] || {};
      if (gradingInProgress || testGraded)
        return {
          marks: qAtIdx.marks,
          additionalNotes: qAtIdx.additionalNotes,
          recordedBlob: qAtIdx.feedbackAudio ? qAtIdx.feedbackAudio : "",
          audioFile: qAtIdx.feedbackAudio || "",
        };
      return { marks: 0 };
    }
  );

  const fillInBlankSectionMarks = (
    ((instructorTest || {}).fillInBlanksQuestions || {}).blanks || []
  ).map((question, qIdx) => {
    const qAtIdx =
      ((testResult.fillInBlanksSection || {}).answers || [])[qIdx] || {};
    if (gradingInProgress || testGraded)
      return {
        marks: qAtIdx.marks,
        additionalNotes: qAtIdx.additionalNotes,
      };
    if (
      ((question || {}).correctAnswer || "").toLowerCase() ===
      (
        (
          (userFillBlanksAnswers || []).find(
            (item) => item.questionNumber === qIdx + 1
          ) || {}
        ).answer || ""
      ).toLowerCase()
    ) {
      return { marks: (question || {}).marks };
    } else {
      return { marks: 0 };
    }
  });

  const latePenalty = () => {
    if (gradingInProgress || testGraded) return testResult.latePenalty || 0;
    if (!(instructorTest || {}).assignment) return;
    if (!(instructorTest || {}).allowLateSubmission) return;
    if (parseInt(testResult.submittedOn) < parseInt((instructorTest || {}).dueDate))
      return;
    const timeStampDifference =
      parseInt(testResult.submittedOn) - parseInt((instructorTest || {}).dueDate);
    const daysLate = timeStampDifference / (1000 * 60 * 60 * 24);
    return Math.ceil(daysLate) * (instructorTest || {}).latePenalty;
  };

  return {
    mcSection: mcSectionMarks,
    essaySection: essaySectionMarks,
    speakingSection: speakingSectionMarks,
    fillInBlankSection: fillInBlankSectionMarks,
    latePenalty: latePenalty(),
    gradeOverride: testResult.gradeOverride,
    gradeAdjustmentExplanation: testResult.gradeOverride
      ? testResult.gradeAdjustmentExplanation
      : null,
    gradeAdjusted: testResult.gradeOverride ? testResult.grade : null,
  };
};

export default setInitialGradeValues;








//////////////
// const setInitialGradeValues = (
//   result,
//   testResults = [],
//   instructorTest,
// ) => {
//   let test;
//   if (testResults.length > 0) {
//     test = (
//       Array.from(testResults).find(
//         (item) => item.test._id === result.test._id
//       ) || {}
//     ).test;
//   }
//   if (instructorTest) {
//     test = instructorTest;
//   }
//   const testResult = (result || {}).testResult || {};
//   const gradingInProgress = testResult.gradingInProgress;
//   const testGraded = testResult.graded;
//   const userMcAnswers = (testResult.multiplechoiceSection || {}).answers;
//   const userFillBlanksAnswers = (testResult.fillInBlanksSection || {}).answers;
//   const mcSectionMarks = ((test || {}).multipleChoiceQuestions || []).map(
//     (question, qIdx) => {
//       const qAtIdx =
//         ((testResult.multiplechoiceSection || {}).answers || [])[qIdx] || {};
//       if (gradingInProgress || testGraded){
//         return {
//           marks: qAtIdx.marks,
//           additionalNotes: qAtIdx.additionalNotes,
//         };
//       }
//       const correctAnswers = ((question || {}).answerOptions || []).filter(
//         (answer, index) => {
//           if (
//             ((question || {}).correctAnswers || []).includes(
//               (index + 1).toString()
//             )
//           ) {
//             return answer;
//           }
//         }
//       );
//       function arraysEqual(a, b) {
//         if (a === b) return true;
//         if (a == null || b == null) return false;
//         if (a.length != b.length) return false;

//         for (var i = 0; i < a.length; ++i) {
//           if (a[i] !== b[i]) return false;
//         }
//         return true;
//       }
//       const compareAnswers = arraysEqual(
//         correctAnswers,
//         (
//           (userMcAnswers || []).find(
//             (item) => item.questionNumber === qIdx + 1
//           ) || {}
//         ).answers || []
//       );
//       if (compareAnswers) {
//         return { marks: (question || {}).marks };
//       } else {
//         return { marks: 0 };
//       }
//     }
//   );

//   const essaySectionMarks = ((test || {}).essayQuestions || []).map(
//     (question, qIdx) => {
//       const qAtIdx =
//         ((testResult.essaySection || {}).answers || [])[qIdx] || {};
//       if (gradingInProgress || testGraded)
//         return {
//           marks: qAtIdx.marks,
//           additionalNotes: qAtIdx.additionalNotes,
//           instructorCorrection: qAtIdx.instructorCorrection,
//           allowCorrection: qAtIdx.allowCorrection,
//         };
//       return {
//         marks: 0,
//         instructorCorrection: qAtIdx.answer,
//       };
//     }
//   );

//   const speakingSectionMarks = ((test || {}).speakingQuestions || []).map(
//     (question, qIdx) => {
//       const qAtIdx =
//         ((testResult.speakingSection || {}).answers || [])[qIdx] || {};
//       if (gradingInProgress || testGraded)
//         return {
//           marks: qAtIdx.marks,
//           additionalNotes: qAtIdx.additionalNotes,
//           recordedBlob: qAtIdx.feedbackAudio ? qAtIdx.feedbackAudio : "",
//           audioFile: qAtIdx.feedbackAudio || "",
//         };
//       return { marks: 0 };
//     }
//   );

//   const fillInBlankSectionMarks = (
//     ((test || {}).fillInBlanksQuestions || {}).blanks || []
//   ).map((question, qIdx) => {
//     const qAtIdx =
//       ((testResult.fillInBlanksSection || {}).answers || [])[qIdx] || {};
//     if (gradingInProgress || testGraded)
//       return {
//         marks: qAtIdx.marks,
//         additionalNotes: qAtIdx.additionalNotes,
//       };
//     if (
//       ((question || {}).correctAnswer || "").toLowerCase() ===
//       (
//         (
//           (userFillBlanksAnswers || []).find(
//             (item) => item.questionNumber === qIdx + 1
//           ) || {}
//         ).answer || ""
//       ).toLowerCase()
//     ) {
//       return { marks: (question || {}).marks };
//     } else {
//       return { marks: 0 };
//     }
//   });

//   const latePenalty = () => {
//     if (gradingInProgress || testGraded) return testResult.latePenalty || 0;
//     if (!(test || {}).assignment) return;
//     if (!(test || {}).allowLateSubmission) return;
//     if (parseInt(testResult.submittedOn) < parseInt((test || {}).dueDate))
//       return;
//     const timeStampDifference =
//       parseInt(testResult.submittedOn) - parseInt((test || {}).dueDate);
//     const daysLate = timeStampDifference / (1000 * 60 * 60 * 24);
//     return Math.ceil(daysLate) * (test || {}).latePenalty;
//   };

//   return {
//     mcSection: mcSectionMarks,
//     essaySection: essaySectionMarks,
//     speakingSection: speakingSectionMarks,
//     fillInBlankSection: fillInBlankSectionMarks,
//     latePenalty: latePenalty(),
//     gradeOverride: testResult.gradeOverride,
//     gradeAdjustmentExplanation: testResult.gradeOverride
//       ? testResult.gradeAdjustmentExplanation
//       : null,
//     gradeAdjusted: testResult.gradeOverride ? testResult.grade : null,
//   };
// };

// export default setInitialGradeValues;
