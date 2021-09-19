export const checkFormErrors = (
  formValues, 
  page, 
  isTest,
  testFormSection,
  latestFillBlankAnswersRef, 
  validate, 
  touchField,
  setIsValid,
  ) => {
    const formErrors = validate(formValues)
    const type = isTest ? "test" : "assignment";

    if (page === 1) {
      [
        `${type}Name`,
        `${type}Weight`,
        "latePenalty",
        "lateDaysAllowed",
        "testTime",
        isTest ? "testType" : null,
      ].forEach((field) => {
        touchField(field);
      });
    }
    if (page === 2) {
      [
        "mcSectionWeight",
        "essaySectionWeight",
        "speakingSectionWeight",
        "fillBlankSectionWeight",
        "testSections",
      ].forEach((field) => {
        touchField(field);
      });
    }
    if (page === 3) {
      touchField("dueDate");
      touchField("gradeReleaseDate");
      touchField("availableOnDate");
    }
    if (page === 4) {
      const materialDisplay = [
        "multipleChoice",
        "essay",
        "speaking",
        "fillInTheBlanks",
        "test",
      ];
      materialDisplay.forEach((section) => {
        touchField(`readingMaterial.${section}.file`);
        touchField(`audioMaterial.${section}.audioFile`);
      });
    }

    if (testFormSection === "mc") {
      Array.from(formValues.mcQuestions || []).forEach((question, index) => {
        touchField(`mcQuestions.${index}.question`);
        touchField(`mcQuestions.${index}.correctAnswers`);
      });
    }
    if (testFormSection === "essay") {
      Array.from(formValues.essayQuestions || []).forEach((question, index) => {
        touchField(`essayQuestions.${index}.question`);
      });
    }
    if (testFormSection === "speaking") {
      Array.from(formValues.speakingQuestions || []).forEach(
        (question, index) => {
          touchField(`speakingQuestions.${index}.question`);
          touchField(`speakingQuestions.${index}.questionRecordedBlob`);
          touchField(`speakingQuestions.${index}.recordedBlob`);
        }
      );
    }
    if (testFormSection === "fillblanks") {
      Array.from(latestFillBlankAnswersRef.current).forEach(
        (question, index) => {
          touchField(`fillBlankQuestions.answers.${index}.browserAudioFile`);
          touchField(`fillBlankQuestions.answers.${index}.audioFile`);
          touchField(
            `fillBlankQuestions.answers.${index}.answerOptions.incorrectAnswerThree`
          );
        }
      );
    }
    if (page === 1 && formErrors.infoPageOneError) {
      setIsValid(false)
      setIsValid(false)
      return false;
    }
    if (page === 2 && formErrors.infoPageTwoError) {
      setIsValid(false)
      return false;
    }
    if (page === 3 && formErrors.infoPageThreeError) {
      setIsValid(false)
      return false;
    }
    if (page === 4 && formErrors.infoPageFourError) {
      setIsValid(false)
      return false;
    }
    if (testFormSection === "mc" && formErrors.mcSectionPageError) {
      setIsValid(false)
      return false;
    }
    if (testFormSection === "essay" && formErrors.essayPageError) {
      setIsValid(false)
      return false;
    }
    if (testFormSection === "speaking" && formErrors.speakingPageError) {
      setIsValid(false)
      return false;
    }
    if (testFormSection === "fillblanks" && formErrors.fillblankPageError) {
      setIsValid(false)
      return false;
    }
    return true;
  };